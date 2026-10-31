<script lang="ts">
    import type { Snippet } from 'svelte';
    import { mergeProps } from '../../../utils/merge-props.ts';
    import { withRef } from '../../../utils/ref-attachment.ts';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import type { SwitchRootProps } from '../index.ts';

    let {
        checked = $bindable(false),
        child,
        children,
        disabled = false,
        required = false,
        name = 'd',
        readonly = false,
        ref = $bindable(),
        value = $bindable('on'),
        ...rest
    }: SwitchRootProps = $props();

    const mergedProps = $derived(
        mergeProps(rest, {
            role: 'checkbox',
            class: 'touch-target-safe ' + (rest.class ?? ''),
            type: 'button',
            'aria-checked': checked,
            'aria-required': required,
            'aria-disabled': disabled,
            'aria-readonly': readonly,
            'data-state': checked ? 'checked' : 'unchecked',
            'data-disabled': disabled ? '' : undefined,
            'data-readonly': readonly ? '' : undefined,
            disabled,
            onclick: () => {
                if (!disabled) checked = !checked;
            },
        })
    );
</script>

{#if child}
    {@render child({ props: mergedProps, checked })}
{:else}
    <button {...mergedProps}>
        {@render children?.()}
    </button>
{/if}

<input
    {...withRef((el) => (ref = el as HTMLInputElement))}
    type="checkbox"
    aria-hidden="true"
    tabindex="-1"
    class="native-input"
    {name}
    {disabled}
    {required}
    {checked}
    readonly={readonly ? true : undefined}
    {value}
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
        transform: translateX(-100%);
    }
</style>
