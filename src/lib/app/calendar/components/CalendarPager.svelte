<script lang="ts">
    import { tick } from 'svelte';
    import type { Snippet } from 'svelte';
    import type { EmblaCarouselType, EmblaOptionsType, EngineType } from 'embla-carousel';
    import useEmblaCarousel from 'embla-carousel-svelte';

    let {
        header,
        content,
        sidebar,
        scrollY = true,
        onprev,
        onnext,
    }: {
        scrollY?: boolean;
        header?: Snippet<[number]>;
        content?: Snippet<[number]>;
        sidebar?: Snippet<[]>;
        onprev?: () => void;
        onnext?: () => void;
    } = $props();

    let slides = $state([-2, -1, 0, 1, 2]);
    // Index of the slide which is being viewed
    let centerIndex = $state(0);

    let isShifting = false;
    let extending = false;
    let pendingExtend: 'start' | 'end' | null = null;

    let contentApi: EmblaCarouselType;
    let headerApi: EmblaCarouselType | undefined;

    const options: EmblaOptionsType = {
        containScroll: 'keepSnaps',
        watchSlides: false,
        watchResize: false,
        startIndex: 2,
        duration: 20,
    };

    const headerOptions: EmblaOptionsType = { ...options, watchDrag: false };

    const CARRIED_MODULES: (keyof EngineType)[] = [
        'scrollBody',
        'location',
        'offsetLocation',
        'previousLocation',
        'target',
    ];

    const onHeaderInit = (event: Event) => {
        headerApi = (event as CustomEvent<EmblaCarouselType>).detail;
    };

    const onContentInit = (event: Event) => {
        contentApi = (event as CustomEvent<EmblaCarouselType>).detail;

        contentApi.on('scroll', onScroll);
        contentApi.on('scroll', syncHeader);
        contentApi.on('pointerUp', () => void flushExtend());
        contentApi.on('settle', onSettle);
    };

    /**
     * Mirror the content carousel's position onto the header.
     * */
    const syncHeader = (api: EmblaCarouselType) => {
        if (!headerApi) return;
        if (api.slideNodes().length !== headerApi.slideNodes().length) return;

        const contentEngine = api.internalEngine();
        const headerEngine = headerApi.internalEngine();

        const contentLocation = contentEngine.location.get();
        const contentLimit = contentEngine.limit;

        const progress =
            contentLimit.max === contentLimit.min
                ? 0
                : (contentLocation - contentLimit.max) /
                  (contentLimit.min - contentLimit.max);

        const headerLimit = headerEngine.limit;
        const headerLocation =
            headerLimit.max - progress * (headerLimit.max - headerLimit.min);

        headerEngine.location.set(headerLocation);
        headerEngine.target.set(headerLocation);
        headerEngine.offsetLocation.set(headerLocation);
        headerEngine.previousLocation.set(headerLocation);
        headerEngine.translate.to(headerLocation);
    };

    /**
     * SlideId of the page closest to viewport
     * */
    const nearestSlide = (api: EmblaCarouselType): number | undefined => {
        const engine = api.internalEngine();
        const location = engine.location.get();

        let nearest = 0;
        let best = Infinity;
        engine.scrollSnaps.forEach((snap, i) => {
            const distance = Math.abs(snap - location);
            if (distance < best) {
                best = distance;
                nearest = i;
            }
        });

        return slides[nearest];
    };

    /**
     * Move Date and offset origin together, sets the new slidenumber as activePage
     * */
    const commit = (slide: number | undefined) => {
        if (slide === undefined) return;

        const delta = slide - centerIndex;
        if (delta === 0) return;

        centerIndex = slide;

        if (delta < 0) {
            for (let i = 0; i < -delta; i++) onprev?.();
        } else {
            for (let i = 0; i < delta; i++) onnext?.();
        }
    };

    /**
     * Re-initialise an engine after the slide list changed without losing its
     * motion. `prepended` means a slide was added at the start, which shifts every
     * snap by one slide width, so position and target have to move with it.
     */
    const reInitKeepingMotion = (api: EmblaCarouselType, prepended: boolean) => {
        const oldEngine = api.internalEngine();

        api.reInit();

        const engine = api.internalEngine();

        CARRIED_MODULES.forEach((module) => {
            Object.assign(engine[module], oldEngine[module]);
        });

        if (prepended && engine.scrollSnaps.length > 1) {
            // Snaps are negative (added to start -> left slide)
            const shift = engine.scrollSnaps[1] - engine.scrollSnaps[0];

            (
                ['location', 'offsetLocation', 'previousLocation', 'target'] as const
            ).forEach((module) => engine[module].set(engine[module].get() + shift));
        }

        engine.translate.to(engine.location.get());

        const { index } = engine.scrollTarget.byDistance(0, false);
        engine.index.set(index);
        engine.animation.start();
    };

    const onScroll = (api: EmblaCarouselType) => {
        if (extending || isShifting) return;

        // Keep date in tact with the current slide on the screen, also when not settled
        commit(nearestSlide(api));

        const inView = api.slidesInView();
        const lastSlide = api.slideNodes().length - 1;

        if (inView.includes(lastSlide)) pendingExtend = 'end';
        else if (inView.includes(0)) pendingExtend = 'start';

        if (pendingExtend) void flushExtend();
    };

    /**
     * Adds a slide on the requested side and re-initialises both carousels in one
     * synchronous block. If the finger is still down we wait for pointerUp, since
     * reInit would kill the active drag.
     */
    const flushExtend = async () => {
        if (!pendingExtend || extending || isShifting || !contentApi) return;
        if (contentApi.internalEngine().dragHandler.pointerDown()) return;

        const direction = pendingExtend;
        pendingExtend = null;
        extending = true;

        slides =
            direction === 'start'
                ? [slides[0] - 1, ...slides]
                : [...slides, slides[slides.length - 1] + 1];

        await tick();

        reInitKeepingMotion(contentApi, direction === 'start');
        if (headerApi) {
            headerApi.reInit();
            syncHeader(contentApi);
        }

        extending = false;
    };

    /**
     * When we swap pages while still scrolling and not settled, we added a lot of pages (probably)
     * So many slides are rendered on the dom: The Problem: they might get to many. So when the slides are settled (no movement at all)
     * we silently remove all the unused slides and just kee+ +2/-2 from the center. Then we also adjust the index because we start from 2 again
     *
     * We can't do this while appending new slides since this would cause jumps and mess with the carousel engine
     * */
    const onSettle = async () => {
        if (isShifting || extending || !contentApi) return;

        const snap = contentApi.selectedScrollSnap();
        commit(slides[snap]);

        if (slides.length === 5 && snap === 2) return;

        isShifting = true;
        pendingExtend = null;

        // Same slide ids stay keyed, so their DOM is kept, only the edges change.
        slides = Array.from({ length: 5 }, (_, i) => centerIndex + i - 2);

        await tick();

        contentApi.reInit();
        headerApi?.reInit();

        contentApi.scrollTo(2, true);
        headerApi?.scrollTo(2, true);

        isShifting = false;
    };
</script>

<div
    class="grid h-full min-h-0 min-w-0 w-full grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden"
>
    <div class="bg-bg-primary"></div>
    <!-- Header -->
    {#if header}
        <div class="col-start-2 min-w-0 overflow-hidden">
            <div
                class="h-full"
                onemblaInit={onHeaderInit}
                use:useEmblaCarousel={{ options: headerOptions, plugins: [] }}
            >
                <div class="flex h-full">
                    {#each slides as slide (slide)}
                        <div class="min-w-0 flex-[0_0_100%]">
                            {@render header(slide - centerIndex)}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}

    <!-- Content -->
    <div
        class="col-span-2 row-start-2 grid min-h-0 min-w-0 grid-cols-subgrid grid-rows-[minmax(auto,1fr)] overflow-x-hidden scrollbar-none"
        class:overflow-y-auto={scrollY}
        class:overflow-y-hidden={!scrollY}
    >
        <aside class="min-w-0">
            {#if sidebar}
                {@render sidebar()}
            {/if}
        </aside>

        <div
            class="min-w-0 overflow-hidden"
            onemblaInit={onContentInit}
            use:useEmblaCarousel={{ options, plugins: [] }}
        >
            <div
                class="flex h-full"
                class:touch-pan-y={scrollY}
                class:touch-none={!scrollY}
            >
                {#each slides as slide (slide)}
                    <div class="min-w-0 flex-[0_0_100%]">
                        {@render content?.(slide - centerIndex)}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
