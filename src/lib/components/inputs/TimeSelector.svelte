<script lang="ts">
    import type { EmblaCarouselType, EmblaOptionsType, EngineType } from 'embla-carousel';
    import useEmblaCarousel from 'embla-carousel-svelte';

    let {
        preset = 'minutes',
        startIndex = 0,
        selectedIndex = $bindable(0),
        onselectchange,
    }: {
        preset?: 'minutes' | 'hours';
        startIndex?: number;
        selectedIndex?: number;
        onselectchange?: (index: number) => void;
    } = $props();

    let items = $derived(
        Array.from({ length: preset === 'minutes' ? 60 : 24 }, (_, i) =>
            String(i).padStart(2, '0')
        )
    );

    let emblaOptions: EmblaOptionsType = {
        dragFree: true,
        containScroll: false,
        axis: 'y',
        loop: true,
        watchSlides: false,
        duration: 0,
        startIndex: startIndex,
    };

    const CIRCLE_DEGREES = 360;
    const WHEEL_ITEM_BENDING_SIZE = 40;
    const WHEEL_ITEM_BENDING_COUNT = 18;
    const WHEEL_ITEM_BENDING_RADIUS = Math.round(
        WHEEL_ITEM_BENDING_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_BENDING_COUNT)
    );
    const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_BENDING_COUNT;

    // Items in view says, which how many items around them iddle should be in view, these will be loaded with a special opacity etc.
    // Later, we limit it to 3 items, while the more items in view will fade out smoothly
    const WHEEL_ITEMS_IN_VIEW = 4;
    const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW;

    const slideIsInView = (wheelLocation: number, slidePosition: number): boolean =>
        Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES;

    const rotateSlide = (
        emblaApi: EmblaCarouselType,
        index: number,
        loop: boolean,
        slideCount: number,
        totalRadius: number
    ): void => {
        const slideNode = emblaApi.slideNodes()[index];
        const wheelLocation = emblaApi.scrollProgress() * totalRadius;
        const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius;
        const positionLoopStart = positionDefault + totalRadius;
        const positionLoopEnd = positionDefault - totalRadius;

        let inView = false;
        let angle = index * -WHEEL_ITEM_RADIUS;
        let activePosition = positionDefault;

        if (slideIsInView(wheelLocation, positionDefault)) {
            inView = true;
            activePosition = positionDefault;
        }

        if (loop && slideIsInView(wheelLocation, positionLoopEnd)) {
            inView = true;
            angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS;
            activePosition = positionLoopEnd;
        }

        if (loop && slideIsInView(wheelLocation, positionLoopStart)) {
            inView = true;
            angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS;
            activePosition = positionLoopStart;
        }

        if (inView) {
            const degreeDistance = Math.abs(wheelLocation - activePosition);
            const itemDistance = degreeDistance / WHEEL_ITEM_RADIUS; // 0.0 (Mitte) bis 2.2 (Rand)

            // Everything with distance +/- 1 (neighbors) got a opacity till 0.35
            // Everything further than distance +/- 1 will go fast towards 0
            // Bis zu einem Abstand von 1.0 (also die direkten Nachbarn im Stillstand)
            //
            // Ensures that only 3 items are visible at halt
            let liveOpacity = 0;
            if (itemDistance <= 1.0) {
                liveOpacity = 1.0 - itemDistance * (1.0 - 0.35);
                // 2 extra items on each side beside the 3 visible items that slowly fade away for smooth transition
            } else if (itemDistance > 1.0 && itemDistance <= WHEEL_ITEMS_IN_VIEW) {
                const overflowProgress =
                    (itemDistance - 1.0) / (0.2 * WHEEL_ITEMS_IN_VIEW);
                liveOpacity = 0.35 * (1.0 - overflowProgress);
            } else {
                liveOpacity = 0;
            }

            slideNode.style.opacity = liveOpacity.toString();

            slideNode.style.transform = `translateY(-${
                index * 100
            }%) rotateX(${angle}deg) translateZ(${WHEEL_ITEM_BENDING_RADIUS}px)`;
        } else {
            slideNode.style.opacity = '0';
            slideNode.style.transform = 'none';
            slideNode.style.fontWeight = '400';
        }
    };

    const rotateSlides = (
        emblaApi: EmblaCarouselType,
        loop: boolean,
        slideCount: number,
        totalRadius: number
    ): (() => void) => {
        return (): void => {
            for (let index = 0; index < slideCount; index += 1) {
                rotateSlide(emblaApi, index, loop, slideCount, totalRadius);
            }
        };
    };

    const rotateWheel = (
        emblaApi: EmblaCarouselType,
        slideCount: number,
        rotationOffset: number
    ): (() => void) => {
        return (): void => {
            const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset;
            const wheelRotation = rotation * emblaApi.scrollProgress();
            emblaApi.containerNode().style.transform = `translateZ(${WHEEL_ITEM_BENDING_RADIUS}px) rotateX(${wheelRotation}deg)`;
        };
    };

    const inactivateEmblaTransform = (emblaApi: EmblaCarouselType): void => {
        const { translate, slideLooper } = emblaApi.internalEngine();
        translate.clear();
        translate.toggleActive(false);
        slideLooper.loopPoints.forEach(({ translate }) => {
            translate.clear();
            translate.toggleActive(false);
        });
    };

    const onPickerInit = (event: CustomEvent<EmblaCarouselType>): void => {
        const api = event.detail;
        const slideCount = api.slideNodes().length;
        const {
            options: { loop },
        } = api.internalEngine();

        const totalRadius = slideCount * WHEEL_ITEM_RADIUS;
        const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS;
        const rotateWheelFunc = rotateWheel(api, slideCount, rotationOffset);
        const rotateSlidesFunc = rotateSlides(api, loop, slideCount, totalRadius);
        const rotate = (): void => {
            rotateWheelFunc();
            rotateSlidesFunc();
        };

        const updateSelectedIndex = (): void => {
            const currentIndex = api.selectedScrollSnap();

            if (selectedIndex !== currentIndex) {
                selectedIndex = currentIndex;
                if (onselectchange) onselectchange(currentIndex);
            }
        };
        api.on('select', updateSelectedIndex);
        api.on('pointerUp', () => {
            const { scrollTo, target, location } = api.internalEngine();
            const diffToTarget = target.get() - location.get();
            const factor =
                Math.abs(diffToTarget) < WHEEL_ITEM_BENDING_SIZE / 2.5 ? 10 : 0.1;
            const distance = diffToTarget * factor;
            scrollTo.distance(distance, true);
        });
        api.internalEngine().scrollBody.useFriction(3);
        api.on('scroll', rotate);

        api.on('reInit', () => {
            inactivateEmblaTransform(api);
            rotate();
        });

        inactivateEmblaTransform(api);
        rotate();
    };
</script>

<div class="touch-pan-x flex items-center content-start overflow-hidden h-full min-w-10">
    <div
        onemblaInit={onPickerInit}
        use:useEmblaCarousel={{
            options: emblaOptions,
            plugins: [],
        }}
        class="max-w-30 h-10 w-full perspective-[1000px] select-none"
    >
        <div class="h-full w-full transform-3d">
            {#each items as num (num)}
                <div
                    class=" text-xl font-semibold flex items-center justify-center backface-hidden text-center h-full w-full opacity-0"
                >
                    {num}
                </div>
            {/each}
        </div>
    </div>
</div>
