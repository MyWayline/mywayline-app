<script lang="ts">
    import type { Snippet } from 'svelte';
    import { Button } from '#lib';
    import { getFlowContext } from './flowFormContext.svelte';

    let {
        to,
        back = false,
        child,
        children,
    }: {
        to?: string;
        back?: boolean;
        params?: unknown;
        child?: Snippet<[{ props: { onclick: () => void } }]>;
        children?: Snippet;
    } = $props();

    const flowContext = getFlowContext();

    const buttonProps = {
        onclick: () => {
            if (back) flowContext.pop();
            else if (to) flowContext.push(to);
        },
    };
</script>

{#if child}
    {@render child({ props: buttonProps })}
{:else}
    <Button.Base {...buttonProps}>
        {@render children?.()}
    </Button.Base>
{/if}
