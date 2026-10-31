<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import * as TabsBase from '../../index';

    let {
        children,
        variant = 'primary',
        class: className,
        classIndicator,
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
                'relative flex gap-1 rounded-full p-1.5',
                variant === 'primary' && 'bg-bg-secondary',
                variant === 'secondary' && 'bg-bg-primary',
                variant === 'ghost' && 'bg-transparent',
                className
            )}
        >
            <div
                bind:this={indicator}
                class={cn(
                    'absolute top-1.5 bottom-1.5 left-0 z-0 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    variant === 'primary' && 'bg-primary',
                    variant === 'secondary' && 'bg-primary',
                    variant === 'ghost' && 'bg-muted',
                    classIndicator
                )}
            ></div>

            {@render children?.()}
        </div>
    {/snippet}
</TabsBase.BaseList>
