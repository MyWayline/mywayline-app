<script lang="ts">
    import * as TabsBase from '../index';

    let { children, value = $bindable(), ...rest }: TabsBase.StyledTabsProps = $props();
</script>

<TabsBase.Base {...rest} bind:value>
    {#snippet child({ props })}
        <div {...props}>
            {@render children?.()}
        </div>
    {/snippet}
</TabsBase.Base>
