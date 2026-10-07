<script lang="ts">
    import { cn } from '#lib/utils/tw-merge.ts';
    import { Check, Minus } from '@lucide/svelte';
    import * as Checkbox from '../index';

    let {
        checked = $bindable(false),
        indeterminate = $bindable(false),
        variant = 'default',
        size = 'lg',
        class: className,
        children,
        ...rest
    }: Checkbox.StyledCheckboxProps = $props();

    const variants = {
        default:
            'border-neutral-200 bg-neutral-50 focus-visible:ring-neutral-500 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900 data-[state=indeterminate]:bg-neutral-900 data-[state=indeterminate]:border-neutral-900 text-white',
        destructive:
            'border-red-300 bg-white focus-visible:ring-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 data-[state=indeterminate]:bg-red-600 data-[state=indeterminate]:border-red-600 text-white',
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
