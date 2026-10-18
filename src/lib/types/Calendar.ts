export type ICalEvent = {
    type: 'event';
    uid: string;
    summary: string;
    dtstart: Date;
    dtend?: Date;
    duration?: string;
    description?: string;
    location?: string;
    color?: string;
    status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
    isAllDay?: boolean;
};

export type ICalTask = {
    type: 'task';
    uid: string;
    color?: string;
    summary: string;
    due?: Date;
    dtstart?: Date;
    status?: 'NEEDS-ACTION' | 'IN-PROCESS' | 'COMPLETED' | 'CANCELLED';
    completed?: Date;
    percentComplete?: number;
    priority?: 0 | 1 | 5 | 9;
    description?: string;
    isAllDay?: boolean;
};

export type ICalItem = ICalEvent | ICalTask;
export type CalendarMode = 'week' | 'day' | 'month';

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CalendarGridOptions = {
    weekStartsOn?: WeekStart;
    locale?: import('date-fns/locale').Locale;
    fixedRows?: boolean;
    today?: Date;
};

export type CalendarDay = {
    date: Date;
    day: number;
    inMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
};

export type CalendarWeek = {
    weekNumber: number;
    isSelected: boolean;
    days: CalendarDay[];
};

export type CalendarMonth = {
    index: number;
    date: Date;
    label: string;
    isCurrent: boolean;
    isSelected: boolean;
};
