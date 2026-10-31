<script lang="ts">
    import * as RadioGroup from '../../index';

    let {
        children,
        variant = 'primary',
        size = 'md',
        ...rest
    }: RadioGroup.StyledItemProps = $props();

    const variants = {
        ghost: 'border-border data-[checked=true]:border-muted-foreground',
        primary: 'border-primary data-[checked=true]:border-primary',
        secondary: 'border-secondary data-[checked=true]:border-secondary',
    };

    const sizes = {
        sm: { outer: 'size-4', inner: 'size-2' },
        md: { outer: 'size-5', inner: 'size-2.5' },
        lg: { outer: 'size-6', inner: 'size-3' },
    };
</script>

<RadioGroup.BaseItem {...rest}>
    {#snippet child({ props, checked })}
        <button
            {...props}
            class="inline-flex items-center gap-2 cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50
                {props.class ?? ''}"
        >
            <div
                class="flex shrink-0 items-center justify-center rounded-full border bg-transparent transition-colors duration-150
                    {variants[variant]} {sizes[size].outer}"
            >
                {#if checked}
                    <div class="{sizes[size].inner} rounded-full {variant === 'secondary' ? 'bg-secondary' : variant === 'ghost' ? 'bg-muted-foreground' : 'bg-primary'}"></div>
                {/if}
            </div>

            {@render children?.()}
        </button>
    {/snippet}
</RadioGroup.BaseItem>
