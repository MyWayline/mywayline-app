<script lang="ts">
    import { mergeProps } from '../../../utils/merge-props';
    import { withRef } from '../../../utils/ref-attachment';
    import type { InputProps } from '..';

    let { child, value = $bindable(), ref = $bindable(), ...rest }: InputProps = $props();

    const mergedProps = $derived(
        mergeProps(
            {
                type: rest.type ?? 'text',
                'aria-disabled': rest.disabled,
                'data-input': '',
                class: 'touch-target-safe ' + (rest.class ?? ''),
            },
            rest,
            withRef((el) => (ref = el as HTMLInputElement))
        )
    );
</script>

{#if child}
    {@render child({ props: mergedProps })}
{:else}
    <input bind:value {...mergedProps} />
{/if}
