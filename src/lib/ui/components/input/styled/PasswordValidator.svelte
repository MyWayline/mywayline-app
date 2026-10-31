<script lang="ts">
    import { X, Check } from '@lucide/svelte';

    let { value = '' }: { value?: string } = $props();

    type StrengthState = 'none' | 'veryweak' | 'weak' | 'good' | 'strong';

    let hasMinLength = $derived(value.length >= 8);
    let hasUppercase = $derived(/[A-Z]/.test(value));
    let hasLowercase = $derived(/[a-z]/.test(value));
    let hasNumber = $derived(/\d/.test(value));
    let hasSpecial = $derived(/[^A-Za-z0-9]/.test(value));

    let currentState = $derived.by((): StrengthState => {
        if (!value) return 'none';

        let criteriaMet = 0;
        if (hasMinLength) criteriaMet++;
        if (hasUppercase) criteriaMet++;
        if (hasLowercase) criteriaMet++;
        if (hasSpecial) criteriaMet++;
        if (hasNumber) criteriaMet++;

        switch (criteriaMet) {
            case 1:
            case 2:
                return 'veryweak';
            case 3:
                return 'weak';
            case 4:
                return 'good';
            case 5:
                return 'strong';
            default:
                return 'veryweak';
        }
    });

    const BAR_COUNT_MAP: Record<StrengthState, number> = {
        none: 0,
        veryweak: 1,
        weak: 2,
        good: 3,
        strong: 4,
    };

    let activeBars = $derived(BAR_COUNT_MAP[currentState]);

    let criteria = $derived([
        { label: '8+ characters', met: hasMinLength },
        { label: 'Uppercase letter', met: hasUppercase },
        { label: 'Lowercase letter', met: hasLowercase },
        { label: 'Number', met: hasNumber },
        { label: 'Special character', met: hasSpecial },
    ]);

</script>

<div class="flex flex-col gap-2 w-full">
    <div class="flex w-full gap-1">
        {#each Array(4) as _, index}
            <div
                class="h-0.75 grow rounded-full transition-colors duration-200"
                class:bg-muted={index >= activeBars}
                class:bg-destructive={index < activeBars && currentState === 'veryweak'}
                class:bg-warning={index < activeBars && currentState === 'weak'}
                class:bg-secondary={index < activeBars && currentState === 'good'}
                class:bg-success={index < activeBars && currentState === 'strong'}
            ></div>
        {/each}
    </div>

    <div class="flex flex-wrap gap-1.5">
        {#each [...criteria].sort((a, b) => Number(b.met) - Number(a.met)) as item}
            <div
                class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200"
                class:bg-muted={!item.met}
                class:text-muted-foreground={!item.met}
                class:bg-success-background={item.met}
                class:text-success={item.met}
            >
                {#if item.met}
                    <Check size={12} strokeWidth={3} />
                {:else}
                    <X size={12} strokeWidth={3} />
                {/if}
                <span>{item.label}</span>
            </div>
        {/each}
    </div>
</div>
