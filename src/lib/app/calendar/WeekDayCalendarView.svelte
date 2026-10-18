<script lang="ts">
    import CalendarPager from './CalendarPager.svelte';
    import { Button } from '#lib';
    import { format, getDate, isSameDay } from 'date-fns';
    import CalendarColumnTimeSidebar from './CalendarColumnTimeSidebar.svelte';
    import CalendarColumn from './CalendarColumn.svelte';
    import { allDayLayoutForDay } from '#lib/utils/CalendarCalculation.ts';
    import {
        getCalendarMode,
        getSelectedDate,
        getWeekStart,
        navigateDate,
        setCalendarMode,
        setSelectedDate,
    } from '#lib/stores/calendarStore.svelte.ts';
    import { addDays, addWeeks, startOfWeek } from 'date-fns/fp';
    import { de } from 'date-fns/locale';
    import { slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import type {
        AllDayLayout,
        DayLayout,
        WeekLayout,
    } from '#lib/types/CalendarCalculations.ts';

    let {
        getWeeks,
        topOffset = 0,
    }: {
        getWeeks: (weekStartDay: Date) => WeekLayout;
        topOffset?: number;
    } = $props();

    type Page = { days: DayLayout[]; allDay: AllDayLayout; focus: number | null };

    const SLIDE_MS = 250;

    const selectedDate = $derived(getSelectedDate());
    const weekStart = $derived(getWeekStart(getSelectedDate()));
    let expandAllDayItems = $state(false);

    // Each pager page measures its natural all-day content height. Only the
    // visible page controls the shared row height.
    let allDayHeights = $state<number[]>([]);
    const MIN_ALL_DAY_HEIGHT = 40;
    const allDayH = $derived(allDayHeights[1] ?? MIN_ALL_DAY_HEIGHT);
    let dateHeaderHeight = $state(0);

    const pages = $derived.by((): Page[] => {
        const weeks = [-1, 0, 1].map((w) => getWeeks(addWeeks(w, weekStart)));
        const mode = getCalendarMode();

        if (mode === 'week') {
            return weeks.map((week) => ({
                days: week.days,
                allDay: week.allDay,
                focus: null,
            }));
        }

        if (mode === 'day') {
            // Every page still renders a full week but only its own day is "focused"
            const pageForDate = (date: Date): Page => {
                const week =
                    weeks.find((w) => w.days.some((d) => isSameDay(d.date, date))) ??
                    weeks[1];
                const idx = Math.max(
                    0,
                    week.days.findIndex((d) => isSameDay(d.date, date))
                );
                return {
                    days: week.days,
                    allDay: allDayLayoutForDay(week, idx),
                    focus: idx,
                };
            };

            return [
                pageForDate(addDays(-1, selectedDate)),
                pageForDate(selectedDate),
                pageForDate(addDays(1, selectedDate)),
            ];
        }

        return [];
    });

    const grow = (focus: number | null, i: number) =>
        focus === null || focus === i ? 1 : 0;

    let animate = $state(false);
    let prevMode = getCalendarMode();
    let timer: ReturnType<typeof setTimeout>;

    $effect.pre(() => {
        const mode = getCalendarMode();
        if (mode !== prevMode) {
            prevMode = mode;
            animate = true;
            clearTimeout(timer);
            timer = setTimeout(() => (animate = false), 300);
        }
    });

    // Animate the shared height only right after the page/date changed,
    // not during expand/collapse (those already animate via slide).
    let animateHeight = $state(false);
    let prevDate = getSelectedDate().getTime();
    let heightTimer: ReturnType<typeof setTimeout>;

    $effect.pre(() => {
        const t = getSelectedDate().getTime();
        if (t !== prevDate) {
            prevDate = t;
            animateHeight = true;
            clearTimeout(heightTimer);
            heightTimer = setTimeout(() => (animateHeight = false), 300);
        }
    });

    const heightAnim = $derived(
        animateHeight
            ? 'transition-[height] duration-300 ease-in-out motion-reduce:transition-none'
            : ''
    );

    const gridAnim = $derived(
        animate
            ? 'transition-[grid-template-columns] duration-300 ease-in-out motion-reduce:transition-none'
            : ''
    );

    // Only animate when the mode is changing
    const cellBase = 'min-w-0 basis-0 overflow-x-clip whitespace-nowrap';
    const cellAnimated =
        'transition-[flex-grow,grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none';
    const cell = $derived(animate ? `${cellBase} ${cellAnimated}` : cellBase);

    const onSelectDay = (date: Date) => {
        if (getCalendarMode() === 'week') {
            setSelectedDate(date);
            setCalendarMode('day');
        } else {
            setCalendarMode('week');
        }
    };

    const gridColumns = (page: Page) =>
        page.days.map((_, i) => `minmax(0, ${grow(page.focus, i)}fr)`).join(' ');
</script>

<div class="relative grid w-full min-w-0 grid-cols-[max-content_minmax(0,1fr)]">
    <div class="col-start-1">
        <div
            class="sticky z-30 bg-bg-primary {heightAnim}"
            style:top="{topOffset}px"
            style:height="{dateHeaderHeight + allDayH}px"
        ></div>
        <CalendarColumnTimeSidebar />
    </div>

    <div class="col-start-2 min-w-0">
        <CalendarPager onPrev={() => navigateDate(-1)} onNext={() => navigateDate(1)}>
            {#snippet page(offset)}
                {@const currentPage = pages[offset + 1]}

                <div class="flex flex-col">
                    <!-- Sticky Date Header -->
                    <div
                        class="sticky z-20 flex h-12.5 border-b border-muted bg-bg-primary"
                        style:top="{topOffset}px"
                        bind:clientHeight={dateHeaderHeight}
                    >
                        {#each currentPage.days as day, i (day.date.getTime())}
                            <div
                                class={cell}
                                style:flex-grow={grow(currentPage.focus, i)}
                            >
                                <div
                                    class="h-full border-l border-muted [&_button]:h-full [&_button]:w-full"
                                >
                                    <Button.Base>
                                        {#snippet child({ props })}
                                            <button
                                                {...props}
                                                onclick={() => onSelectDay(day.date)}
                                            >
                                                <span
                                                    class="text-xs text-muted-foreground"
                                                >
                                                    {format(day.date, 'EEEEE', {
                                                        locale: de,
                                                    })}
                                                </span>
                                                <p class="text-lg font-medium">
                                                    {getDate(day.date)}
                                                </p>
                                            </button>
                                        {/snippet}
                                    </Button.Base>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <!-- Sticky WholeDay Events/Tasks Bar -->
                    <div
                        class="sticky z-10 overflow-hidden border-b border-muted bg-bg-primary cursor-pointer select-none shadow-md {heightAnim}"
                        style:height="{allDayH}px"
                        style:top="{topOffset + dateHeaderHeight}px"
                        role="button"
                        tabindex="0"
                        aria-expanded={expandAllDayItems}
                        aria-label="Toggle all-day items visibility"
                        onclick={() => (expandAllDayItems = !expandAllDayItems)}
                        onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                expandAllDayItems = !expandAllDayItems;
                            }
                        }}
                    >
                        <div
                            class="pointer-events-none absolute inset-0 flex"
                            aria-hidden="true"
                        >
                            {#each currentPage.days as day, i (day.date.getTime())}
                                <div
                                    class={cell}
                                    style:flex-grow={grow(currentPage.focus, i)}
                                >
                                    <div class="h-full border-l border-muted"></div>
                                </div>
                            {/each}
                        </div>

                        <!-- AllDayHeader Content -->
                        <!-- Keyed by week so swiping doesn't replay the transitions. -->
                        {#key currentPage.days[0]?.date.getTime()}
                            <div
                                style:grid-template-columns={gridColumns(currentPage)}
                                class="relative grid min-h-10 pt-2 pb-1 {gridAnim}"
                                bind:offsetHeight={allDayHeights[offset + 1]}
                            >
                                {#each currentPage.allDay.bars as item, i (item.entry.uid)}
                                    {#if expandAllDayItems || item.row === 0}
                                        <div
                                            class="min-w-0 px-1 pb-1"
                                            style:grid-column="{item.startDay + 1} / {item.endDay +
                                                2}"
                                            style:grid-row={item.row + 1}
                                            transition:slide={{
                                                duration: SLIDE_MS,
                                                easing: cubicOut,
                                            }}
                                        >
                                            <p
                                                class="overflow-hidden text-ellipsis whitespace-nowrap rounded-sm p-1 text-xs font-medium"
                                                style="background-color: {item.entry
                                                    .color ??
                                                    'blue'}; color: contrast-color({item
                                                    .entry.color});"
                                            >
                                                {item.entry.summary}
                                            </p>
                                        </div>
                                    {/if}
                                {/each}

                                {#each currentPage.allDay.hiddenPerDay as hidden, index (index)}
                                    {#if !expandAllDayItems && hidden > 0}
                                        <div
                                            class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-2 pb-1 text-xs font-medium text-muted-foreground"
                                            style:grid-column={index + 1}
                                            style:grid-row={currentPage.allDay.rowCount +
                                                1}
                                            aria-hidden="true"
                                            transition:slide={{
                                                duration: SLIDE_MS,
                                                easing: cubicOut,
                                            }}
                                        >
                                            +{hidden} more
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        {/key}
                    </div>

                    <!-- Columns Content -->
                    <div class="flex">
                        {#each currentPage.days as day, i (day.date.getTime())}
                            <div
                                class={cell}
                                style:flex-grow={grow(currentPage.focus, i)}
                            >
                                <div class="border-l border-muted">
                                    <CalendarColumn items={day.timedEntries} />
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/snippet}
        </CalendarPager>
    </div>
</div>
