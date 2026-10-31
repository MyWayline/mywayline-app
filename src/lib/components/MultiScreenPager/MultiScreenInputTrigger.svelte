<script lang="ts">
    import type { Snippet } from 'svelte';
    import { getMultiScreenInputContext } from './multiScreenInputContext.svelte';
    import { mergeProps } from '#lib/ui/utils/merge-props.ts';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    let {
        children,
        child,
        value,
        ...rest
    }: {
        children?: Snippet<[]>;
        child?: Snippet<[{ props: Record<string, unknown> }]>;
        value: string;
    } & HTMLButtonAttributes = $props();

    const context = getMultiScreenInputContext();

    let mergedProps = $derived(
        mergeProps(
            {
                onclick: () => context.setSelectedValue(value),
                class: 'touch-target-safe ' + (rest.class ?? ''),
            },
            rest
        )
    );
</script>

{#if child}
    {@render child?.({ props: mergedProps })}
{:else}
    <button {...mergedProps}>
        {@render children?.()}
    </button>
{/if}
