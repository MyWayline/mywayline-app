<script lang="ts">
    import {
        addDays,
        addWeeks,
        format,
        getDate,
        isSameDay,
        startOfDay,
        startOfWeek,
    } from 'date-fns';
    import { de } from 'date-fns/locale';
    import { getCalendarContext } from '../calendarContext.svelte';
    import CalendarColumnSidebar from './CalendarColumnSidebar.svelte';
    import CalendarPager from './CalendarPager.svelte';
    import CalendarColumn from './CalendarColumn.svelte';
    import { userSettingsStore } from '#lib/stores/userSettingStore.svelte.ts';
    import { UserCalendarMode } from '#lib/types/UserSettings.types.ts';
    import type { SpanLayout, TimelineDay } from '../types/CalendarLayout.types';
    import { calendarDataAdapter } from '../services/calendarDataAdapter';
    import { Button } from '#lib';
    import { calendarCalculationUtil } from '../utils/calendarCalculationUtils';

    type Page = { days: TimelineDay[]; allDay: SpanLayout; focus: number | null };

    const calendarContext = getCalendarContext();

    /**
     * Identity of a page as a primitiv
     * while paging, viewingDate and offset shift together, so the number stays equal
     * and Svelte does NOT rebuild the layout of that page.
     */
    const pageTimestamp = (offset: number): number => {
        const viewingDate = calendarContext.viewingDate;

        return userSettingsStore.calendarMode === UserCalendarMode.DAY
            ? startOfDay(addDays(viewingDate, offset)).getTime()
            : startOfWeek(addWeeks(viewingDate, offset), { weekStartsOn: 1 }).getTime();
    };

    const buildPage = (timestamp: number): Page => {
        const mode = userSettingsStore.calendarMode;
        const date = new Date(timestamp);

        if (mode === UserCalendarMode.WEEK) {
            const week = calendarDataAdapter.getWeekLayout(date);
            return { days: week.days, allDay: week.allDay, focus: null };
        }

        if (mode === UserCalendarMode.DAY) {
            const week = calendarDataAdapter.getWeekLayout(date);
            const focus = week.days.findIndex((day) => isSameDay(day.date, date));

            return {
                days: week.days,
                allDay: calendarCalculationUtil.allDayLayoutForDay(week, focus),
                focus,
            };
        }

        return {
            days: [],
            allDay: { segments: [], itemsPerDay: [], laneCount: 0 },
            focus: null,
        };
    };

    const columns = (page: Page) =>
        page.days
            .map(
                (_, i) =>
                    `minmax(0, ${page.focus === null || page.focus === i ? 1 : 0}fr)`
            )
            .join(' ');

    let expandAllDayItems = $state(false);

    // Column transition only during a day/week switch, height transition only when the
    // user toggles the all-day area. Never while swiping
    let animateColumns = $state(false);
    let animateHeight = $state(false);
    let columnTimer: ReturnType<typeof setTimeout>;
    let heightTimer: ReturnType<typeof setTimeout>;

    // Rows visible on the active page for the all-day-header
    const visibleAllDayRows = $derived.by(() => {
        const allDay = buildPage(pageTimestamp(0)).allDay;
        if (!allDay) return 0;
        if (expandAllDayItems) return allDay.laneCount;
        const hasOverflow = allDay.itemsPerDay.some((n) => n > 1);
        return Math.min(allDay.laneCount, 1) + (hasOverflow ? 1 : 0);
    });

    const toggleAllDayItemsExpansion = () => {
        animateHeight = true;
        clearTimeout(heightTimer);
        heightTimer = setTimeout(() => (animateHeight = false), 300);
        expandAllDayItems = !expandAllDayItems;
    };

    const onHeaderClick = (selectedDate: Date) => {
        animateColumns = true;
        clearTimeout(columnTimer);
        columnTimer = setTimeout(() => (animateColumns = false), 300);

        if (userSettingsStore.calendarMode === UserCalendarMode.WEEK) {
            calendarContext.setViewingDate(selectedDate);
            userSettingsStore.setCalendarMode(UserCalendarMode.DAY);
        } else {
            userSettingsStore.setCalendarMode(UserCalendarMode.WEEK);
        }
    };

    const ease = 'duration-300 cubic-bezier(0.23,1,0.32,1)';
    const colAnim = $derived(
        animateColumns ? `transition-[grid-template-columns] ${ease}` : ''
    );
    const heightAnim = $derived(
        animateColumns
            ? 'transition-[height,grid-template-columns]'
            : animateHeight
              ? 'transition-[height]'
              : ''
    );
</script>

<div class="h-full min-h-0 min-w-0 w-full">
    <CalendarPager
        onprev={() => calendarContext.navigateDate(-1)}
        onnext={() => calendarContext.navigateDate(1)}
    >
        {#snippet header(offset)}
            {@const timestamp = pageTimestamp(offset)}
            {@const currentPage = buildPage(timestamp)}
            {@const allDay = currentPage.allDay}
            <div class="relative z-20 w-full flex flex-col">
                <!-- Day Info Headers -->
                <div
                    class="grid {colAnim}"
                    style:grid-template-columns={columns(currentPage)}
                >
                    {#each currentPage.days as day (day.date.getTime())}
                        <div class="min-w-0 overflow-x-clip whitespace-nowrap">
                            <div
                                class="flex h-full justify-center border-l border-muted pb-2"
                            >
                                <Button.Base onclick={() => onHeaderClick(day.date)}>
                                    {#snippet child({ props })}
                                        <button {...props}>
                                            <span class="text-xs text-muted-foreground">
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

                <!-- All-day items, we show default one, can be expanded -->
                <button
                    class="relative grid auto-rows-5 gap-y-1 overflow-hidden {ease} {heightAnim}"
                    style:height="{visibleAllDayRows * 1.5}rem"
                    style:grid-template-columns={columns(currentPage)}
                    aria-expanded={expandAllDayItems}
                    onclick={toggleAllDayItemsExpansion}
                >
                    <div
                        class="pointer-events-none absolute inset-0 z-0 grid {colAnim}"
                        style:grid-template-columns={columns(currentPage)}
                        aria-hidden="true"
                    >
                        {#each currentPage.days as _, i (i)}
                            <div class="min-w-0 overflow-x-clip">
                                <div class="h-full border-l border-muted"></div>
                            </div>
                        {/each}
                    </div>

                    {#each allDay.segments as segment (`${segment.item.uid}:${segment.startDay}:${segment.lane}`)}
                        {@const hidden = !expandAllDayItems && segment.lane > 0}
                        <div
                            class="relative z-10 min-w-0 flex overflow-hidden rounded-sm transition-opacity duration-200 data-[hidden=true]:pointer-events-none data-[hidden=true]:opacity-0"
                            data-hidden={hidden}
                            aria-hidden={hidden}
                            style:background-color={segment.item.color}
                            style:grid-column="{segment.startDay + 1} / {segment.endDay +
                                2}"
                            style:grid-row={segment.lane + 1}
                        >
                            <span class="truncate px-2 text-xs">
                                {segment.item.summary}
                            </span>
                        </div>
                    {/each}

                    <!-- Overflow indicators -->
                    {#each allDay.itemsPerDay as itemCount, index (index)}
                        {#if itemCount > 1}
                            <span
                                class="relative z-10 min-w-0 truncate px-2 pb-1 text-left text-xs font-medium leading-4 text-muted-foreground transition-opacity delay-75 duration-200 data-[hidden=true]:opacity-0 data-[hidden=true]:delay-0"
                                data-hidden={expandAllDayItems}
                                aria-hidden="true"
                                style:grid-column={index + 1}
                                style:grid-row={2}
                            >
                                +{itemCount - 1} more
                            </span>
                        {/if}
                    {/each}
                </button>
            </div>
        {/snippet}
        {#snippet content(offset)}
            {@const timestamp = pageTimestamp(offset)}
            {@const currentPage = buildPage(timestamp)}

            <div
                class="grid {colAnim}"
                style:grid-template-columns={columns(currentPage)}
            >
                {#each currentPage.days as day (day.date.getTime())}
                    <div class="min-w-0 overflow-x-clip">
                        <div class="h-full border-l border-muted">
                            <CalendarColumn
                                ondoubleclick={() => onHeaderClick(day.date)}
                                items={day.items}
                            />
                        </div>
                    </div>
                {/each}
            </div>
        {/snippet}
        {#snippet sidebar()}
            <CalendarColumnSidebar />
        {/snippet}
    </CalendarPager>
</div>
