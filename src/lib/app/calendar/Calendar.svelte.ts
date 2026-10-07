import type { CalendarMode } from '#lib/types/Calendar.ts';
import {
    addDays,
    addMonths,
    addWeeks,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    startOfMonth,
    startOfWeek,
} from 'date-fns';

let selectedDate: Date = $state(new Date());
let mode = $state<CalendarMode>('week');

export const getSelectedDate = () => selectedDate;

export const setSelectedDate = (date: Date) => {
    selectedDate = date;
};

export const getCalendarMode = () => mode;

export const setCalendarMode = (newMode: CalendarMode) => {
    mode = newMode;
};

/**
 * Gibt immer den Montag der aktuellen gewählten Woche zurück,
 * Sollte auf User-Language geändert werden
 */
export const getWeekStart = (date: Date = selectedDate): Date => {
    return startOfWeek(date, { weekStartsOn: 1 });
};

export const navigateDate = (direction: number) => {
    switch (mode) {
        case 'day':
            selectedDate = addDays(selectedDate, direction);
            break;
        case 'week':
            selectedDate = addWeeks(selectedDate, direction);
            break;
        case 'month':
            selectedDate = addMonths(selectedDate, direction);
            break;
    }
};
