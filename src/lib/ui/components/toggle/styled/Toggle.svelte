<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import * as Toggle from '..';

    let {
        variant = 'default',
        size = 'md',
        class: className,
        children,
        pressed = $bindable(false),
        ...restProps
    }: Toggle.StyledToggleProps = $props();

    const variants = {
        default:
            'bg-transparent text-neutral-600 hover:bg-neutral-100 0 data-[state=true]:bg-primary data-[state=true]:text-primary-foreground',
        outline:
            'border border-neutral-200  bg-transparent text-neutral-600 hover:bg-neutral-50 data-[state=true]:bg-neutral-900 data-[state=true]:text-white ',
        subtle: 'bg-transparent text-neutral-600 hover:bg-neutral-100 data-[state=true]:bg-neutral-200/80 data-[state=true]:text-neutral-900 ',
        ghost: 'bg-transparent text-neutral-600  hover:bg-neutral-100  active:bg-neutral-200/70  data-[state=true]:text-neutral-900 ',
    };

    const sizes = {
        sm: 'h-9 w-9 text-xs rounded-md',
        md: 'h-10 w-10 text-sm rounded-md',
        lg: 'h-12 w-12 text-base rounded-lg',
    };
</script>

<Toggle.Base bind:pressed {...restProps}>
    {#snippet child({ props, pressed: isPressed })}
        <button
            {...props}
            class={cn(
                'relative inline-flex items-center justify-center font-medium transition-all outline-none select-none shrink-0 [webkit-tap-highlight-color:transparent]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-40 disabled:pointer-events-none',
                'active:scale-[0.96]',
                'active:bg-neutral-100 dark:active:bg-neutral-800 data-[state=true]:active:opacity-90',
                variants[variant],
                sizes[size],
                className,
                props.class as string
            )}
        >
            <span class="relative z-10 inline-flex items-center justify-center">
                {@render children?.()}
            </span>
        </button>
    {/snippet}
</Toggle.Base>
