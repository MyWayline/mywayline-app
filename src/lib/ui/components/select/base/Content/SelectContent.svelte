<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import * as FloatingMenu from '../../../floatingmenu/index.js';
    import type { SelectState } from '../../index.ts';
    import { mergeProps } from '../../../../utils/merge-props.ts';
    import type { HTMLAttributes } from 'svelte/elements';
    import { withRef } from '../../../../utils/ref-attachment.ts';
    import { focusUtils } from '../../../../utils/focus.ts';
    import { preventScroll as preventScrollUtil } from '../../../../utils/preventOusideInteraction.ts';

    let {
        children,
        child,
        ref = $bindable(),
        side,
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

    let state = getContext<SelectState>('SELECT_ROOT');

    let cleanupFocusTrap: (() => void) | undefined;
    let cleanupScroll: (() => void) | undefined;

    $effect(() => {
        if (!state.isOpen || !ref) return;

        if (enableFocusTrap) {
            focusUtils.trap(ref).then((cleanup) => {
                cleanupFocusTrap = cleanup;
            });
        }

        if (shouldPreventScroll) {
            cleanupScroll = preventScrollUtil(ref);
        }

        return () => {
            cleanupFocusTrap?.();
            cleanupFocusTrap = undefined;
            cleanupScroll?.();
            cleanupScroll = undefined;
        };
    });

    const onDocumentPointerDown = (event: PointerEvent) => {
        if (!state.isOpen || ignoreOutsideClick) return;

        const target = event.target as HTMLElement | null;
        if (!target || !ref) return;
        if (ref.contains(target)) return;
        if (target.closest('[data-select-trigger], [data-select-content]')) return;

        state.isOpen = false;
    };

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                'data-select-content': '',
                role: 'listbox',
                tabindex: -1,
                onkeydown: (event: KeyboardEvent) => {
                    if (event.key === 'Escape' && !ignoreEscape) {
                        event.preventDefault();
                        state.isOpen = false;
                    }
                },
            },
            withRef((el) => (ref = el as HTMLDivElement))
        )
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
