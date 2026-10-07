<script lang="ts">
    import { withRef } from '../../../utils/ref-attachment';
    import { mergeProps } from '../../../utils/merge-props';
    import type { CheckboxProps } from '../index.ts';

    let {
        checked = $bindable(false),
        indeterminate = $bindable(false),
        disabled = false,
        required = false,
        value = $bindable('on'),
        name = '',
        readonly = false,
        children,
        child,
        ref = $bindable(),
        ...rest
    }: CheckboxProps = $props();

    $effect(() => {
        if (ref) {
            ref.indeterminate = indeterminate;
        }
    });

    const handleCheckChange = () => {
        if (readonly || disabled) return;

        if (indeterminate) {
            indeterminate = false;
            checked = true;
        } else {
            checked = !checked;
        }
    };

    const mergedProps = $derived(
        mergeProps(rest, {
            class: 'touch-target-safe ' + (rest.class ?? ''),
            type: 'button',
            role: 'checkbox',
            'aria-checked': indeterminate ? 'mixed' : checked,
            'aria-required': required,
            'aria-disabled': disabled,
            'data-state': indeterminate
                ? 'indeterminate'
                : checked
                  ? 'checked'
                  : 'unchecked',
            'data-disabled': disabled ? '' : undefined,
            'data-readonly': readonly ? true : undefined,
            disabled,
            onclick: () => {
                handleCheckChange();
            },
        })
    );
</script>

{#if child}
    {@render child({ props: mergedProps, checked, indeterminate })}
{:else}
    <button {...mergedProps}>
        {@render children?.()}
    </button>
{/if}

<input
    {...withRef((el) => (ref = el as HTMLInputElement))}
    type="checkbox"
    class="native-input"
    tabindex="-1"
    aria-hidden="true"
    {disabled}
    {checked}
    {required}
    {name}
    {value}
    readonly={readonly ? true : undefined}
/>

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
