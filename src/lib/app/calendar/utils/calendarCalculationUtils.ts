import type { ICalItem } from '#lib/types/Calendar.types.ts';
import type {
    LayoutConfig,
    MonthLayout,
    NormalizedItem,
    PlacedSpanSegment,
    SpanLayout,
    SpanSegment,
    TimelineDay,
    TimelineItem,
    WeekLayout,
} from '../types/CalendarLayout.types';
import {
    addDays,
    addWeeks,
    differenceInCalendarDays,
    eachWeekOfInterval,
    startOfDay,
    startOfMonth,
    startOfWeek,
} from 'date-fns';

const DAYS_PER_WEEK = 7;
const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;
const WEEK_OPTIONS = { weekStartsOn: 1 } as const;

const DEFAULT_CONFIG: Required<LayoutConfig> = {
    hourHeightPx: 60,
    minItemHeightPx: 24,
    titleSafeHeightPx: 20,
    stackPeekPx: 8,
    maxPeekDepth: 3,
    defaultTaskDurationMinutes: 30,
    defaultEventDurationMinutes: 60,
};

/** Resolves start date, end date and all-day flag of an event or task */
const normalizeItem = (
    item: ICalItem,
    config: Required<LayoutConfig>
): NormalizedItem => {
    let startDate: Date;
    let endDate: Date;
    let isAllDay = item.isAllDay ?? false;

    if (item.type === 'event') {
        startDate = new Date(item.dtstart);
        endDate = item.dtend
            ? new Date(item.dtend)
            : new Date(
                  startDate.getTime() + config.defaultEventDurationMinutes * MS_PER_MINUTE
              );

        // Timed events lasting 24h or more are shown as all-day
        if (!item.isAllDay && endDate.getTime() - startDate.getTime() >= MS_PER_DAY) {
            isAllDay = true;
        }
    } else {
        const baseDate = item.dtstart ?? item.due;
        const defaultDurationMs = config.defaultTaskDurationMinutes * MS_PER_MINUTE;

        if (!baseDate) {
            startDate = new Date();
            endDate = new Date(startDate.getTime() + defaultDurationMs);
            isAllDay = true;
        } else {
            startDate = new Date(baseDate);
            const due = item.due ? new Date(item.due) : null;

            // Ensure endDate is strictly after startDate
            endDate =
                due && due.getTime() > startDate.getTime()
                    ? due
                    : new Date(startDate.getTime() + defaultDurationMs);
        }

        // Tasks at exactly 00:00:00 without an explicit isAllDay flag count as all-day
        if (
            item.isAllDay === undefined &&
            startDate.getHours() === 0 &&
            startDate.getMinutes() === 0 &&
            startDate.getSeconds() === 0 &&
            startDate.getMilliseconds() === 0
        ) {
            isAllDay = true;
        }
    }

    return { ...item, startDate, endDate, isAllDay };
};

/** Cuts items down to bars within the week starting at weekstart */
const toSpanSegments = (items: NormalizedItem[], weekStart: Date): SpanSegment[] => {
    const weekEnd = addDays(weekStart, DAYS_PER_WEEK);
    const clampDay = (n: number) => Math.min(Math.max(n, 0), DAYS_PER_WEEK - 1);
    const segments: SpanSegment[] = [];

    for (const item of items) {
        if (item.endDate <= weekStart || item.startDate >= weekEnd) continue;

        const lastInstant = new Date(
            Math.max(item.endDate.getTime() - 1, item.startDate.getTime())
        );

        segments.push({
            item,
            startDay: clampDay(differenceInCalendarDays(item.startDate, weekStart)),
            endDay: clampDay(differenceInCalendarDays(lastInstant, weekStart)),
        });
    }

    return segments;
};

/**
 * Assigns lanes so overlapping segments never share one. Longer segments that
 * start earlier come first, so they end up in the top lanes.
 */
const placeSpanSegments = (segments: SpanSegment[]): SpanLayout => {
    const sorted = [...segments].sort(
        (a, b) =>
            a.startDay - b.startDay ||
            b.endDay - b.startDay - (a.endDay - a.startDay) ||
            a.item.startDate.getTime() - b.item.startDate.getTime()
    );

    const laneEnds: number[] = [];
    const placed: PlacedSpanSegment[] = sorted.map((segment) => {
        let lane = laneEnds.findIndex((end) => end < segment.startDay);
        if (lane === -1) {
            lane = laneEnds.length;
            laneEnds.push(segment.endDay);
        } else {
            laneEnds[lane] = segment.endDay;
        }
        return { ...segment, lane };
    });

    const itemsPerDay = Array.from(
        { length: DAYS_PER_WEEK },
        (_, day) => placed.filter((s) => s.startDay <= day && day <= s.endDay).length
    );

    return { segments: placed, laneCount: laneEnds.length, itemsPerDay };
};

/** All-day layout for a single day of an already calculated week Lanes are recalculated to fit the day */
const allDayLayoutForDay = (week: WeekLayout, dayIndex: number): SpanLayout =>
    placeSpanSegments(
        week.allDay.segments.filter((s) => s.startDay <= dayIndex && dayIndex <= s.endDay)
    );

/** Positions all timed (non all-day) items that touch the given day */
const layoutTimelineDay = (
    date: Date,
    items: NormalizedItem[],
    config: Required<LayoutConfig>
): TimelineDay => {
    const {
        hourHeightPx,
        minItemHeightPx,
        titleSafeHeightPx,
        stackPeekPx,
        maxPeekDepth,
    } = config;

    const dayStart = startOfDay(date);
    const dayEnd = addDays(dayStart, 1);

    const timed: TimelineItem[] = [];

    // 1. Keep only timed items that touch this day
    for (const item of items) {
        if (item.isAllDay) continue;
        if (item.endDate <= dayStart || item.startDate >= dayEnd) continue;

        const visibleStart = item.startDate > dayStart ? item.startDate : dayStart;
        const visibleEnd = item.endDate < dayEnd ? item.endDate : dayEnd;

        timed.push({
            ...item,
            topPx:
                ((visibleStart.getTime() - dayStart.getTime()) / MS_PER_HOUR) *
                hourHeightPx,
            heightPx: Math.max(
                ((visibleEnd.getTime() - visibleStart.getTime()) / MS_PER_HOUR) *
                    hourHeightPx,
                minItemHeightPx
            ),
            leftPct: 0,
            widthPct: 100,
            column: 0,
            columnCount: 1,
            isStacked: false,
            peekPx: 0,
        });
    }

    const overlaps = (a: TimelineItem, b: TimelineItem) =>
        a.startDate < b.endDate && a.endDate > b.startDate;

    const titleCollides = (a: TimelineItem, b: TimelineItem) =>
        overlaps(a, b) && Math.abs(a.topPx - b.topPx) < titleSafeHeightPx;

    const horizontallyIntersect = (a: TimelineItem, b: TimelineItem) =>
        a.leftPct < b.leftPct + b.widthPct && a.leftPct + a.widthPct > b.leftPct;

    // 2. Sort by start time, then longest first
    timed.sort(
        (a, b) =>
            a.startDate.getTime() - b.startDate.getTime() ||
            b.endDate.getTime() - a.endDate.getTime()
    );

    // 3. Cluster by title collisions
    const clusters: TimelineItem[][] = [];
    for (const item of timed) {
        const cluster = clusters.find((c) =>
            c.some((other) => titleCollides(item, other))
        );
        if (cluster) cluster.push(item);
        else clusters.push([item]);
    }

    // 4. Assign columns and widths within each cluster
    for (const cluster of clusters) {
        const columns: TimelineItem[][] = [];

        for (const item of cluster) {
            let col = 0;
            while ((columns[col] ?? []).some((other) => titleCollides(item, other)))
                col++;
            (columns[col] ??= []).push(item);
            item.column = col;
        }

        const totalColumns = columns.length;

        for (const item of cluster) {
            let span = 1;
            for (let c = item.column + 1; c < totalColumns; c++) {
                if ((columns[c] ?? []).some((other) => titleCollides(item, other))) break;
                span++;
            }

            item.columnCount = totalColumns;
            item.widthPct = (span / totalColumns) * 100;
            item.leftPct = (item.column / totalColumns) * 100;
        }
    }

    // 5. Peek offsets for items stacked on top of earlier ones (right shift)
    for (const item of timed) {
        const behind = timed.filter(
            (other) =>
                other !== item &&
                other.startDate < item.startDate &&
                overlaps(item, other) &&
                horizontallyIntersect(item, other) &&
                other.column === 0
        );

        const depth = Math.min(behind.length, maxPeekDepth);
        item.peekPx = depth * stackPeekPx;
        item.isStacked = depth > 0;
    }

    return { date: dayStart, items: timed };
};

/** Converts raw API items for the week containing all-day header + timeline. */
const convertItemsForWeek = (
    date: Date,
    rawItems: ICalItem[],
    config?: LayoutConfig
): WeekLayout => {
    const weekStart = startOfWeek(date, WEEK_OPTIONS);
    const items = rawItems.map((item) => normalizeItem(item, DEFAULT_CONFIG));

    return {
        weekStart,
        days: Array.from({ length: DAYS_PER_WEEK }, (_, i) =>
            layoutTimelineDay(addDays(weekStart, i), items, DEFAULT_CONFIG)
        ),
        allDay: placeSpanSegments(
            toSpanSegments(
                items.filter((i) => i.isAllDay),
                weekStart
            )
        ),
    };
};

/**
 * Converts raw API items for the month view. No timelinem just rows
 */
const convertItemsForMonth = (date: Date, rawItems: ICalItem[]): MonthLayout => {
    const monthStart = startOfMonth(date);
    const items = rawItems.map((item) => normalizeItem(item, DEFAULT_CONFIG));

    const weekStarts = eachWeekOfInterval(
        {
            start: monthStart,
            end: addWeeks(startOfWeek(monthStart, WEEK_OPTIONS), 6),
        },
        WEEK_OPTIONS
    ).slice(0, 6);

    return {
        monthStart,
        weeks: weekStarts.map((weekStart) => ({
            weekStart,
            spans: placeSpanSegments(toSpanSegments(items, weekStart)),
        })),
    };
};

export const calendarCalculationUtil = {
    convertItemsForWeek,
    convertItemsForMonth,
    allDayLayoutForDay,
};
