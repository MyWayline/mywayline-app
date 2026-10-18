import {
    addDays,
    format,
    getISOWeek,
    isSameDay,
    isSameMonth,
    isSameWeek,
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
    year: number,
    selected: Date = new Date(),
    options: DateOptions & { style?: 'short' | 'long'; today?: Date } = {}
): CalendarMonth[] => {
    const { locale } = { ...DEFAULTS, ...options };
    const today = options.today ?? new Date();
    const pattern = options.style === 'long' ? 'MMMM' : 'MMM';

    return Array.from({ length: 12 }, (_, index) => {
        const date = new Date(year, index, 1);
        return {
            index,
            date,
            label: format(date, pattern, { locale }),
            isCurrent: today.getFullYear() === year && today.getMonth() === index,
            isSelected: selected.getFullYear() === year && selected.getMonth() === index,
        };
    });
};

export const getWeekDays = (date: Date, options: DateOptions = {}): Date[] => {
    const { weekStartsOn, locale } = { ...DEFAULTS, ...options };
    const start = startOfWeek(date, { weekStartsOn, locale });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};
