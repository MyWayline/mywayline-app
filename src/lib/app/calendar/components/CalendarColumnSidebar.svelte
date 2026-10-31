<script lang="ts">
    import { formatHour, type HourFormat } from '#lib/utils/TimeDateUtils.ts';
    import { getCalendarContext } from '../calendarContext.svelte';

    const hours = Array.from({ length: 25 }, (_, i) => i);

    let calendarContext = getCalendarContext();
</script>

<div>
    {#each hours as hour, i}
        <div
            class="relative flex items-start justify-end pr-2"
            style="height: {i === hours.length - 1
                ? 0
                : calendarContext.columnHourPxGap}px"
        >
            {#if i > 0}
                <span class="-translate-y-1/2 text-xs text-muted-foreground"
                    >{formatHour(hour, '24h')}</span
                >
            {/if}
        </div>
    {/each}
</div>
