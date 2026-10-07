<script lang="ts">
    import { getContext } from 'svelte';
    import { withRef } from '../../../../utils/ref-attachment';
    import { mergeProps } from '../../../../utils/merge-props';
    import { type TabBaseContentProps, type TabState } from '../../index';

    let {
        value,
        child,
        children,
        ref = $bindable(),
        ...rest
    }: TabBaseContentProps = $props();

    const state = getContext<TabState>('TAB_ROOT');

    const active = $derived(state.value === value);

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                role: 'tabpanel',
                hidden: !active,
                'data-tab-panel': '',
                'data-active': active ? '' : undefined,
            },
            withRef((el) => (ref = el as HTMLDivElement))
        )
    );
</script>

{#if active}
    {#if child}
        {@render child({ props: mergedProps })}
    {:else}
        <div {...mergedProps}>
            {@render children?.()}
        </div>
    {/if}
{/if}
