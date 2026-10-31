<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import * as Toggle from '..';

    let {
        variant = 'primary',
        size = 'md',
        class: className,
        children,
        pressed = $bindable(false),
        ...restProps
    }: Toggle.StyledToggleProps = $props();

    const variants = {
        primary:
            'bg-transparent text-muted-foreground hover:bg-muted data-[state=true]:bg-primary data-[state=true]:text-primary-foreground',
        secondary:
            'bg-transparent text-muted-foreground hover:bg-muted data-[state=true]:bg-secondary data-[state=true]:text-secondary-foreground',
        ghost: 'bg-transparent text-muted-foreground hover:bg-muted data-[state=true]:bg-muted ',
    };

    const sizes = {
        sm: 'min-h-9 px-2 text-xs rounded-sm',
        md: 'min-h-10 px-3 text-sm rounded-sm',
        lg: 'min-h-12 px-4 text-base rounded-lg',
    };
</script>

<Toggle.Base bind:pressed {...restProps}>
    {#snippet child({ props, pressed: isPressed })}
        <button
            {...props}
            class={cn(
                'inline-flex items-center justify-center font-medium transition-all outline-none select-none shrink-0 [webkit-tap-highlight-color:transparent]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-40 disabled:pointer-events-none',
                'active:scale-[0.96]',
                'active:bg-muted data-[state=true]:active:opacity-90',
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
</Toggle.Base>
