import { calendarDataStore } from '../stores/calendarDataStore.svelte';
import type { MonthLayout, WeekLayout } from '../types/CalendarLayout.types';
import { calendarCalculationUtil } from '../utils/calendarCalculationUtils';

export const calendarDataAdapter = {
    getWeekLayout(date: Date): WeekLayout {
        const items = calendarDataStore.getItemsForWeekOf(date);
        return calendarCalculationUtil.convertItemsForWeek(date, items);
    },
    getMonthLayout(date: Date): MonthLayout {
        const items = calendarDataStore.getItemsForMonthOf(date);
        return calendarCalculationUtil.convertItemsForMonth(date, items);
    },
};
