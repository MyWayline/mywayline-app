<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import * as Switch from '../index';

    let {
        checked = $bindable(false),
        variant = 'primary',
        size = 'md',
        class: className,
        children,
        ...rest
    }: Switch.SwitchRootStyledProps = $props();

    const variants = {
        primary: 'bg-muted data-[state=checked]:bg-primary',
        secondary: 'bg-muted data-[state=checked]:bg-secondary',
        ghost: 'bg-muted data-[state=checked]:bg-muted',
    };

    const sizes = {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
        lg: 'h-6 w-11',
    };
</script>

<Switch.Base bind:checked {...rest}>
    {#snippet child({ props })}
        <button
            {...props}
            class={cn(
                'peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                variants[variant],
                sizes[size],
                'data-[state=checked]:[&>span]:translate-x-full',
                className,
                props.class as string
            )}
        >
            <span
                class={cn(
                    'pointer-events-none block rounded-full bg-bg-primary shadow-sm ring-0 transition-transform',
                    'translate-x-0',
                    size === 'sm' && 'size-3',
                    size === 'md' && 'size-4',
                    size === 'lg' && 'size-5'
                )}
            ></span>
            {@render children?.()}
        </button>
    {/snippet}
</Switch.Base>
