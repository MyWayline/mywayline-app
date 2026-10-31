<script lang="ts">
    import { Eye, EyeOff } from '@lucide/svelte';
    import { Toggle } from '#lib';
    import * as Input from '..';
    import PasswordValidator from './PasswordValidator.svelte';
    import { cn } from '#lib/utils/tw-merge.ts';
    let {
        type = 'text',
        variant = 'primary',
        appearance,
        size = 'md',
        label,
        id,
        passwordIndicator = false,
        value = $bindable(''),
        error,
        inputClass,
        class: className,
        ...rest
    }: Input.StyledInputProps = $props();

    let visible = $state(false);
    const isPassword = $derived(type === 'password');
    const inputType = $derived(isPassword ? (visible ? 'text' : 'password') : type);

    const wrapperVariants = {
        ghost: 'border-b-2 border-border bg-transparent rounded-none focus-within:border-focus transition-colors',
        primary:
            'border border-border rounded-lg bg-input focus-within:ring-2 focus-within:ring-focus focus-within:border-transparent',
        secondary:
            'border border-secondary rounded-lg bg-input focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent',
    };

    const sizes = {
        sm: 'h-9',
        md: 'h-14',
        lg: 'h-16',
    };

    const appearanceClasses = {
        plain: 'h-auto min-h-0 border-0 bg-transparent px-0',
        underline: 'h-auto min-h-0 border-0 border-b-2 border-primary bg-transparent px-0 rounded-none',
    };
</script>

<div class="flex w-full flex-col gap-2">
    {#if label && label.trim().length > 0}
        <label for={id} class="text-sm font-medium text-main-foreground">
            {label}
        </label>
    {/if}

    <div
        class={cn(
            'flex w-full items-center px-3 transition-all',
            appearance ? appearanceClasses[appearance] : wrapperVariants[variant],
            appearance ? '' : sizes[size],
            error ? 'border-destructive focus-within:border-destructive' : '',
            className
        )}
    >
        <Input.Base {...rest}>
            {#snippet child({ props })}
                <input
                    bind:value
                    {id}
                    {...props}
                    type={inputType}
                    class={cn(
                        'h-full w-full flex-1 border-none bg-transparent p-0 text-sm font-normal text-main-foreground outline-none placeholder:text-muted-foreground focus:ring-0',
                        inputClass,
                        props.class as string
                    )}
                />
            {/snippet}
        </Input.Base>

        {#if isPassword}
            <Toggle.Root bind:pressed={visible} variant="ghost">
                {#if visible}
                    <EyeOff size={16} />
                {:else}
                    <Eye size={16} />
                {/if}
            </Toggle.Root>
        {/if}
    </div>

    {#if error && error.trim().length > 0}
        <span class="text-xs font-medium tracking-wide text-destructive">
            {error}
        </span>
    {/if}

    {#if passwordIndicator && isPassword}
        <PasswordValidator {value} />
    {/if}
</div>
