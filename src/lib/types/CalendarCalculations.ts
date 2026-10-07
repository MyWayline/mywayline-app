import type { ICalItem } from './Calendar';

export type CalendarEntry = ICalItem & {
    startDate: Date;
    endDate: Date;
    isAllDay: boolean;
};

export type EntryPosition = {
    top: number;
    height: number;
    left: number;
    width: number;
    column: number;
    columnCount: number;
    isStacked: boolean;
    peekPx: number;
};

export type PositionedEntry = CalendarEntry & EntryPosition;

export type LayoutConfig = {
    hourGapPx?: number;
    minEventHeightPx?: number;
    titleSafeHeightPx?: number;
    stackPeekPx?: number;
    maxPeekDepth?: number;
    defaultTaskDurationMinutes?: number;
    defaultEventDurationMinutes?: number;
};

export type DayLayout = {
    date: Date;
    timedEntries: PositionedEntry[];
};

export type AllDayBar = {
    entry: CalendarEntry;
    startDay: number;
    endDay: number;
    row: number;
};

export type AllDayLayout = {
    bars: AllDayBar[];
    rowCount: number;
    hiddenPerDay: number[];
};

export type WeekLayout = {
    weekStart: Date;
    days: DayLayout[];
    allDay: AllDayLayout;
};

export type UnpackedBar = Omit<AllDayBar, 'row'>;
