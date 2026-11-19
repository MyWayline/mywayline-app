import { format, isSameDay, isSameYear, isToday } from 'date-fns';

export type HourFormat = '12h' | '24h';

export const formatHour = (hour: number, formatType: HourFormat = '24h'): string => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);

    if (formatType === '12h') {
        return new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: true }).format(
            date
        );
    }

    return hour.toString().padStart(2, '0') + ':00';
};

export const formatMonthYearIfNotCurrentYear = (date: Date) => {
    const now = new Date();

    if (isSameYear(date, now)) {
        return format(date, 'MMMM');
    }

    return format(date, 'MMMM yyyy');
};

export const formatEventDate = (
    startDate: Date,
    endDate?: Date | null,
    isAllDay: boolean = false
) => {
    if (isAllDay) {
        if (!endDate || isSameDay(startDate, endDate)) {
            return format(startDate, 'dd.MM.yyyy');
        }
        return `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`;
    }

    if (isToday(startDate)) {
        const startTime = format(startDate, 'HH:mm');

        if (!endDate) {
            return `Heute, ${startTime} Uhr`;
        }

        const endTime = format(endDate, 'HH:mm');

        if (!isSameDay(startDate, endDate)) {
            return `Heute, ${startTime} - ${format(endDate, 'dd.MM.yyyy HH:mm')}`;
        }

        return `Heute, ${startTime} - ${endTime} Uhr`;
    }

    if (!endDate) {
        return `${format(startDate, 'dd.MM.yyyy HH:mm')} Uhr`;
    }

    if (isSameDay(startDate, endDate)) {
        return `${format(startDate, 'dd.MM.yyyy HH:mm')} - ${format(endDate, 'HH:mm')} Uhr`;
    }

    return `${format(startDate, 'dd.MM.yyyy HH:mm')} - ${format(endDate, 'dd.MM.yyyy HH:mm')}`;
};
