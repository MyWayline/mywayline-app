<script lang="ts">
    import { onDestroy, untrack, type Snippet } from 'svelte';
    import { getMultiScreenInputContext } from './multiScreenInputContext.svelte';

    let { value, children }: { value: string; children?: Snippet<[]> } = $props();

    const context = getMultiScreenInputContext();

    const unregister = context.register(
        untrack(() => value),
        () => children
    );

    onDestroy(unregister);
</script>
