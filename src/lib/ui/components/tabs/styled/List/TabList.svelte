<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import * as TabsBase from '../../index';

    let {
        children,
        variant = 'default',
        class: className,
        ...rest
    }: TabsBase.StyledTabListProps = $props();

    let list = $state<HTMLDivElement>();
    let indicator = $state<HTMLDivElement>();
    let activeElement = $state<HTMLElement>();

    const updateIndicator = () => {
        if (!activeElement || !indicator) return;
        indicator.style.width = `${activeElement.offsetWidth}px`;
        indicator.style.transform = `translateX(${activeElement.offsetLeft}px)`;
    };

    $effect(() => {
        if (!list) return;

        const findActive = () => {
            const found = list?.querySelector<HTMLElement>('[data-active]');
            if (found) activeElement = found;
        };

        findActive();

        const observer = new MutationObserver(findActive);
        observer.observe(list, {
            subtree: true,
            attributes: true,
            attributeFilter: ['data-active'],
        });

        return () => observer.disconnect();
    });

    $effect(() => {
        if (activeElement) updateIndicator();
    });
</script>

<svelte:window onresize={updateIndicator} />

<TabsBase.BaseList {...rest}>
    {#snippet child({ props })}
        <div
            bind:this={list}
            {...props}
            class={cn(
                'relative flex gap-1 p-1.5 rounded-full bg-bg-secondary',
                className
            )}
        >
            <div
                bind:this={indicator}
                class="absolute top-1.5 bottom-1.5 left-0 z-0 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            ></div>

            {@render children?.()}
        </div>
    {/snippet}
</TabsBase.BaseList>
