<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import * as TabsBase from '../../index';

    let {
        children,
        variant = 'default',
        size = 'md',
        class: className,
        ...rest
    }: TabsBase.StyledTabTriggerProps = $props();

    const sizes = {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-5 py-3',
    };

    const variants = {
        default: 'text-neutral-600 data-[active]:text-neutral-900',
        subtle: 'text-neutral-500 data-[active]:text-primary',
    };
</script>

<TabsBase.BaseTrigger {...rest}>
    {#snippet child({ props })}
        <button
            {...props}
            class={cn(
                'relative z-10 flex-1 bg-transparent font-medium rounded-full transition-colors outline-none',
                sizes[size],
                variants[variant],
                className,
                props.class as string
            )}
        >
            <span class="relative z-10 block truncate">
                {@render children?.()}
            </span>
        </button>
    {/snippet}
</TabsBase.BaseTrigger>
