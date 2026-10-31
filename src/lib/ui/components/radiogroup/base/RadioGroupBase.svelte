<script lang="ts">
    import { setContext, tick } from 'svelte';
    import { withRef } from '../../../utils/ref-attachment.ts';
    import type { BaseProps } from '../index.ts';
    import { mergeProps } from '../../../utils/merge-props.ts';

    let {
        value = $bindable(''),
        children,
        ref = $bindable(),
        disabled = false,
        required = false,
        name,
        child,
        ...rest
    }: BaseProps = $props();

    setContext('RADIOGROUP_ROOT', {
        get value() {
            return value;
        },
        get disabled() {
            return disabled;
        },
        toggleItem: (v: string) => toggleItem(v),
    });

    const toggleItem = (itemValue: string): void => {
        if (disabled) return;
        value = itemValue;
    };

    const mergedProps = $derived(
        mergeProps(rest, {
            'data-radiogroup-root': '',
            'aria-disabled': disabled,
            'aria-required': required,
            role: 'radiogroup',
        })
    );
</script>

{#if child}
    {@render child({ props: mergedProps })}
{:else}
    <div {...mergedProps}>
        {@render children?.()}
    </div>
{/if}

<input
    {...withRef((el) => (ref = el as HTMLInputElement))}
    type="hidden"
    class="native-input"
    {value}
    {disabled}
    {required}
    {name}
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
