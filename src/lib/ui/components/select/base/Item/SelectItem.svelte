<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { mergeProps } from '../../../../utils/merge-props.ts';
    import { withRef } from '../../../../utils/ref-attachment.ts';
    import { focusUtils } from '../../../../utils/focus.ts';
    import type { SelectState } from '../../index.ts';

    let {
        value = '',
        disabled = false,
        closeOnSelect = true,
        onSelect,
        children,
        child,
        index,
        ref = $bindable(),
        ...rest
    }: {
        children?: Snippet<[]>;
        child?: Snippet<
            [
                {
                    props: Record<string, any>;
                    selected: boolean;
                },
            ]
        >;
        disabled?: boolean;
        value?: string;
        closeOnSelect?: boolean;
        onSelect?: () => void;
        index?: number;
        ref?: HTMLDivElement;
    } & HTMLAttributes<HTMLDivElement> = $props();

    const state = getContext<SelectState>('SELECT_ROOT');

    const selected = $derived(state.value.includes(value));
    const isDisabled = $derived(state.disabled || disabled);

    const selectItem = () => {
        if (isDisabled) return;
        state.toggleItem(value);
        onSelect?.();
        if (closeOnSelect) {
            state.isOpen = false;
        }
    };

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                'data-select-item': '',
                role: 'option',
                tabindex: isDisabled ? -1 : -1,
                onclick: selectItem,
                onkeydown: (e: KeyboardEvent) => {
                    focusUtils.handleRoving(e, {
                        root: '[data-select-content]',
                        item: '[data-select-item]',
                    });
                    if (isDisabled) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectItem();
                    }
                },
                'aria-selected': selected,
                'aria-disabled': isDisabled,
                'data-selected': selected,
                'data-disabled': isDisabled ? '' : undefined,
            },
            withRef((el) => (ref = el as HTMLDivElement))
        )
    );
</script>

{#if child}
    {@render child({ props: mergedProps, selected })}
{:else}
    <div {...mergedProps}>
        {@render children?.()}
    </div>
{/if}
