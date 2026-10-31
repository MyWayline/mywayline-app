<script lang="ts">
    import {
        addDays,
        addMonths,
        eachDayOfInterval,
        format,
        isSameDay,
        isSameMonth,
        startOfWeek,
    } from 'date-fns';
    import { de } from 'date-fns/locale';
    import CalendarPager from './CalendarPager.svelte';
    import { getCalendarContext } from '../calendarContext.svelte';
    import { calendarDataAdapter } from '../services/calendarDataAdapter';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { untrack } from 'svelte';
    import type { MonthWeekRow } from '../types/CalendarLayout.types';

    const AXIS_LOCK_PX = 15;
    const COMMIT_PX = 50;

    const SEGMENT_HEIGHT_EXPANDED_PX = 16;
    const SEGMENT_HEIGHT_SHRUNK_PX = 6;
    const HEADER_HEIGHT_EXPANDED_PX = 34;
    const HEADER_HEIGHT_SHRUNK_PX = 22;

    $effect(() => {
        if (!areaHeight || dragging) return;
        const first = untrack(() => height.current) === 0;
        height.set(restingPx, { duration: first ? 0 : 400 });
    });

    const calendarContext = getCalendarContext();
    const weekStartOf = (d: Date) => startOfWeek(d, { weekStartsOn: 1 });

    const weekdays = Array.from({ length: 7 }, (_, i) =>
        addDays(weekStartOf(new Date()), i)
    );

    let area: HTMLDivElement;
    let areaWidth = $state(0);
    let areaHeight = $state(0);

    let expanded = $state(true);
    let dragging = $state(false);

    const collapsedPx = $derived(((areaWidth - 40 * 6) / 7) * 6 + 40 * 5);
    const minPx = $derived(Math.min(collapsedPx, areaHeight));
    const restingPx = $derived(expanded ? areaHeight : minPx);
    const height = new Tween(0, { duration: 400, easing: cubicOut });

    const clamp = (value: number, low = 0, high = 1) =>
        Math.min(high, Math.max(low, value));

    const progress = $derived(
        areaHeight > minPx ? clamp((height.current - minPx) / (areaHeight - minPx)) : 1
    );
    const lerp = (min: number, max: number): number => {
        return min + progress * (max - min);
    };

    const segmentHeightPx = $derived(
        lerp(SEGMENT_HEIGHT_SHRUNK_PX, SEGMENT_HEIGHT_EXPANDED_PX)
    );

    let headerHeightPx = $derived(
        lerp(HEADER_HEIGHT_SHRUNK_PX, HEADER_HEIGHT_EXPANDED_PX)
    );

    const weekHeight = $derived(Math.max(0, (height.current - 4 * 5) / 6));
    const laneFit = $derived(
        Math.max(
            0,
            (weekHeight - headerHeightPx - segmentHeightPx - 4) / (segmentHeightPx + 4)
        )
    );

    const maxLanes = $derived(Math.floor(laneFit));
    const shrinkOpacity = $derived(progress * 1);

    let tracking = false;
    let locked = false;
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let startH = 0;

    const onpointerdown = (e: PointerEvent) => {
        if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
        tracking = true;
        locked = false;
        pointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        startH = height.current;
    };

    const onpointermove = (e: PointerEvent) => {
        if (!tracking || e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!locked) {
            if (Math.abs(dx) > AXIS_LOCK_PX && Math.abs(dx) > Math.abs(dy)) {
                tracking = false;
                return;
            }
            if (Math.abs(dy) < AXIS_LOCK_PX) return;
            locked = true;
            dragging = true;
            area.setPointerCapture(e.pointerId);
        }

        height.set(Math.min(areaHeight, Math.max(minPx, startH + dy)), { duration: 0 });
    };

    const finish = (e: PointerEvent) => {
        if (!tracking || e.pointerId !== pointerId) return;
        if (!locked) return;
        tracking = false;
        locked = false;

        const dy = e.clientY - startY;
        if (dy > COMMIT_PX) expanded = true;
        else if (dy < -COMMIT_PX) expanded = false;

        dragging = false;
    };

    const firstAvailableRow = (dayIndex: number, week: MonthWeekRow) => {
        const segments = week.spans.segments.filter(
            (segment) =>
                segment.lane < maxLanes &&
                segment.startDay <= dayIndex &&
                segment.endDay >= dayIndex
        );

        const occupiedLanes = new Set(segments.map((segment) => segment.lane));

        let lane = 0;
        while (occupiedLanes.has(lane)) {
            lane++;
        }

        return lane + 2;
    };

    $effect(() => {
        if (!area) return;

        const capture = { capture: true } as const;

        // While the vertical gesture owns the pointer, don't let embla also drag sideways (mouse).
        const blockEmbla = (e: Event) => {
            if (locked) e.stopPropagation();
        };

        area.addEventListener('pointerdown', onpointerdown, capture);
        area.addEventListener('pointermove', onpointermove, capture);
        area.addEventListener('pointerup', finish, capture);
        area.addEventListener('pointercancel', finish, capture);
        area.addEventListener('mousemove', blockEmbla, capture);

        return () => {
            area.removeEventListener('pointerdown', onpointerdown, capture);
            area.removeEventListener('pointermove', onpointermove, capture);
            area.removeEventListener('pointerup', finish, capture);
            area.removeEventListener('pointercancel', finish, capture);
            area.removeEventListener('mousemove', blockEmbla, capture);
        };
    });
</script>

<div class="flex h-full min-h-0 flex-col px-2 pb-2">
    <div class="grid grid-cols-7 gap-1 pb-1">
        {#each weekdays as d (d.getTime())}
            <span class="text-center text-xs text-muted-foreground">
                {format(d, 'EEEEE', { locale: de })}
            </span>
        {/each}
    </div>

    <div
        bind:this={area}
        bind:clientWidth={areaWidth}
        bind:clientHeight={areaHeight}
        class="min-h-0 flex-1 touch-none"
        role="presentation"
    >
        <CalendarPager
            scrollY={false}
            onprev={() => calendarContext.navigateDate(-1)}
            onnext={() => calendarContext.navigateDate(1)}
        >
            {#snippet content(offset)}
                {@const page = calendarDataAdapter.getMonthLayout(
                    addMonths(calendarContext.viewingDate, offset)
                )}
                <div
                    class="grid min-h-0 grid-rows-6"
                    style:height={areaHeight ? `${height.current}px` : '100%'}
                    style:row-gap="{4}px"
                >
                    {#each page.weeks as week (week.weekStart.getTime())}
                        <div
                            class="grid min-h-0 grid-cols-7 overflow-hidden"
                            style:gap="{4}px"
                            style:grid-template-rows="{headerHeightPx}px repeat(5, {segmentHeightPx}px)
                            minmax(0, 1fr)"
                        >
                            {#each eachDayOfInterval( { start: week.weekStart, end: addDays(week.weekStart, 6) } ) as day, i (i)}
                                {@const isToday = isSameDay(
                                    calendarContext.todaysDate,
                                    day
                                )}
                                {@const isSelected = isSameDay(
                                    calendarContext.selectedDate,
                                    day
                                )}

                                <button
                                    onclick={() => calendarContext.setSelectedDate(day)}
                                    style:grid-row="1 / -1"
                                    style:grid-column={i + 1}
                                    style:padding-top="{lerp(4, 8)}px"
                                    type="button"
                                    class="flex min-h-0 w-full items-start justify-center overflow-hidden rounded-sm bg-bg-secondary text-center"
                                    class:opacity-50={!isSameMonth(day, page.monthStart)}
                                >
                                    <span
                                        style:font-size="{lerp(11, 14)}px"
                                        style:width="{lerp(18, 24)}px"
                                        style:height="{lerp(18, 24)}px"
                                        class="grid shrink-0 place-items-center rounded-sm leading-none"
                                        class:bg-primary={isToday}
                                        class:bg-bg-primary={isSelected}
                                        class:font-semibold={isToday || isSelected}
                                    >
                                        {format(day, 'd')}
                                    </span>
                                </button>
                            {/each}
                            {#each week.spans.segments.filter((segment) => segment.lane < maxLanes) as segment, i (i)}
                                <div
                                    class="mx-0.5 z-10 self-start overflow-hidden rounded-sm"
                                    style:background-color={segment.item.color}
                                    style:grid-column="{segment.startDay + 1} / {segment.endDay +
                                        2}"
                                    style:grid-row={segment.lane + 2}
                                    style:height="{segmentHeightPx}px"
                                >
                                    <span
                                        style:line-height="{segmentHeightPx}px"
                                        style:font-size="{11 * progress}px"
                                        style:opacity={shrinkOpacity}
                                        class="block truncate px-1.5 text-left"
                                    >
                                        {segment.item.summary}
                                    </span>
                                </div>
                            {/each}
                            {#each weekdays as item, i}
                                {@const overflowItems =
                                    (week.spans.itemsPerDay?.[i] ?? 0) - maxLanes}
                                {#if overflowItems > 0}
                                    <span
                                        class="pointer-events-none z-10 grid place-items-center self-start text-muted-foreground"
                                        style:grid-column={i + 1}
                                        style:grid-row={firstAvailableRow(i, week)}
                                        style:height="{segmentHeightPx}px"
                                    >
                                        <span
                                            class="rounded-full bg-muted-foreground"
                                            style:grid-area="1 / 1"
                                            style:width="{segmentHeightPx * 0.6}px"
                                            style:height="{segmentHeightPx * 0.6}px"
                                            style:opacity={1 - shrinkOpacity}
                                        ></span>
                                        <span
                                            style:grid-area="1 / 1"
                                            style:font-size="{11 * progress}px"
                                            style:line-height="{segmentHeightPx}px"
                                            style:opacity={shrinkOpacity}
                                        >
                                            +{overflowItems}
                                        </span>
                                    </span>
                                {/if}
                            {/each}
                        </div>
                    {/each}
                </div>
            {/snippet}
        </CalendarPager>
    </div>
</div>
