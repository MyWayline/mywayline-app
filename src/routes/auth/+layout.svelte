<script lang="ts">
    import { beforeNavigate, onNavigate } from '$app/navigation';
    import type { Snippet } from 'svelte';
    import '#lib/transitions/view/slideTransition.css';

    let { children }: { children: Snippet<[]> } = $props();

    beforeNavigate(({ from, to, shallow }) => {
        if (shallow) return;
        if (!from || !to) return;

        // When going auth to login slide left, if coming from login right
        if (from.route.id === '/auth' && to.route.id === '/auth/login') {
            document.documentElement.dataset.direction = 'left';
        } else if (from.route.id === '/auth/login' && to.route.id === '/auth') {
            document.documentElement.dataset.direction = 'right';
        }
    });

    onNavigate((navigation) => {
        if (navigation.shallow) return;
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

{@render children()}
