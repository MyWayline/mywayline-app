<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import * as FloatingMenu from '../../../floatingmenu/index.js';
    import type { PopoverState } from '../../index.ts';
    import { mergeProps } from '../../../../utils/merge-props.ts';
    import { withRef } from '../../../../utils/ref-attachment.ts';

    let {
        children,
        child,
        disabled = false,
        ref = $bindable(),
        ...rest
    }: {
        children?: Snippet<[]>;
        child?: Snippet<[{ props: Record<string, unknown> }]>;
        disabled?: boolean;
        ref?: HTMLButtonElement;
    } & HTMLButtonAttributes = $props();

    const state = getContext<PopoverState>('POPOVER_ROOT');

    const onclick = () => {
        if (disabled) return;
        state.isOpen = !state.isOpen;
    };

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                class: 'touch-target-safe ' + (rest.class ?? ''),
                onclick,
                'aria-haspopup': 'dialog',
                'aria-expanded': state.isOpen,
                'aria-disabled': disabled,
                'data-disabled': disabled ? '' : undefined,
                'data-state': state.isOpen ? 'open' : 'closed',
                'data-popover-trigger': '',
            },
            withRef((el) => (ref = el as HTMLButtonElement))
        )
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
