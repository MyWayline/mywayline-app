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

{@render children()}
<div
    class="h-15 bg-white flex justify-around items-center fixed bottom-(--safe-bottom) w-full"
>
    {#each navigationBarRoutes as route}
        <div class="flex flex-col justify-center items-center relative">
            <Button.Root variant="ghost" iconOnly onclick={() => goto(route.path)}>
                <route.icon size={20} />
            </Button.Root>

            <span
                class="absolute -bottom-1 block w-1.5 h-1.5 rounded-full ring-2 ring-white bg-primary-foreground transition-opacity duration-200 {page.url.pathname.startsWith(
                    route.path
                )
                    ? 'opacity-100'
                    : 'opacity-0'}"
            ></span>
        </div>
    {/each}
</div>
