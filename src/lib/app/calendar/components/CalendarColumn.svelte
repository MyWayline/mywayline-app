<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { getCalendarContext } from '../calendarContext.svelte';
    import type { TimelineItem } from '../types/CalendarLayout.types';
    import { useOnHold } from '#lib/shared/utils/UseHoldAction.svelte.ts';
    import { startOfDay } from 'date-fns';
    import { Button } from '#lib';

    let {
        items,
        date = new Date(),
        ondoubleclick,
        ...rest
    }: {
        items: TimelineItem[];
        date?: Date;
        ondoubleclick?: () => void;
    } & HTMLAttributes<HTMLDivElement> = $props();

    let calendarContext = getCalendarContext();

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const onhourselect = (hour: number) => {
        const start = hour * calendarContext.columnHourPxGap;
        calendarContext.setColumnRangeSelection({
            dayKey: startOfDay(date).getTime(),
            start,
            end: start + calendarContext.columnHourPxGap,
        });
    };
</script>

<div
    class="relative w-full"
    ondblclick={ondoubleclick}
    {...rest}
    onclick={() => calendarContext.setColumnRangeSelection(null)}
>
    {#each hours as hour}
        <div
            use:useOnHold
            onhold={() => onhourselect(hour)}
            class="border-t border-muted"
            style="height: {calendarContext.columnHourPxGap}px"
        ></div>
    {/each}

    {#each items as item}
        <div
            class="absolute"
            style="
                top: {item.topPx}px;
                height: {item.heightPx}px;
                left: calc({item.leftPct}% + {item.peekPx}px);
                width: calc({item.widthPct}% - {item.peekPx}px);
                z-index: {item.column + 1 + (item.isStacked ? 1 : 0)};
            "
        >
            <Button.Base>
                {#snippet child({ props })}
                    <button
                        {...props}
                        onclick={(e) => {
                            e.stopPropagation();
                            calendarContext.setSelectedItemId(item.uid);
                        }}
                        class:shadow-md={item.isStacked}
                        class="box-border h-full w-full flex flex-col justify-start overflow-hidden rounded-sm p-1 text-xs font-medium transition-[box-shadow,z-index] duration-150 ease-in {props.class ||
                            ''}"
                        style="
                            {props.style || ''};
                            background-color: {item?.color ?? 'blue'};
                        "
                    >
                        <p
                            class="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left"
                            style="color: contrast-color({item.color})"
                        >
                            {item.summary}
                        </p>
                    </button>
                {/snippet}
            </Button.Base>
        </div>
    {/each}
</div>
