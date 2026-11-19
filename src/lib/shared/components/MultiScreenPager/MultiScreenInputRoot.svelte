<script lang="ts">
    import { tick, type Snippet } from 'svelte';
    import { setMultiScreenInputContext } from './multiScreenInputContext.svelte';
    import type { EmblaCarouselType, EmblaOptionsType, EngineType } from 'embla-carousel';
    import useEmblaCarousel from 'embla-carousel-svelte';
    import { SvelteMap } from 'svelte/reactivity';

    let {
        children,
        defaultValue = '',
    }: { children?: Snippet<[]>; defaultValue: string } = $props();

    let emblaApi: EmblaCarouselType;
    let path = $derived<string[]>([defaultValue]);
    const registry = new SvelteMap<string, () => Snippet<[]> | undefined>();

    setMultiScreenInputContext({
        register(newValue, getContent) {
            registry.set(newValue, getContent);
            return () => registry.delete(newValue);
        },
        async setSelectedValue(newValue: string) {
            if (isAnimating) return;
            const prevScreen = path[path.length - 2];

            if (prevScreen === newValue) {
                emblaApi.scrollPrev();
            } else if (newValue === defaultValue) {
                path = [defaultValue, prevScreen];
                emblaApi.scrollPrev();
            } else {
                path = [...path, newValue];
                await tick();
                emblaApi.scrollNext();
            }
        },
        get defaultValue() {
            return defaultValue;
        },
    });

    // Is enabled when we are scrolling
    let isAnimating = false;

    const options: EmblaOptionsType = {
        containScroll: 'keepSnaps',
        duration: 20,
        watchDrag: (emblaApi) => {
            if (path.length <= 1) return false;
            return !isAnimating;
        },
    };

    const onInit = (event: Event) => {
        const customEvent = event as CustomEvent<EmblaCarouselType>;
        emblaApi = customEvent.detail;

        emblaApi.on('settle', onsettle);
        emblaApi.on('scroll', () => {
            isAnimating = true;
        });
        emblaApi.on('scroll', onScroll);
        emblaApi.on('settle', () => {
            isAnimating = false;
        });
    };

    let lastIndex = 0;

    // When we only have < 0.001 progress left to next page, which in embla engine often take very long, we insta settle with a "jump" the user won't notice
    const onScroll = (emblaApi: EmblaCarouselType) => {
        isAnimating = true;

        const engine = emblaApi.internalEngine();
        const currentIndex = lastIndex;
        const targetIndex = engine.index.get();

        if (currentIndex === targetIndex) return;

        const snaps = emblaApi.scrollSnapList();
        const currentSnap = snaps[currentIndex];
        const targetSnap = snaps[targetIndex];

        if (currentSnap === undefined || targetSnap === undefined) return;

        const progress = emblaApi.scrollProgress();

        const distance = targetSnap - currentSnap;
        const pageProgress = (progress - currentSnap) / distance;

        if (pageProgress >= 0.999) {
            emblaApi.scrollTo(targetIndex, true);
        }
    };

    const onsettle = (emblaApi: EmblaCarouselType) => {
        const currentIndex = emblaApi.selectedScrollSnap();

        if (currentIndex !== lastIndex) {
            const direction = currentIndex > lastIndex ? 'forward' : 'backward';

            if (direction === 'backward') {
                path = path.length > 1 ? path.slice(0, -1) : [defaultValue];
            }

            lastIndex = currentIndex;
        }
    };
</script>

<div
    class="h-full flex flex-col overflow-hidden"
    onemblaInit={onInit}
    use:useEmblaCarousel={{ options, plugins: [] }}
>
    <div class="flex flex-start h-full">
        {#each path as pathItem (pathItem)}
            {@const content = registry.get(pathItem)?.()}
            <div class="min-w-0 flex-[0_0_100%]">
                {@render content?.()}
            </div>
        {/each}
    </div>
</div>
{@render children?.()}
