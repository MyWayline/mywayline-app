<script lang="ts">
    import { setContext, type Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { FloatingMenuState } from '../floating.svelte.ts';

    let {
        anchor,
        children,
    }: {
        anchor?: HTMLElement;
        children?: Snippet<[]>;
    } & HTMLAttributes<HTMLDivElement> = $props();

    const state = new FloatingMenuState();

    $effect(() => {
        if (anchor instanceof HTMLElement) {
            state.anchor = anchor as HTMLElement;
        }
    });

    setContext('FLOATING_MENU_ROOT', state);
</script>

{@render children?.()}
