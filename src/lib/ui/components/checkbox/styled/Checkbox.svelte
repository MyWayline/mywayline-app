<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import { Check, Minus } from '@lucide/svelte';
    import * as Checkbox from '../index';

    let {
        checked = $bindable(false),
        indeterminate = $bindable(false),
        variant = 'primary',
        size = 'md',
        class: className,
        children,
        ...rest
    }: Checkbox.StyledCheckboxProps = $props();

    const variants = {
        primary:
            'border-border bg-muted focus-visible:ring-focus data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary text-primary-foreground',
        secondary:
            'border-border bg-muted focus-visible:ring-focus data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=indeterminate]:bg-secondary data-[state=indeterminate]:border-secondary text-secondary-foreground',
        ghost:
            'border-border bg-transparent focus-visible:ring-focus data-[state=checked]:bg-muted data-[state=checked]:border-muted data-[state=indeterminate]:bg-muted data-[state=indeterminate]:border-muted text-main-foreground',
    };

    const sizes = {
        sm: 'h-4 w-4 rounded',
        md: 'h-5 w-5 rounded-sm',
        lg: 'h-6 w-6 rounded-sm',
    };
</script>

<Checkbox.Base bind:checked bind:indeterminate {...rest}>
    {#snippet child({ props, checked, indeterminate })}
        <button
            {...props}
            class={cn(
                'relative flex items-center justify-center border shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                variants[variant],
                sizes[size],
                className,
                props.class as string
            )}
        >
            {#if indeterminate}
                <Minus />
            {:else if checked}
                <Check />
            {/if}
        </button>
    {/snippet}
</Checkbox.Base>
