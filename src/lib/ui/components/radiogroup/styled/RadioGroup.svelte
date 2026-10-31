<script lang="ts">
    import * as RadioGroup from '../index';

    let { children, value = $bindable(), ...rest }: RadioGroup.StyledRootProps = $props();
</script>

<RadioGroup.Base {...rest} bind:value>
    {#snippet child({ props })}
        <div {...props}>
            {@render children?.()}
        </div>
    {/snippet}
</RadioGroup.Base>
