<script lang="ts">
    import { mergeProps } from '../../../utils/merge-props';
    import { withRef } from '../../../utils/ref-attachment';
    import type { ToggleProps } from '../index.ts';

    let {
        children,
        child,
        ref = $bindable(),
        pressed = $bindable(false),
        disabled = false,
        ...rest
    }: ToggleProps = $props();

    let mergedProps = $derived(
        mergeProps(
            rest,
            {
                type: 'button',
                'aria-pressed': pressed,
                disabled,
                'aria-disabled': disabled || undefined,
                'data-state': pressed,
                class: 'touch-target-safe ' + (rest.class ?? ''),
                onclick: () => {
                    if (!disabled) pressed = !pressed;
                },
            },
            withRef((el) => (ref = el as HTMLButtonElement))
        )
    );
</script>

{#if child}
    {@render child({ props: mergedProps, pressed })}
{:else}
    <button {...mergedProps}>
        {@render children?.()}
    </button>
{/if}
