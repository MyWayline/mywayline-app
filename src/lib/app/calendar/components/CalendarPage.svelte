<script lang="ts">
    import CalendarWeekDayView from '#lib/app/calendar/components/CalendarWeekDayView.svelte';
    import { setCalendarContext } from '../calendarContext.svelte';
    import { addDays, addMonths, addWeeks } from 'date-fns/fp';
    import { userSettingsStore } from '#lib/shared/stores/userSettingStore.svelte.ts';
    import { UserCalendarMode } from '#lib/shared/types/UserSettings.types.ts';
    import CalendarHeader from './CalendarHeader.svelte';
    import CalendarMonthView from './CalendarMonthView.svelte';
    import { Button } from '#lib';
    import { Pencil, Plus, Trash, X } from '@lucide/svelte';
    import { set } from 'date-fns';
    import type { ColumnRangeSelection } from '../types/CalendarLayout.types';
    import { goto } from '$app/navigation';
    import NormalBottomSheet from '#lib/shared/components/BottomSheet/NormalBottomSheet.svelte';
    import { calendarDataStore } from '../stores/calendarDataStore.svelte';
    import { formatEventDate } from '#lib/shared/utils/DateFormatUtils.ts';
    import type { ICalEvent } from '#lib/shared/types/Calendar.types.ts';
    import { DateFormat, formatDate } from '#lib/shared/utils/DateFormatUtils.ts';

    let selectedDate = $state(new Date());
    let viewingDate = $state(new Date());
    let todaysDate = $state(new Date());
    let hourPxGap = 80;
    let columnRangeSelectionFormated = $derived.by(() => {
        if (!columnRangeSelection) {
            return null;
        }

        const date = new Date(columnRangeSelection.dayKey);
        const startDate = set(date, {
            hours: columnRangeSelection.start / hourPxGap,
            minutes: ((columnRangeSelection.start / hourPxGap) % 1) * 60,
        });
        const endDate = set(date, {
            hours: columnRangeSelection.end / hourPxGap,
            minutes: ((columnRangeSelection.end / hourPxGap) % 1) * 60,
        });

        return {
            startTime: startDate,
            endTime: endDate,
        };
    });
    let columnRangeSelection = $state<ColumnRangeSelection | null>(null);
    let selectedItemId = $state<null | string>(null);

    setCalendarContext({
        get selectedDate() {
            return selectedDate;
        },
        setSelectedItemId(value: string) {
            selectedItemId = value;
        },
        get viewingDate() {
            return viewingDate;
        },
        get columnRangeSelection() {
            return columnRangeSelection;
        },
        set columnRangeSelection(newValue) {
            columnRangeSelection = newValue;
        },
        get columnHourPxGap() {
            return hourPxGap;
        },
        get todaysDate() {
            return todaysDate;
        },
        setColumnRangeSelection(data: ColumnRangeSelection | null) {
            columnRangeSelection = data;
        },
        setSelectedDate(newDate: Date) {
            selectedDate = newDate;
        },
        setViewingDate(newDate: Date) {
            viewingDate = newDate;
        },
        navigateDate(direction: number) {
            switch (userSettingsStore.calendarMode) {
                case UserCalendarMode.DAY:
                    viewingDate = addDays(direction, viewingDate);
                    break;
                case UserCalendarMode.WEEK:
                    viewingDate = addWeeks(direction, viewingDate);
                    break;
                case UserCalendarMode.MONTH:
                    viewingDate = addMonths(direction, viewingDate);
                    break;
            }
        },
    });

    const rangeLabel = (formatedSelection: { startTime: Date; endTime: Date }) =>
        `${formatDate(formatedSelection.startTime, DateFormat.WEEKDAY_DATE)} | ` +
        `${formatDate(formatedSelection.startTime, DateFormat.TIME)} – ${formatDate(formatedSelection.endTime, DateFormat.TIME)}`;

    $effect(() => {
        if (!selectedItemId || selectedItemId.trim() === '') {
            selectedEvent = null;
            return;
        }
        const item = calendarDataStore.getItemById(selectedItemId);

        if (item.type === 'event') {
            selectedEvent = item;
            isEventPreviewOpen = true;
        }
    });

    let isEventPreviewOpen = $state(false);
    let selectedEvent: null | ICalEvent = $state(null);
</script>

<div class="flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-hidden">
    <CalendarHeader />

    <div class="relative flex-1 min-h-0 min-w-0 overflow-hidden">
        {#if userSettingsStore.calendarMode === UserCalendarMode.MONTH}
            <CalendarMonthView />
        {:else}
            <CalendarWeekDayView />
        {/if}

        <div class="absolute inset-x-2 z-1 bottom-2 flex items-center justify-end gap-2">
            {#if columnRangeSelection}
                <Button.Root
                    iconOnly
                    size="lg"
                    variant="muted"
                    onclick={() => (columnRangeSelection = null)}
                >
                    <X size={20} />
                </Button.Root>
            {/if}

            <Button.Root
                size="lg"
                style="width: {columnRangeSelection
                    ? '100%'
                    : '2rem'}; view-transition-name: calendar-create;"
                class="text-left shadow-lg rounded-full transition-[width] duration-300 ease-out  {columnRangeSelection
                    ? 'justify-start'
                    : ''}"
                onclick={() => goto('/app/calendar/create')}
            >
                <Plus size={20} class="shrink-0" />
                {#if columnRangeSelectionFormated}
                    <span class="truncate whitespace-nowrap text-sm">
                        {rangeLabel(columnRangeSelectionFormated)}
                    </span>
                {/if}
            </Button.Root>
        </div>
    </div>
</div>

<NormalBottomSheet
    fitContent
    bind:isOpen={isEventPreviewOpen}
    onclose={() => (selectedItemId = null)}
>
    <div class="flex flex-col p-4 z-100">
        <div class="flex justify-between">
            <div class="flex items-center gap-2">
                <div
                    class="size-5 rounded-full"
                    style:background-color={selectedEvent?.color}
                ></div>
                <span class="font-semibold text-xl">{selectedEvent?.summary}</span>
            </div>
            <div class="flex items-center">
                <Button.Root
                    variant="ghost"
                    iconOnly
                    onclick={() =>
                        goto(`/app/calendar/edit/event?id=${selectedEvent?.uid}`)}
                    ><Pencil size={20} /></Button.Root
                >
                <Button.Root variant="ghost" iconOnly><Trash size={20} /></Button.Root>
            </div>
        </div>
        <span class="text-muted-foreground ml-7">
            {formatEventDate(
                selectedEvent?.dtstart ?? new Date(),
                selectedEvent?.dtend,
                selectedEvent?.isAllDay ?? false
            )}
        </span>
    </div>
</NormalBottomSheet>
