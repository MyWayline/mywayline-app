<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
    import * as FloatingMenu from '../../../floatingmenu/index.js';
    import type { SelectState } from '../../index.ts';
    import { mergeProps } from '../../../../utils/merge-props.ts';

    let {
        children,
        child,
        disabled = false,
        ...rest
    }: {
        children?: Snippet<[]>;
        child?: Snippet<[{ props: Record<string, any> }]>;
        disabled?: boolean;
    } & HTMLButtonAttributes = $props();

    const state = getContext<SelectState>('SELECT_ROOT');
    const isDisabled = $derived(state.disabled || disabled);

    const onclick = () => {
        if (isDisabled) return;
        state.isOpen = !state.isOpen;
    };

    const mergedProps = $derived(
        mergeProps(rest, {
            onclick,
            disabled: isDisabled,
            class: 'touch-target-safe ' + (rest.class ?? ''),
            'aria-haspopup': 'dialog',
            'aria-expanded': state.isOpen,
            'aria-disabled': isDisabled,
            'data-disabled': isDisabled ? '' : undefined,
            'data-state': state.isOpen ? 'open' : 'closed',
            'data-select-trigger': '',
        })
    );
</script>

<FloatingMenu.Anchor {...rest}>
    {#snippet anchor({ props })}
        {#if child}
            {@render child({ props: mergeProps(props, mergedProps) })}
        {:else}
            <button {...mergeProps(props, mergedProps)}>
                {@render children?.()}
            </button>
        {/if}
    {/snippet}
</FloatingMenu.Anchor>
