<script lang="ts">
    import HorizontalSliderBase from '../Slider/HorizontalSliderBase.svelte';
    import {
        getMonthGrid,
        getMonthsOfYear,
        getWeekDays,
        getYearBlockForDate,
    } from '#lib/utils/CalendarGridUtils.ts';
    import { Button } from '#lib';
    import {
        addMonths,
        addYears,
        format,
        isWithinInterval,
        isSameDay,
        isSameMonth,
        isSameYear,
        isToday,
    } from 'date-fns';
    import { ChevronLeft, ChevronRight } from '@lucide/svelte';
    import type { EmblaCarouselType } from 'embla-carousel';
    import { formatDate } from '#lib/utils/DateFormatUtils.ts';

    type DateSelectorMode = 'DAY' | 'MONTH' | 'YEAR';
    type SelectionMode = 'SINGLE' | 'RANGE';

    let {
        viewMode = 'DAY',
        mode = 'SINGLE',
        onselect,
        min = new Date(1900, 0, 1),
        max = new Date(2100, 0, 1),
        startDate = new Date(),
    }: {
        viewMode?: DateSelectorMode;
        mode?: SelectionMode;
        onselect?: (startDate: Date, endDate: Date | null) => void;
        startDate?: Date;
        min?: Date;
        max?: Date;
    } = $props();

    let currentView = $state<DateSelectorMode>(viewMode);

    $effect(() => {
        currentView = viewMode;
    });

    let viewDate = $derived(startDate);

    let dateRange = $state<{ startDate: Date | null; endDate: Date | null }>({
        startDate: startDate,
        endDate: null,
    });

    const isInDateRange = (date: Date) => {
        if (dateRange.startDate === null || dateRange.endDate === null) return false;

        return isWithinInterval(date, {
            start: dateRange.startDate,
            end: dateRange.endDate,
        });
    };

    const slideSwitch = (direction: -1 | 1) => {
        switch (currentView) {
            case 'DAY':
                viewDate = addMonths(viewDate, direction);
                break;
            case 'MONTH':
                viewDate = addYears(viewDate, direction);
                break;
            case 'YEAR':
                viewDate = addYears(viewDate, direction * 12);
                break;
        }
    };

    const onSwitchPress = () => {
        switch (currentView) {
            case 'DAY':
                currentView = 'MONTH';
                break;
            case 'MONTH':
                currentView = 'YEAR';
                break;
        }
    };

    const onyearselect = (date: Date) => {
        viewDate = date;
        if (viewMode === 'YEAR') {
            dateRange.startDate = date;
            dateRange.endDate = null;
            onselect?.(date, null);
            return;
        }

        currentView = 'MONTH';
    };

    const onmonthselect = (date: Date) => {
        viewDate = date;

        if (viewMode === 'MONTH') {
            dateRange.startDate = date;
            dateRange.endDate = null;
            onselect?.(date, null);
            return;
        }

        currentView = 'DAY';
    };

    const ondayselect = (date: Date) => {
        if (mode === 'SINGLE') {
            dateRange.startDate = date;
            dateRange.endDate = date;
            onselect?.(date, date);
            return;
        }

        if (
            dateRange.startDate == null ||
            (dateRange.startDate != null && dateRange.endDate != null)
        ) {
            dateRange.startDate = date;
            dateRange.endDate = null;
            onselect?.(date, null);
            return;
        }

        if (date < dateRange.startDate) {
            dateRange.endDate = dateRange.startDate;
            dateRange.startDate = date;
        } else {
            dateRange.endDate = date;
        }

        onselect?.(dateRange.startDate, dateRange.endDate);
    };

    const title = $derived.by(() => {
        switch (currentView) {
            case 'DAY':
                return format(viewDate, 'MMMM yyyy');
            case 'MONTH':
                return viewDate.getFullYear();
            case 'YEAR':
                const year = viewDate.getFullYear();
                const startYear = year - (year % 12);
                return `${startYear} - ${startYear + 11}`;
        }
    });

    const isDateOutOfBoundary = (dateToCheck: Date) => {
        return !isWithinInterval(dateToCheck, { start: min, end: max });
    };

    let emblaApi: EmblaCarouselType | undefined = $state(undefined);
</script>

<div
    class="overflow-x-clip w-full min-w-0 max-w-84 h-84 flex flex-col bg-bg-primary text-foreground"
>
    <div class="flex items-center justify-between mb-2">
        <Button.Root variant="ghost" iconOnly onclick={() => emblaApi?.scrollPrev()}>
            <ChevronLeft />
        </Button.Root>
        <Button.Root variant="ghost" onclick={onSwitchPress} class="font-semibold">
            {title}
        </Button.Root>
        <Button.Root variant="ghost" iconOnly onclick={() => emblaApi?.scrollNext()}>
            <ChevronRight />
        </Button.Root>
    </div>
    <div class="flex justify-around">
        {#each getWeekDays(viewDate) as weekday (weekday.getTime())}
            <p class="text-xs text-muted-foreground">
                {formatDate(weekday, 'weekdaySmall')}
            </p>
        {/each}
    </div>
    <HorizontalSliderBase
        onnext={() => slideSwitch(1)}
        onprev={() => slideSwitch(-1)}
        bind:emblaApi
    >
        {#snippet slide(offset)}
            <div class="overflow-x-clip w-full">
                {#if currentView === 'DAY'}
                    <div class="grid grid-cols-7 grid-rows-6 place-items-center">
                        {#each getMonthGrid(addMonths(viewDate, offset)) as month}
                            {#each month.days as day (day.date.getTime())}
                                {@const isTodayDate = isToday(day.date)}
                                {@const isSelected = dateRange.startDate
                                    ? isSameDay(day.date, dateRange.startDate)
                                    : false}
                                {@const isInRange = isInDateRange(day.date)}
                                {@const isStartOfRange =
                                    isInRange && dateRange.startDate
                                        ? isSameDay(day.date, dateRange.startDate)
                                        : false}
                                {@const isEndOfRange =
                                    isInRange && dateRange.endDate
                                        ? isSameDay(day.date, dateRange.endDate)
                                        : false}

                                {@const isDisabled = isDateOutOfBoundary(day.date)}

                                <Button.Root
                                    onclick={() => ondayselect(day.date)}
                                    variant="ghost"
                                    aria-label={day.date.toLocaleDateString()}
                                    aria-pressed={isSelected}
                                    disabled={isDisabled}
                                    class="size-12  flex items-center justify-center text-sm font-medium disabled:opacity-50
                                        {!day.inMonth ? 'opacity-50' : ''}
                                        {isInRange ? 'bg-muted rounded-none' : ''}
                                        {isStartOfRange ? 'rounded-l-sm' : ''}
                                        {isEndOfRange ? 'rounded-r-sm' : ''}
                                        {isSelected || isStartOfRange || isEndOfRange
                                        ? 'bg-muted text-foreground font-semibold'
                                        : ''}
                                        {isTodayDate &&
                                    !isSelected &&
                                    !isStartOfRange &&
                                    !isEndOfRange &&
                                    !isInRange
                                        ? 'font-bold border border-primary'
                                        : ''}
                                    "
                                >
                                    {day.day}
                                </Button.Root>
                            {/each}
                        {/each}
                    </div>
                {:else if currentView === 'MONTH'}
                    <div class="grid grid-cols-3 gap-2 p-2">
                        {#each getMonthsOfYear(addYears(viewDate, offset)) as month (month.date.getTime())}
                            {@const isSelected = dateRange.startDate
                                ? isSameMonth(dateRange.startDate, month.date)
                                : isSameMonth(viewDate, month.date)}
                            {@const isDisabled = isDateOutOfBoundary(month.date)}
                            <Button.Root
                                onclick={() => onmonthselect(month.date)}
                                variant="ghost"
                                disabled={isDisabled}
                                class="h-14 flex items-center justify-center text-sm font-medium rounded-lg disabled:opacity-50 {isSelected
                                    ? 'bg-muted text-foreground font-semibold'
                                    : ''}"
                            >
                                {month.label}
                            </Button.Root>
                        {/each}
                    </div>
                {:else if currentView === 'YEAR'}
                    <div class="grid grid-cols-3 gap-2 p-2">
                        {#each getYearBlockForDate(addYears(viewDate, offset * 12)) as year (year.date.getTime())}
                            {@const isSelected = dateRange.startDate
                                ? isSameYear(dateRange.startDate, year.date)
                                : isSameYear(viewDate, year.date)}
                            {@const isDisabled = isDateOutOfBoundary(year.date)}
                            <Button.Root
                                onclick={() => onyearselect(year.date)}
                                variant="ghost"
                                disabled={isDisabled}
                                class="h-14 disabled:opacity-50 flex items-center justify-center text-sm font-medium rounded-lg {isSelected
                                    ? 'bg-muted text-foreground font-semibold'
                                    : ''}"
                            >
                                {year.label}
                            </Button.Root>
                        {/each}
                    </div>
                {/if}
            </div>
        {/snippet}
    </HorizontalSliderBase>
</div>
