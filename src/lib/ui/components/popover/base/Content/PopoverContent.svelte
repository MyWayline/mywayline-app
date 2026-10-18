<script lang="ts">
    import { getContext, type Snippet, onDestroy } from 'svelte';
    import * as FloatingMenu from '../../../floatingmenu/index.js';
    import type { PopoverState } from '../../index.ts';
    import { mergeProps } from '../../../../utils/merge-props.ts';
    import type { HTMLAttributes } from 'svelte/elements';
    import { focusUtils } from '../../../../utils/focus.ts';
    import { preventScroll } from '../../../../utils/preventOusideInteraction.ts';

    let {
        children,
        child,
        ref = $bindable(),
        side = 'bottom',
        align,
        offset,
        padding,
        fitViewport,
        ignoreOutsideClick = false,
        ignoreEscape = false,
        enableFocusTrap = true,
        preventScroll: shouldPreventScroll = false,
        ...rest
    }: {
        children?: Snippet<[]>;
        child?: Snippet<[{ props: Record<string, unknown> }]>;
        ref?: HTMLDivElement;
        ignoreOutsideClick?: boolean;
        ignoreEscape?: boolean;
        enableFocusTrap?: boolean;
        preventScroll?: boolean;
    } & FloatingMenu.FloatingMenuContentProps &
        HTMLAttributes<HTMLDivElement> = $props();

    let state = getContext<PopoverState>('POPOVER_ROOT');

    let cleanupFocusTrap: (() => void) | undefined;
    let cleanupInteraction: (() => void) | undefined;

    $effect(() => {
        if (!state.isOpen) return;

        if (enableFocusTrap) {
            focusUtils.trap(ref as HTMLElement).then((cleanup) => {
                cleanupFocusTrap = cleanup;
            });
        }

        if (shouldPreventScroll) {
            cleanupInteraction = preventScroll(ref as HTMLElement);
        }

        return () => {
            cleanupFocusTrap?.();
            cleanupFocusTrap = undefined;
            cleanupInteraction?.();
            cleanupInteraction = undefined;
        };
    });

    const onDocumentPointerDown = (e: PointerEvent) => {
        if (!state.isOpen || ignoreOutsideClick) return;

        const target = e.target as HTMLElement;

        if (!ref) return;

        if (ref.contains(target)) return;

        if (target.hasAttribute('data-popover-trigger')) return;
        state.isOpen = false;
    };

    const mergedProps = $derived(
        mergeProps(rest, {
            'data-popover-content': '',
            role: 'listbox',
            tabindex: -1,
            style: 'overscroll-behavior: contain;',
            onkeydown: (e: KeyboardEvent) => {
                if (e.key === 'Escape' && !ignoreEscape) {
                    state.isOpen = false;
                }
            },
        })
    );
</script>

<svelte:document onpointerdown={onDocumentPointerDown} />

{#if state.isOpen}
    <FloatingMenu.Content {side} {align} {offset} {padding} {fitViewport} bind:ref>
        {#snippet content({ props })}
            {#if child}
                {@render child({ props: mergeProps(props, mergedProps) })}
            {:else}
                <div {...mergeProps(props, mergedProps)}>
                    {@render children?.()}
                </div>
            {/if}
        {/snippet}
    </FloatingMenu.Content>
{/if}
