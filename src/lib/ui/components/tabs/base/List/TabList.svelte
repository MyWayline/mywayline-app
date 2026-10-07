<script lang="ts">
    import { type Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { withRef } from '../../../../utils/ref-attachment';
    import { mergeProps } from '../../../../utils/merge-props';

    let {
        child,
        children,
        ref = $bindable(),
        ...rest
    }: {
        ref?: HTMLDivElement;
        child?: Snippet<[{ props: Record<string, any> }]>;
        children?: Snippet<[]>;
    } & HTMLAttributes<HTMLDivElement> = $props();

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                role: 'tablist',
            },
            withRef((el) => (ref = el as HTMLDivElement))
        )
    );
</script>

{#if child}
    {@render child({ props: mergedProps })}
{:else}
    <div {...mergedProps}>
        {@render children?.()}
    </div>
{/if}
