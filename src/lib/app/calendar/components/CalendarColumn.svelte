<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { getCalendarContext } from '../calendarContext.svelte';
    import type { TimelineItem } from '../types/CalendarLayout.types';

    let {
        items,
        ondoubleclick,
        ...rest
    }: {
        items: TimelineItem[];
        ondoubleclick?: () => void;
    } & HTMLAttributes<HTMLDivElement> = $props();

    let calendarContext = getCalendarContext();

    const hours = Array.from({ length: 24 }, (_, i) => i);
</script>

<div class="relative w-full" ondblclick={ondoubleclick} {...rest}>
    {#each hours as hour}
        <div
            class="border-t border-muted"
            style="height: {calendarContext.columnHourPxGap}px"
        ></div>
    {/each}

    {#each items as item}
        <div
            class="absolute box-border overflow-hidden rounded-sm p-1 text-xs font-medium transition-[box-shadow,z-index] duration-150 ease-in"
            class:shadow-md={item.isStacked}
            style="
                top: {item.topPx}px;
                height: {item.heightPx}px;
                left: calc({item.leftPct}% + {item.peekPx}px);
                width: calc({item.widthPct}% - {item.peekPx}px);
                background-color: {item?.color ?? 'blue'};
                z-index: {item.column + 1 + (item.isStacked ? 1 : 0)};
            "
        >
            <p
                class="overflow-hidden text-ellipsis whitespace-nowrap"
                style="color: contrast-color({item.color})"
            >
                {item.summary}
            </p>
        </div>
    {/each}
</div>
