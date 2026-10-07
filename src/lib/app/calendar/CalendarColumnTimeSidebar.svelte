<script lang="ts">
    import { formatHour, type HourFormat } from '#lib/utils/TimeUtils.ts';

    let {
        hourGapPx = 80,
        formatType = '24h',
    }: {
        hourGapPx?: number;
        formatType?: HourFormat;
    } = $props();

    const hours = Array.from({ length: 25 }, (_, i) => i);
</script>

<div>
    {#each hours as hour, i}
        <div
            class="relative flex items-start justify-end pr-2"
            style="height: {i === hours.length - 1 ? 0 : hourGapPx}px"
        >
            {#if i > 0}
                <span class="-translate-y-1/2 text-xs text-muted-foreground"
                    >{formatHour(hour, formatType)}</span
                >
            {/if}
        </div>
    {/each}
</div>
