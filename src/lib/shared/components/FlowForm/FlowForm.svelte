<script lang="ts" generics="FormValues extends object">
    import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
    import type { FlowScreen } from '.';
    import useEmblaCarousel from 'embla-carousel-svelte';
    import { FlowContext } from './flowFormContext.svelte';
    import { setFlowContext } from './flowFormContext.svelte';
    import { tick, untrack } from 'svelte';

    let {
        values = $bindable(),
        screens,
        slideClass,
    }: {
        values: FormValues;
        screens: Record<string, FlowScreen<FormValues>>;
        slideClass?: string;
    } = $props();

    let embla: EmblaCarouselType | undefined;
    let lastIndex = 0;

    let flowContext = setFlowContext(new FlowContext());

    const options: EmblaOptionsType = {
        containScroll: 'keepSnaps',
        duration: 20,
        // Swiping only allows back, forward navigation is  always a link
        watchDrag: () => flowContext.canGoBack && !flowContext.busy,
    };

    const onInit = (event: Event) => {
        const api = (event as CustomEvent<EmblaCarouselType>).detail;
        embla = api;
        lastIndex = api.selectedScrollSnap();

        api.on('scroll', () => {
            flowContext.busy = true;
            skipTail(api);
        });
        api.on('settle', () => {
            flowContext.busy = false;
            lastIndex = api.selectedScrollSnap();
            flowContext.commit(lastIndex);
        });
    };

    const skipTail = (api: EmblaCarouselType) => {
        const target = api.internalEngine().index.get();
        if (target === lastIndex) return;

        const snaps = api.scrollSnapList();
        const from = snaps[lastIndex];
        const to = snaps[target];
        if (from === undefined || to === undefined) return;

        const progress = (api.scrollProgress() - from) / (to - from);
        if (progress >= 0.999) api.scrollTo(target, true);
    };

    $effect(() => {
        const target = flowContext.index;
        void flowContext.stack;

        untrack(async () => {
            await tick();
            if (!embla) return;
            embla.reInit();
            if (embla.selectedScrollSnap() !== target) embla.scrollTo(target);
        });
    });
</script>

<div
    class="flex-1 min-h-0 min-w-0 overflow-hidden"
    onemblaInit={onInit}
    use:useEmblaCarousel={{ options, plugins: [] }}
>
    <div class="flex h-full min-h-0">
        {#each flowContext.stack as entry (entry.key)}
            {@const screen = screens[entry.id]}

            <div
                class="min-w-0 h-full min-h-0 flex-[0_0_100%] overflow-y-auto {slideClass}"
            >
                {#if screen}
                    {@const Component = screen.component}
                    <Component bind:values />
                {:else}
                    <p class="p-6 text-muted-foreground">
                        Unknown form screen "{entry.id}". Please open a support ticket if
                        you are seeing this.
                    </p>
                {/if}
            </div>
        {/each}
    </div>
</div>
