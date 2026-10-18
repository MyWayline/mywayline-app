<script lang="ts">
    import * as Button from '../index';
    import { cn } from '#lib/utils/tw-merge.ts';

    let {
        variant = 'primary',
        size = 'md',
        iconOnly = false,
        disabled = false,
        isLoading = false,
        class: className,
        children,
        ...restProps
    }: Button.StyledButtonProps = $props();

    const variants = {
        primary:
            'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary shadow-sm',
        secondary:
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent shadow-sm',
        destructive:
            'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive shadow-sm',
        ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200/70 focus-visible:ring-neutral-500',
    };

    const sizes = {
        normal: {
            sm: 'h-9 px-3 text-xs rounded-lg gap-1.5',
            md: 'h-10 px-4 text-sm rounded-lg gap-2',
            lg: 'h-12 px-6 text-base rounded-lg gap-2.5',
        },
        icon: {
            sm: 'h-9 w-9 text-xs rounded-full',
            md: 'h-10 w-10 text-sm rounded-full',
            lg: 'h-12 w-12 text-base rounded-full',
        },
    };

    const sizeClass = $derived(iconOnly ? sizes.icon[size] : sizes.normal[size]);
</script>

<Button.Base disabled={disabled || isLoading} {...restProps}>
    {#snippet child({ props })}
        <button
            {...props}
            aria-busy={isLoading}
            class={cn(
                'relative inline-flex items-center justify-center font-medium transition-all outline-none select-none',
                'focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                variants[variant],
                sizeClass,
                className,
                props.class as string
            )}
        >
            <span class="inline-flex items-center justify-center gap-[inherit]">
                {#if isLoading}
                    <svg
                        class="size-4 animate-spin shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                {/if}

                {@render children?.()}
            </span>
        </button>
    {/snippet}
</Button.Base>
