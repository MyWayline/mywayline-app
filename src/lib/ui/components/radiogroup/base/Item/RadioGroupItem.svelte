<script lang="ts">
    import { getContext } from 'svelte';
    import type { RadioGroupState, BaseItemProps } from '../../index.ts';
    import { mergeProps } from '../../../../utils/merge-props.ts';
    import { focusUtils } from '../../../../utils/focus.ts';
    import { withRef } from '../../../../utils/ref-attachment.ts';

    let {
        value,
        disabled = false,
        children,
        child,
        ref = $bindable(),
        ...rest
    }: BaseItemProps = $props();

    const state = getContext<RadioGroupState>('RADIOGROUP_ROOT');
    const checked = $derived(state.value === value);

    const isDisabled = $derived(state.disabled || disabled);

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                type: 'button',
                role: 'radio',
                'data-value': value,
                'aria-checked': checked,
                'data-state': checked ? 'checked' : 'unchecked',
                'aria-disabled': isDisabled,
                'data-disabled': isDisabled ? '' : undefined,
                'data-radiogroup-item': '',
                class: 'touch-target-safe ' + (rest.class ?? ''),
                tabindex: checked ? 0 : -1,
                disabled: isDisabled,
                onkeydown: (e: KeyboardEvent) => {
                    focusUtils.handleRoving(e, {
                        root: '[data-radiogroup-root]',
                        item: '[data-radiogroup-item]',
                        onShift: (next) => {
                            const value = next.getAttribute('data-value');
                            if (value) {
                                state.toggleItem(value);
                            }
                        },
                    });
                },
                onclick: () => {
                    if (isDisabled) return;
                    state.toggleItem(value);
                },
            },
            withRef((el) => (ref = el as HTMLButtonElement))
        )
    );
</script>

{#if child}
    {@render child({ props: mergedProps, checked })}
{:else}
    <button {...mergedProps}>
        {@render children?.()}
    </button>
{/if}

<style>
    .native-input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
</style>
