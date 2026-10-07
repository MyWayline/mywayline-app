<script lang="ts">
    import { onMount } from 'svelte';
    import { mergeProps } from '../../../utils/merge-props';
    import { withRef } from '../../../utils/ref-attachment';
    import type { ButtonProps } from '..';
    let { children, child, ref = $bindable(), ...rest }: ButtonProps = $props();

    const mergedProps = $derived(
        mergeProps(
            {
                type: 'button',
                'aria-disabled': rest.disabled,
                'data-button': '',
                class: 'touch-target-safe ' + (rest.class ?? ''),
            },
            rest,
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
