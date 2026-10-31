<script lang="ts">
    import CalendarWeekDayView from '#lib/app/calendar/components/CalendarWeekDayView.svelte';
    import { setCalendarContext } from '../calendarContext.svelte';
    import { addDays, addMonths, addWeeks } from 'date-fns/fp';
    import { userSettingsStore } from '#lib/stores/userSettingStore.svelte.ts';
    import { UserCalendarMode } from '#lib/types/UserSettings.types.ts';
    import CalendarHeader from './CalendarHeader.svelte';
    import CalendarMonthView from './CalendarMonthView.svelte';

    let selectedDate = $state(new Date());
    let viewingDate = $state(new Date());
    let todaysDate = $state(new Date());
    let hourPxGap = 80;

    setCalendarContext({
        get selectedDate() {
            return selectedDate;
        },
        get viewingDate() {
            return viewingDate;
        },
        get columnHourPxGap() {
            return hourPxGap;
        },
        get todaysDate() {
            return todaysDate;
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
</script>

<div class="flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-hidden">
    <CalendarHeader />

    <div class="flex-1 min-h-0 min-w-0 overflow-hidden">
        {#if userSettingsStore.calendarMode === UserCalendarMode.MONTH}
            <CalendarMonthView />
        {:else}
            <CalendarWeekDayView />
        {/if}
    </div>
</div>
