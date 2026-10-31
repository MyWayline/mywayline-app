<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import * as ToggleGroup from '../../index';

    let {
        variant = 'primary',
        size = 'md',
        class: className,
        children,
        ...rest
    }: ToggleGroup.StyledToggleItem = $props();

    const variants = {
        primary:
            'bg-transparent text-muted-foreground hover:bg-muted data-pressed:bg-primary data-pressed:text-primary-foreground',
        secondary:
            'bg-transparent text-muted-foreground hover:bg-muted data-pressed:bg-secondary data-pressed:text-secondary-foreground',
        ghost: 'bg-transparent text-muted-foreground hover:bg-muted data-pressed:bg-muted ',
    };

    const sizes = {
        sm: 'min-h-9 px-2 text-xs rounded-sm',
        md: 'min-h-10 px-3 text-sm rounded-sm',
        lg: 'min-h-12 px-4 text-base rounded-lg',
    };
</script>

<ToggleGroup.BaseItem {...rest}>
    {#snippet child({ props })}
        <button
            {...props}
            class={cn(
                'inline-flex items-center justify-center font-medium transition-all outline-none select-none shrink-0 [webkit-tap-highlight-color:transparent]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-40 disabled:pointer-events-none',
                'active:scale-[0.96]',
                'active:bg-muted data-pressed:active:opacity-90',
                variants[variant],
                sizes[size],
                className,
                props.class as string
            )}
        >
            <span class=" inline-flex items-center justify-center whitespace-nowrap">
                {@render children?.()}
            </span>
        </button>
    {/snippet}
</ToggleGroup.BaseItem>
