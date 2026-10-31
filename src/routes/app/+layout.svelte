<script lang="ts">
    import { Calendar, House, Map, Search, Settings } from '@lucide/svelte';
    import { Button } from '#lib';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    let { children } = $props();

    const navigationBarRoutes = $derived([
        { name: 'Home', path: '/app/home', icon: House },
        { name: 'Map', path: '/app/map', icon: Map },
        { name: 'Search', path: '/app/search', icon: Search },
        { name: 'Calendar', path: '/app/calendar', icon: Calendar },
        { name: 'Settings', path: '/app/settings', icon: Settings },
    ]);
</script>

<div class="flex flex-col h-dvh overflow-hidden">
    <main class="flex-1 min-h-0 overflow-y-auto">
        {@render children()}
    </main>

    <nav
        class="shrink-0 bg-bg-primary flex flex-col"
        style="margin-bottom: calc(var(--safe-bottom)*2);"
    >
        <div class="h-15 flex justify-around items-center">
            {#each navigationBarRoutes as route}
                <div class="flex flex-col justify-center items-center relative">
                    <Button.Root
                        variant="ghost"
                        iconOnly
                        onclick={() => goto(route.path)}
                    >
                        <route.icon size={20} />
                    </Button.Root>

                    <span
                        class="absolute -bottom-1 block w-1.5 h-1.5 rounded-full bg-accent transition-opacity duration-200 {page.url.pathname.startsWith(
                            route.path
                        )
                            ? 'opacity-100'
                            : 'opacity-0'}"
                    ></span>
                </div>
            {/each}
        </div>
    </nav>
</div>
