<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        page,
        onNext,
        onPrev,
    }: {
        page: Snippet<[-1 | 0 | 1]>;
        onPrev?: () => void;
        onNext?: () => void;
    } = $props();

    const LOCK_YAXIS_THRESHOLD_PX = 10;

    let viewport: HTMLDivElement;
    let offset = $state(0);
    let animating = $state(false);

    let width = 0;
    let locked = false;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let dir: 'right' | 'left' | null;

    const ontouchstart = (e: TouchEvent) => {
        const touch = e.touches[0];

        startX = lastX = touch.clientX;
        startY = lastY = touch.clientY;
        width = viewport.clientWidth;
        locked = false;
    };

    const ontouchmove = (e: TouchEvent) => {
        const touch = e.touches[0];

        lastX = touch.clientX;
        lastY = touch.clientY;

        const diffX = lastX - startX;
        const diffY = lastY - startY;

        if (!locked) {
            // Let the browser handle vertical scrolling.
            if (
                Math.abs(diffY) > LOCK_YAXIS_THRESHOLD_PX &&
                Math.abs(diffY) > Math.abs(diffX)
            ) {
                return;
            }

            if (Math.abs(diffX) < LOCK_YAXIS_THRESHOLD_PX) return;

            locked = true;
        }

        offset = diffX;
    };

    const onTouchFinish = () => {
        if (!locked) return;

        locked = false;
        animating = true;

        dir = offset > 0 ? 'right' : 'left';

        offset = dir === 'right' ? width : -width;
    };

    const ontransitionend = () => {
        if (dir === 'right') {
            onPrev?.();
        } else if (dir === 'left') {
            onNext?.();
        }

        dir = null;
        animating = false;
        offset = 0;
    };
</script>

<div
    {ontouchstart}
    {ontouchmove}
    ontouchend={onTouchFinish}
    ontouchcancel={onTouchFinish}
    role="presentation"
    class="touch-pan-y overflow-x-clip"
    bind:this={viewport}
>
    <div
        class="flex h-full w-[300%]"
        style:transform={`translate3d(calc(-100% / 3 + ${offset}px), 0, 0)`}
        style:transition={animating
            ? `transform 200ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none'}
        {ontransitionend}
    >
        <div class="h-full w-1/3 min-w-0">{@render page(-1)}</div>
        <div class="h-full w-1/3 min-w-0">{@render page(0)}</div>
        <div class="h-full w-1/3 min-w-0">{@render page(1)}</div>
    </div>
</div>
