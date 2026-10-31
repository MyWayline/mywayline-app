import {
    addDays,
    format,
    getISOWeek,
    isSameDay,
    isSameMonth,
    isSameWeek,
    isSameYear,
    startOfMonth,
    startOfWeek,
} from 'date-fns';
import { de } from 'date-fns/locale';
import type {
    CalendarDay,
    CalendarGridOptions,
    CalendarMonth,
    CalendarWeek,
    WeekStart,
} from '#lib/types/Calendar.ts';

type DateOptions = Pick<CalendarGridOptions, 'weekStartsOn' | 'locale'>;

const DEFAULTS = { weekStartsOn: 1 as WeekStart, locale: de };

export const getMonthGrid = (
    month: Date,
    selected: Date = new Date(),
    options: CalendarGridOptions = {}
): CalendarWeek[] => {
    const { weekStartsOn, locale } = { ...DEFAULTS, ...options };
    const today = options.today ?? new Date();
    const first = startOfMonth(month);
    const gridStart = startOfWeek(first, { weekStartsOn, locale });

    const weeks: CalendarWeek[] = Array.from({ length: 6 }, (_, w) => {
        const days: CalendarDay[] = Array.from({ length: 7 }, (_, d) => {
            const date = addDays(gridStart, w * 7 + d);
            return {
                date,
                day: date.getDate(),
                inMonth: isSameMonth(date, first),
                isToday: isSameDay(date, today),
                isSelected: isSameDay(date, selected),
            };
        });
        return {
            weekNumber: getISOWeek(days[0].date),
            isSelected: isSameWeek(days[0].date, selected, { weekStartsOn, locale }),
            days,
        };
    });

    if (options.fixedRows === false) {
        // drop a last row that is entirely next month
        while (weeks.length > 4 && !weeks[weeks.length - 1].days.some((d) => d.inMonth)) {
            weeks.pop();
        }
    }
    return weeks;
};

export const getMonthsOfYear = (
    year: Date,
    selected: Date = new Date(),
    options: DateOptions & { style?: 'short' | 'long'; today?: Date } = {}
): CalendarMonth[] => {
    const { locale } = { ...DEFAULTS, ...options };
    const today = options.today ?? new Date();
    const pattern = options.style === 'long' ? 'MMMM' : 'MMM';

    return Array.from({ length: 12 }, (_, index) => {
        const date = new Date(year.getFullYear(), index, year.getDate());
        return {
            index,
            date,
            label: format(date, pattern, { locale }),
            isCurrent: isSameYear(today, year) && today.getMonth() === index,
            isSelected: isSameYear(selected, year) && selected.getMonth() === index,
        };
    });
};

/**
 *
 * Returns 12 years for a year-block for the date selector
 */
export const getYearBlockForDate = (
    date: Date,
    selected = new Date(),
    options: DateOptions & { style?: 'short' | 'long'; today?: Date } = {}
) => {
    const year = date.getFullYear();
    // We say a yearblock starts with a year that is divideable by 12, so 0 is the start of a yearblock
    let startDate = new Date(year - (year % 12), date.getMonth(), date.getDay());

    const { locale } = { ...DEFAULTS, ...options };
    const pattern = options.style === 'short' ? 'yy' : 'yyyy';

    return Array.from({ length: 12 }, (_, index) => {
        const yearBlockDate = new Date(
            startDate.getFullYear() + index,
            startDate.getMonth(),
            startDate.getDay()
        );
        return {
            index,
            date: yearBlockDate,
            label: format(yearBlockDate, pattern, { locale }),
            isCurrent: isSameYear(date, yearBlockDate),
            isSelected: isSameYear(selected, yearBlockDate),
        };
    });
};

export const getWeekDays = (date: Date, options: DateOptions = {}): Date[] => {
    const { weekStartsOn, locale } = { ...DEFAULTS, ...options };
    const start = startOfWeek(date, { weekStartsOn, locale });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};
