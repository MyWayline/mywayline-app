<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        index = $bindable(0),
        slide,
        min = -Infinity,
        max = Infinity,
        threshold = 0.2,
        duration = 200,
    }: {
        index?: number;
        slide: Snippet<[number]>;
        min?: number;
        max?: number;
        threshold?: number;
        duration?: number;
    } = $props();

    const AXIS_THRESHOLD = 10;

    let viewport: HTMLDivElement;

    let offset = $state(0);
    let animating = $state(false);

    let width = 0;

    let startX = 0;
    let startY = 0;

    let dragging = false;
    let vertical = false;

    let swipeDirection: 1 | -1 | null = null;

    const canGo = (direction: 1 | -1) => (direction === 1 ? index < max : index > min);

    const onTouchStart = (e: TouchEvent) => {
        if (animating) return;

        const touch = e.touches[0];

        if (!touch) return;

        startX = touch.clientX;
        startY = touch.clientY;

        width = viewport.clientWidth;

        dragging = false;
        vertical = false;
        swipeDirection = null;
    };

    const onTouchMove = (e: TouchEvent) => {
        if (animating || vertical) return;

        const touch = e.touches[0];

        if (!touch) return;

        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (!dragging) {
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            if (absX < AXIS_THRESHOLD && absY < AXIS_THRESHOLD) {
                return;
            }

            if (absY > absX) {
                vertical = true;
                return;
            }
            dragging = true;
        }

        const direction: 1 | -1 = dx < 0 ? 1 : -1;

        swipeDirection = direction;

        offset = canGo(direction) ? dx : dx * 0.25;
    };

    const onTouchEnd = () => {
        if (vertical) {
            vertical = false;
            dragging = false;
            return;
        }

        if (!dragging) {
            return;
        }

        dragging = false;

        const direction = swipeDirection ?? (offset < 0 ? 1 : -1);

        const movedFarEnough = Math.abs(offset) >= width * threshold;

        if (movedFarEnough && canGo(direction)) {
            swipeDirection = direction;
            animating = true;

            offset = direction === 1 ? -width : width;

            return;
        }

        swipeDirection = null;
        animating = true;
        offset = 0;
    };

    const onTouchCancel = () => {
        dragging = false;
        vertical = false;
        swipeDirection = null;

        if (offset !== 0) {
            animating = true;
            offset = 0;
        } else {
            animating = false;
        }
    };

    const onTransitionEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'transform') return;

        if (swipeDirection !== null && canGo(swipeDirection)) {
            index += swipeDirection;
        }

        swipeDirection = null;
        animating = false;
        offset = 0;
    };
</script>

<div
    bind:this={viewport}
    ontouchstart={onTouchStart}
    ontouchmove={onTouchMove}
    ontouchend={onTouchEnd}
    ontouchcancel={onTouchCancel}
    role="group"
    aria-roledescription="carousel"
    class="relative overflow-hidden"
>
    <div
        class="flex h-full w-[300%]"
        style:transform={`translate3d(calc(-100% / 3 + ${offset}px), 0, 0)`}
        style:transition={animating
            ? `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none'}
        ontransitionend={onTransitionEnd}
    >
        <div class="h-full w-1/3 shrink-0" inert={index <= min}>
            {@render slide(index - 1)}
        </div>

        <div class="h-full w-1/3 shrink-0">
            {@render slide(index)}
        </div>

        <div class="h-full w-1/3 shrink-0" inert={index >= max}>
            {@render slide(index + 1)}
        </div>
    </div>
</div>
