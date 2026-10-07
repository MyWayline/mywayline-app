<script lang="ts">
    import { type CalendarMode } from '#lib/types/Calendar.ts';
    import {
        getMonthGrid,
        getMonthsOfYear,
        getWeekDays,
    } from '#lib/utils/CalendarGridUtils.ts';
    import { getSelectedDate } from '../calendar/Calendar.svelte';
    import { Button } from '#lib';
    import SwipeCarousel from './SwipeCarousel.svelte';
    import { format } from 'date-fns';

    let {
        mode = 'day',
        onselect = (selectedDate: Date) => {},
    }: { mode: CalendarMode; onselect: (selectedDate: Date) => void } = $props();

    const YEAR_BLOCK_OFFSET = 4;

    let view = $derived<'day' | 'month' | 'year'>(
        mode === 'day' || mode === 'week' ? 'day' : 'month'
    );

    let selectedDate = $state(getSelectedDate());
    let initial = getSelectedDate();

    let monthIndex = $state(initial.getFullYear() * 12 + initial.getMonth());
    let yearIndex = $state(initial.getFullYear());
    // Each year block consists of 12 years
    let yearBlockIndex = $state(Math.floor(initial.getFullYear() / 12));

    const selectDay = (date: Date) => {
        onselect(date);
    };

    const selectMonth = (year: number, month: number) => {
        // Update month index to the selected month
        monthIndex = year * 12 + month;

        // Don't change view if calendar mode is month to day
        if (mode === 'month') {
            onselect(new Date(year, month, 1));
            return;
        }
        view = 'day';
    };

    const selectYear = (year: number) => {
        view = 'month';
        yearIndex = year;
    };

    const monthIndexToDate = (idx: number) =>
        new Date(Math.floor(idx / 12), ((idx % 12) + 12) % 12, 1);

    const title = $derived(
        view === 'day'
            ? format(monthIndexToDate(monthIndex), 'MMMM yyyy')
            : view === 'month'
              ? yearIndex.toString()
              : `${yearBlockIndex * 12 + YEAR_BLOCK_OFFSET} - ${yearBlockIndex * 12 + 11}`
    );

    const zoomOut = () => {
        switch (view) {
            case 'day':
                yearIndex = Math.floor(monthIndex / 12);
                view = 'month';
                break;
            case 'month':
                yearBlockIndex = Math.floor(yearIndex / 12);
                view = 'year';
                break;
        }
    };
</script>

<div class="flex flex-col w-full max-w-[320px] select-none bg-background text-foreground">
    <!-- Header zoom -->
    <div class="flex items-center justify-between mb-3 px-1">
        <Button.Root
            variant="ghost"
            onclick={zoomOut}
            class="text-sm font-semibold h-8 px-2.5 transition-colors"
        >
            {title}
        </Button.Root>
    </div>

    <!-- Month Grid View -->
    {#if view === 'day'}
        <div
            class="grid grid-cols-7 mb-1 text-center text-xs font-medium text-muted-foreground"
        >
            {#each getWeekDays(new Date()) as date (date.getTime())}
                <span>
                    {format(date, 'EEEEE')}
                </span>
            {/each}
        </div>
        <SwipeCarousel bind:index={monthIndex}>
            {#snippet slide(i)}
                <div class="grid grid-cols-7 grid-rows-6 gap-y-1">
                    {#each getMonthGrid( monthIndexToDate(i), selectedDate, { fixedRows: true } ) as week}
                        {#each week.days as day (day.date.getTime())}
                            <div class="flex items-center justify-center">
                                <Button.Root
                                    onclick={() => selectDay(day.date)}
                                    variant="ghost"
                                    class={[
                                        'h-8 w-8 p-0 font-normal text-xs rounded-full flex items-center justify-center',
                                        { 'opacity-50': !day.inMonth },
                                    ]}
                                >
                                    {day.day}
                                </Button.Root>
                            </div>
                        {/each}
                    {/each}
                </div>
            {/snippet}
        </SwipeCarousel>
    {/if}

    <!-- Year Grid View -->
    {#if view === 'month'}
        <SwipeCarousel bind:index={yearIndex}>
            {#snippet slide(year)}
                <div class="grid grid-cols-3 gap-2 py-2">
                    {#each getMonthsOfYear(year, selectedDate) as month}
                        <Button.Root
                            onclick={() => selectMonth(year, month.index)}
                            variant="ghost"
                            class="h-10 w-full text-xs font-medium"
                        >
                            {month.label}
                        </Button.Root>
                    {/each}
                </div>
            {/snippet}
        </SwipeCarousel>
    {/if}

    <!-- Multi-Year Block View (Years) -->
    {#if view === 'year'}
        <SwipeCarousel bind:index={yearBlockIndex}>
            {#snippet slide(yearBlock)}
                <div class="grid grid-cols-3 gap-2 py-2">
                    {#each Array.from({ length: 12 }, (_, k) => yearBlock * 12 + k + YEAR_BLOCK_OFFSET) as year (year)}
                        <Button.Root
                            variant="ghost"
                            class="h-10 w-full text-xs font-medium"
                            onclick={() => selectYear(year)}
                        >
                            {year}
                        </Button.Root>
                    {/each}
                </div>
            {/snippet}
        </SwipeCarousel>
    {/if}
</div>
