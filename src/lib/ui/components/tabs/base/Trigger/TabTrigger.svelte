<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { withRef } from '../../../../utils/ref-attachment';
    import { mergeProps } from '../../../../utils/merge-props';
    import { type TabState } from '../../index';
    import { focusUtils } from '../../../../utils/focus';

    let {
        value,
        disabled = false,
        child,
        children,
        ref = $bindable(),
        ...rest
    }: {
        value: string;
        ref?: HTMLButtonElement;
        disabled?: boolean;
        child?: Snippet<[{ props: Record<string, unknown> }]>;
        children?: Snippet<[]>;
    } & HTMLButtonAttributes = $props();

    const state = getContext<TabState>('TAB_ROOT');
    const selected = $derived(state.value === value);

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                class: 'touch-target-safe ' + (rest.class ?? ''),
                type: 'button',
                role: 'tab',
                tabindex: selected ? 0 : -1,
                disabled,
                'aria-selected': selected,
                'aria-disabled': disabled,
                'data-tab-trigger': '',
                'data-active': selected ? '' : undefined,
                'data-disabled': disabled ? '' : undefined,
                onclick: () => {
                    if (!disabled) state.toggleItem(value);
                },
                onkeydown: (e: KeyboardEvent) => {
                    focusUtils.handleRoving(e, {
                        root: '[data-tab-root]',
                        item: '[data-tab-trigger]',
                    });
                },
            },
            withRef((el) => (ref = el as HTMLButtonElement))
        )
    );
</script>

{#if child}
    {@render child({ props: mergedProps })}
{:else}
    <button {...mergedProps}>
        {@render children?.()}
    </button>
{/if}
