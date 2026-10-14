import { format, isSameYear } from 'date-fns';

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
