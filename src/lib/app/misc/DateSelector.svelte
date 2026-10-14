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

<div
    class="mx-auto flex w-full min-w-0 max-w-95 flex-col bg-bg-primary p-3 text-foreground sm:p-4"
>
    <div class="mb-3 flex items-center px-1">
        <Button.Root
            variant="ghost"
            onclick={zoomOut}
            class="h-11 min-w-0 rounded-xl px-4 text-base font-semibold  hover:bg-muted active:scale-[0.98]"
        >
            {title}
        </Button.Root>
    </div>

    <!-- Month Grid View -->
    {#if view === 'day'}
        <div
            class="mb-2 grid grid-cols-7 text-center
                   text-xs font-medium text-muted-foreground"
        >
            {#each getWeekDays(new Date()) as date (date.getTime())}
                <span class="py-2">
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
                                        'h-9 w-9 items-center justify-center rounded-full p-0 text-sm font-medium',
                                        {
                                            'text-muted-foreground/50': !day.inMonth,
                                            'bg-primary hover:bg-primary/90':
                                                day.date.toDateString() ===
                                                selectedDate.toDateString(),
                                            'font-bold ring-1 ring-inset ring-primary/40':
                                                day.date.toDateString() ===
                                                    new Date().toDateString() &&
                                                day.date.toDateString() !==
                                                    selectedDate.toDateString(),
                                        },
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
                <div class="grid grid-cols-3 gap-2 py-1">
                    {#each getMonthsOfYear(year, selectedDate) as month (month.date.getTime())}
                        <Button.Root
                            onclick={() => selectMonth(year, month.index)}
                            variant="ghost"
                            class={[
                                'h-12 min-w-0 rounded-lg px-1 text-sm font-medium',
                                {
                                    'bg-primary hover:bg-primary/90':
                                        selectedDate.getFullYear() === year &&
                                        selectedDate.getMonth() === month.index,
                                    'hover:bg-muted':
                                        selectedDate.getFullYear() !== year ||
                                        selectedDate.getMonth() !== month.index,
                                },
                            ]}
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
                <div class="grid grid-cols-3 gap-2 py-1">
                    {#each Array.from({ length: 12 }, (_, k) => yearBlock * 12 + k + YEAR_BLOCK_OFFSET) as year (year)}
                        <Button.Root
                            variant="ghost"
                            class={[
                                'h-12 min-w-0 rounded-lg px-1 text-sm font-medium',
                                {
                                    'bg-primary hover:bg-primary/90':
                                        year === selectedDate.getFullYear(),
                                    'hover:bg-muted': year !== selectedDate.getFullYear(),
                                },
                            ]}
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
