<script lang="ts">
    import { Eye, EyeOff } from '@lucide/svelte';
    import { Toggle } from '#lib';
    import * as Input from '..';
    import PasswordValidator from './PasswordValidator.svelte';
    import { cn } from '#lib/utils/tw-merge.ts';
    let {
        type = 'text',
        variant = 'normal',
        label,
        id,
        passwordIndicator = false,
        value = $bindable(''),
        error,
        class: className,
        ...rest
    }: Input.StyledInputProps = $props();

    let visible = $state(false);
    const isPassword = $derived(type === 'password');
    const inputType = $derived(isPassword ? (visible ? 'text' : 'password') : type);

    const wrapperVariants = {
        authinput:
            'h-[50px] border border-neutral-300  rounded-lg bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent',
        normal: 'h-[56px] border-b-2 border-neutral-200 bg-transparent rounded-none focus-within:border-primary transition-colors',
    };
</script>

<div class="flex w-full flex-col gap-2">
    {#if label && label.trim().length > 0}
        <label for={id} class="text-sm font-medium text-neutral-700">
            {label}
        </label>
    {/if}

    <div
        class={cn(
            'flex h-14 w-full items-center px-3 transition-all',
            wrapperVariants[variant],
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
                        'h-full w-full flex-1 border-none bg-transparent p-0 text-sm font-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-0',
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
