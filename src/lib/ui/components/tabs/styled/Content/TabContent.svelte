<script lang="ts">
    import * as TabsBase from '../../index';

    let { children, ...rest }: TabsBase.StyledTabContentProps = $props();
</script>

<TabsBase.BaseContent {...rest}>
    {#snippet child({ props })}
        <div {...props}>
            {@render children?.()}
        </div>
    {/snippet}
</TabsBase.BaseContent>
