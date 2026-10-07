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
