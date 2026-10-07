<script lang="ts">
    import { getContext } from 'svelte';
    import { innerHeight, innerWidth, scrollY, scrollX } from 'svelte/reactivity/window';
    import type { FloatingMenuState } from '../../floating.svelte.ts';
    import { mergeProps } from '../../../../utils/merge-props.ts';
    import { withRef } from '../../../../utils/ref-attachment.ts';
    import type { FloatingMenuContentProps } from '../../index.ts';
    import { withPortal } from '../../../../utils/portal.ts';

    let {
        side = 'top',
        align = 'center',
        offset = 8,
        padding = 8,
        fitViewport = false, // true = fixed/clamped, false = absolute/stay where you are at besides from flipping
        content,
        ref = $bindable(),
        ...rest
    }: FloatingMenuContentProps & { fitViewport?: boolean } = $props();

    const baseState = getContext<FloatingMenuState>('FLOATING_MENU_ROOT');

    $effect(() => {
        if (!baseState.anchor) return;
        const observer = new MutationObserver(() => baseState.update());
        observer.observe(baseState.anchor, {
            attributes: true,
            attributeFilter: ['style', 'class'],
        });
        return () => observer.disconnect();
    });

    const coords = $derived.by(() => {
        baseState.version;
        const sy = scrollY.current ?? 0;
        const sx = scrollX.current ?? 0;
        const vh = innerHeight.current ?? 0;
        const vw = innerWidth.current ?? 0;

        if (!baseState.anchor || !baseState.content || vh === 0) {
            return { top: 0, left: 0, maxHeight: 'none', visibility: 'hidden' as const };
        }

        const anchor = baseState.anchor.getBoundingClientRect();
        const contentRect = baseState.content.getBoundingClientRect();

        let finalSide = side;
        let finalAlign = align;

        // Flipping if space it not available
        if (side === 'top' && anchor.top - offset - contentRect.height < padding) {
            finalSide = 'bottom';
        } else if (
            side === 'bottom' &&
            anchor.bottom + offset + contentRect.height > vh - padding
        ) {
            finalSide = 'top';
        }

        if (side === 'left' && anchor.left - offset - contentRect.width < padding) {
            finalSide = 'right';
        } else if (
            side === 'right' &&
            anchor.right + offset + contentRect.width > vw - padding
        ) {
            finalSide = 'left';
        }

        // Base coordinates (Viewport relative)
        let top = 0;
        let left = 0;

        // Calculate Side
        if (finalSide === 'top') {
            top = anchor.top - contentRect.height - offset;
        } else if (finalSide === 'bottom') {
            top = anchor.bottom + offset;
        } else if (finalSide === 'left') {
            left = anchor.left - contentRect.width - offset;
        } else if (finalSide === 'right') {
            left = anchor.right + offset;
        }

        // Calculate Align
        if (finalSide === 'top' || finalSide === 'bottom') {
            if (finalAlign === 'start') left = anchor.left;
            else if (finalAlign === 'center')
                left = anchor.left + anchor.width / 2 - contentRect.width / 2;
            else if (finalAlign === 'end') left = anchor.right - contentRect.width;
        } else {
            if (finalAlign === 'start') top = anchor.top;
            else if (finalAlign === 'center')
                top = anchor.top + anchor.height / 2 - contentRect.height / 2;
            else if (finalAlign === 'end') top = anchor.bottom - contentRect.height;
        }

        // Max height calculation to know when to add a scrollbar
        let availableHeight = vh - padding * 2;
        if (finalSide === 'bottom')
            availableHeight = vh - anchor.bottom - offset - padding;
        if (finalSide === 'top') availableHeight = anchor.top - offset - padding;

        // Clamping & Strategy
        if (fitViewport) {
            // Clamping for fixed strategy -> prevent bleeding off edges
            left = Math.max(padding, Math.min(left, vw - contentRect.width - padding));
            top = Math.max(padding, Math.min(top, vh - contentRect.height - padding));
        } else {
            // We still clamp horizontally so it doesn't cause page horizontal scroll
            left = Math.max(padding, Math.min(left, vw - contentRect.width - padding));

            // Convert to Document coordinates
            top += sy;
            left += sx;
        }

        return {
            top,
            left,
            maxHeight: availableHeight,
            visibility: 'visible' as const,
        };
    });

    $effect(() => {
        if (ref) baseState.content = ref;
    });

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                id: baseState.contentId,
                'aria-labelledby': baseState.triggerId,
                'data-side': side,
                'data-align': align,
                style: {
                    position: fitViewport ? 'fixed' : 'absolute',
                    top: `${coords.top}px`,
                    left: `${coords.left}px`,
                    'max-height': `${coords.maxHeight}px`,
                    'max-width': `calc(100vw - ${padding * 2}px)`,
                    'overflow-y': 'auto',
                    display: 'flex',
                    'flex-direction': 'column',
                    visibility: coords.visibility,
                    'z-index': 50,
                    'pointer-events': coords.visibility === 'hidden' ? 'none' : 'auto',
                },
            },
            withRef((el) => {
                ref = el as HTMLDivElement;
            }),
            withPortal()
        )
    );
</script>

{@render content?.({ props: mergedProps })}
