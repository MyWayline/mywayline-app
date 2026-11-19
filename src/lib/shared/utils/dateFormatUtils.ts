import { format, isSameDay, isSameYear, isToday } from 'date-fns';
import { userSettingsStore } from '#lib/shared/stores/userSettingStore.svelte.ts';

export enum DateFormat {
    NUMERIC = 'P',
    SHORT = 'PP',
    LONG = 'PPP',
    FULL = 'PPPP',
    TIME = 'p',
    DATE_TIME = 'Pp',
    MONTH = 'MMMM',
    MONTH_YEAR = 'MMMM yyyy',
    WEEKDAY = 'EEEE',
    WEEKDAY_INITIAL = 'EEEEE',
    WEEKDAY_SHORT = 'EEE',
    DAY_OF_MONTH = 'd',
    DAY_WEEKDAY = 'P | EEE',
    WEEKDAY_DATE = 'EEE, P',
}

export type HourFormat = '12h' | '24h';

export const formatDate = (
    dateInput: Date,
    dateFormat: DateFormat = DateFormat.NUMERIC
): string => {
    const locale = userSettingsStore.dateLocale;
    return format(dateInput, dateFormat, locale ? { locale } : undefined);
};

export const formatHour = (hour: number): string => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);

    return formatDate(date, DateFormat.TIME);
};

export const formatMonthYearIfNotCurrentYear = (date: Date) => {
    if (isSameYear(date, new Date())) {
        return formatDate(date, DateFormat.MONTH);
    }
    return formatDate(date, DateFormat.MONTH_YEAR);
};

export const formatEventDate = (
    startDate: Date,
    endDate?: Date | null,
    isAllDay: boolean = false
) => {
    if (isAllDay) {
        if (!endDate || isSameDay(startDate, endDate)) {
            return formatDate(startDate);
        }
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    if (isToday(startDate)) {
        const startTime = formatDate(startDate, DateFormat.TIME);

        if (!endDate) {
            return `Today, ${startTime} o'clock`;
        }

        const endTime = formatDate(endDate, DateFormat.TIME);

        if (!isSameDay(startDate, endDate)) {
            return `Today, ${startTime} - ${formatDate(endDate, DateFormat.DATE_TIME)}`;
        }

        return `Today, ${startTime} - ${endTime} o'clock`;
    }

    if (!endDate) {
        return `${formatDate(startDate, DateFormat.DATE_TIME)} o'clock`;
    }

    if (isSameDay(startDate, endDate)) {
        return `${formatDate(startDate, DateFormat.DATE_TIME)} - ${formatDate(endDate, DateFormat.TIME)} o'clock`;
    }

    return `${formatDate(startDate, DateFormat.DATE_TIME)} - ${formatDate(endDate, DateFormat.DATE_TIME)}`;
};
