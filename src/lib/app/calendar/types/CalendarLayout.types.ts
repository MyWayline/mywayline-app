import type { ICalItem } from '#lib/shared/types/Calendar.types.ts';

export interface LayoutConfig {
    hourHeightPx?: number;
    minItemHeightPx?: number;
    titleSafeHeightPx?: number;
    stackPeekPx?: number;
    maxPeekDepth?: number;
    defaultTaskDurationMinutes?: number;
    defaultEventDurationMinutes?: number;
}

export type NormalizedItem = ICalItem & {
    startDate: Date;
    endDate: Date;
    isAllDay: boolean;
};

/** Span Row Layouts (Alldayheader, month view rows) */
export interface SpanSegment {
    item: NormalizedItem;
    startDay: number;
    endDay: number;
}

export interface PlacedSpanSegment extends SpanSegment {
    lane: number;
}

export interface SpanLayout {
    segments: PlacedSpanSegment[];
    laneCount: number;
    itemsPerDay: number[];
}

/* Timline/Column View */

export type TimelineItem = NormalizedItem & {
    topPx: number;
    heightPx: number;
    leftPct: number;
    widthPct: number;
    column: number;
    columnCount: number;
    isStacked: boolean;
    peekPx: number;
};

export interface TimelineDay {
    date: Date;
    items: TimelineItem[];
}

export interface WeekLayout {
    weekStart: Date;
    days: TimelineDay[];
    allDay: SpanLayout;
}

export interface MonthWeekRow {
    weekStart: Date;
    spans: SpanLayout;
}

export interface MonthLayout {
    monthStart: Date;
    weeks: MonthWeekRow[];
}

export type ColumnRangeSelection = { dayKey: number; start: number; end: number };
