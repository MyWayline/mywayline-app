<script lang="ts">
    import { flushSync, tick, type Snippet } from 'svelte';
    import type { EmblaCarouselType, EmblaOptionsType, EngineType } from 'embla-carousel';
    import useEmblaCarousel from 'embla-carousel-svelte';

    let {
        centerIndex = $bindable(0),
        emblaApi = $bindable(),
        onprev,
        onnext,
        slide,
    }: {
        centerIndex?: number;
        emblaApi?: EmblaCarouselType;
        onprev?: () => void;
        onnext?: () => void;
        slide?: Snippet<[number]>;
    } = $props();

    let slides = $state([-2, -1, 0, 1, 2]);

    let isShifting = false;
    let extending = false;
    let pendingExtend: 'start' | 'end' | null = null;

    const options: EmblaOptionsType = {
        containScroll: 'keepSnaps',
        watchSlides: false,
        watchResize: false,
        startIndex: 2,
        duration: 20,
    };

    const CARRIED_MODULES: (keyof EngineType)[] = [
        'scrollBody',
        'location',
        'offsetLocation',
        'previousLocation',
        'target',
    ];

    const onInit = (event: Event) => {
        const customEvent = event as CustomEvent<EmblaCarouselType>;
        emblaApi = customEvent.detail;

        emblaApi.on('scroll', onScroll);
        emblaApi.on('pointerUp', () => void flushExtend());
        emblaApi.on('settle', onSettle);
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
        if (!pendingExtend || extending || isShifting || !emblaApi) return;
        if (emblaApi.internalEngine().dragHandler.pointerDown()) return;

        const direction = pendingExtend;
        pendingExtend = null;
        extending = true;

        slides =
            direction === 'start'
                ? [slides[0] - 1, ...slides]
                : [...slides, slides[slides.length - 1] + 1];

        await tick();

        reInitKeepingMotion(emblaApi, direction === 'start');

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
        if (isShifting || extending || !emblaApi) return;

        const snap = emblaApi.selectedScrollSnap();
        commit(slides[snap]);

        if (slides.length === 5 && snap === 2) return;

        isShifting = true;
        pendingExtend = null;

        // Same slide ids stay keyed, so their DOM is kept, only the edges change.
        slides = Array.from({ length: 5 }, (_, i) => centerIndex + i - 2);

        await tick();

        emblaApi.reInit();

        emblaApi.scrollTo(2, true);

        isShifting = false;
    };
</script>

<div onemblaInit={onInit} use:useEmblaCarousel={{ options, plugins: [] }}>
    <div class="flex">
        {#each slides as slideNum (slideNum)}
            <div class="min-w-0 flex-[0_0_100%]">
                {@render slide?.(slideNum - centerIndex)}
            </div>
        {/each}
    </div>
</div>
