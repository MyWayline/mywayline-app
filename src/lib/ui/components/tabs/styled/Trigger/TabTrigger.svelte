<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import * as TabsBase from '../../index';

    let {
        children,
        variant = 'primary',
        size = 'md',
        class: className,
        ...rest
    }: TabsBase.StyledTabTriggerProps = $props();

    const sizes = {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-5 py-3',
        lg: 'text-base px-6 py-3.5',
    };

    const variants = {
        primary: 'text-muted-foreground data-[active]:text-primary-foreground',
        secondary: 'text-muted-foreground data-[active]:text-secondary-foreground',
        ghost: 'text-muted-foreground data-[active]:text-main-foreground',
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
