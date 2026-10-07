import type { ICalItem } from '#lib/types/Calendar.ts';
import type {
    AllDayBar,
    AllDayLayout,
    CalendarEntry,
    DayLayout,
    LayoutConfig,
    PositionedEntry,
    UnpackedBar,
    WeekLayout,
} from '#lib/types/CalendarCalculations.ts';
import { differenceInCalendarDays } from 'date-fns';

const DAYS_PER_WEEK = 7;

/**
 * Assigns rows so overlapping bars never share a row. Longer bars that start
 * earlier come first, so they end up in the top rows.
 */
const buildAllDayLayout = (input: UnpackedBar[]): AllDayLayout => {
    const sorted = [...input].sort(
        (a, b) =>
            a.startDay - b.startDay ||
            b.endDay - b.startDay - (a.endDay - a.startDay) ||
            a.entry.startDate.getTime() - b.entry.startDate.getTime()
    );

    const rowEnds: number[] = [];
    const bars: AllDayBar[] = sorted.map((bar) => {
        let row = rowEnds.findIndex((end) => end < bar.startDay);
        if (row === -1) {
            row = rowEnds.length;
            rowEnds.push(bar.endDay);
        } else {
            rowEnds[row] = bar.endDay;
        }
        return { ...bar, row };
    });

    const hiddenPerDay = Array.from(
        { length: DAYS_PER_WEEK },
        (_, day) =>
            bars.filter((b) => b.row > 0 && b.startDay <= day && day <= b.endDay).length
    );

    return { bars, rowCount: rowEnds.length, hiddenPerDay };
};

/**
 * Generates the All-day layout for a single day
 * Only bars touching that thate are kept and rows are recalculated
 */
export const allDayLayoutForDay = (week: WeekLayout, dayIndex: number): AllDayLayout =>
    buildAllDayLayout(
        week.allDay.bars.filter((b) => b.startDay <= dayIndex && dayIndex <= b.endDay)
    );

const DEFAULT_CONFIG: Required<LayoutConfig> = {
    hourGapPx: 60,
    minEventHeightPx: 24,
    titleSafeHeightPx: 20,
    stackPeekPx: 8,
    maxPeekDepth: 3,
    defaultTaskDurationMinutes: 30,
    defaultEventDurationMinutes: 60,
};

export class CalendarLayoutCalculator {
    private config: Required<LayoutConfig>;

    constructor(config?: LayoutConfig) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /** Normalizes start date, end date and all-day flag of an event or task. */
    public normalizeItem(item: ICalItem): CalendarEntry {
        let startDate: Date;
        let endDate: Date;
        let isAllDay = item.isAllDay ?? false;

        if (item.type === 'event') {
            startDate = new Date(item.dtstart);

            endDate = item.dtend
                ? new Date(item.dtend)
                : new Date(
                      startDate.getTime() +
                          this.config.defaultEventDurationMinutes * 60_000
                  );

            const durationMs = endDate.getTime() - startDate.getTime();
            if (!item.isAllDay && durationMs >= 86_400_000) {
                isAllDay = true;
            }
        } else {
            const baseDate = item.dtstart ?? item.due;
            if (!baseDate) {
                startDate = new Date();
                endDate = new Date(
                    startDate.getTime() + this.config.defaultTaskDurationMinutes * 60_000
                );
                isAllDay = true;
            } else {
                startDate = new Date(item.dtstart ?? baseDate);
                const targetEndDate = item.due ? new Date(item.due) : null;

                // Ensure endDate is strictly after startDate
                endDate =
                    targetEndDate && targetEndDate.getTime() > startDate.getTime()
                        ? targetEndDate
                        : new Date(
                              startDate.getTime() +
                                  this.config.defaultTaskDurationMinutes * 60_000
                          );
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
    }

    /** Timed grid layout for a single day. */
    public layoutDay(date: Date, rawItems: ICalItem[]): DayLayout {
        return this.layoutNormalizedDay(
            date,
            rawItems.map((item) => this.normalizeItem(item))
        );
    }

    /**
     * Layout for 7 consecutive days
     */
    public layoutWeek(startDate: Date, rawItems: ICalItem[]): WeekLayout {
        const weekStart = new Date(startDate);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + DAYS_PER_WEEK);

        // Normalize once for the whole week
        const entries = rawItems.map((item) => this.normalizeItem(item));

        const days = Array.from({ length: DAYS_PER_WEEK }, (_, i) => {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            return this.layoutNormalizedDay(day, entries);
        });

        return {
            weekStart,
            days,
            allDay: this.generateAllDayLayoutForWeek(weekStart, weekEnd, entries),
        };
    }

    // Creates the AllDayLayout for a week
    private generateAllDayLayoutForWeek(
        weekStart: Date,
        weekEnd: Date,
        entries: CalendarEntry[]
    ): AllDayLayout {
        const clampDay = (n: number) => Math.min(Math.max(n, 0), DAYS_PER_WEEK - 1);
        const bars: UnpackedBar[] = [];

        for (const entry of entries) {
            if (!entry.isAllDay) continue;
            if (entry.endDate <= weekStart || entry.startDate >= weekEnd) continue;

            // End is exclusive (an all-day event ending at 00:00 doesn't cover that day)
            const lastInstant = new Date(
                Math.max(entry.endDate.getTime() - 1, entry.startDate.getTime())
            );

            bars.push({
                entry,
                startDay: clampDay(differenceInCalendarDays(entry.startDate, weekStart)),
                endDay: clampDay(differenceInCalendarDays(lastInstant, weekStart)),
            });
        }

        return buildAllDayLayout(bars);
    }

    // Calculates the Layout for a item within a day, if it isn't a All-day item
    private layoutNormalizedDay(date: Date, entries: CalendarEntry[]): DayLayout {
        const {
            hourGapPx,
            minEventHeightPx,
            titleSafeHeightPx,
            stackPeekPx,
            maxPeekDepth,
        } = this.config;

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const timedEntries: PositionedEntry[] = [];

        // 1. Keep only timed entries that touch this day
        for (const entry of entries) {
            if (entry.isAllDay) continue;
            if (entry.endDate <= dayStart || entry.startDate >= dayEnd) continue;

            const visibleStart = entry.startDate > dayStart ? entry.startDate : dayStart;
            const visibleEnd = entry.endDate < dayEnd ? entry.endDate : dayEnd;

            const top =
                ((visibleStart.getTime() - dayStart.getTime()) / 3_600_000) * hourGapPx;
            const height = Math.max(
                ((visibleEnd.getTime() - visibleStart.getTime()) / 3_600_000) * hourGapPx,
                minEventHeightPx
            );

            timedEntries.push({
                ...entry,
                top,
                height,
                left: 0,
                width: 100,
                column: 0,
                columnCount: 1,
                isStacked: false,
                peekPx: 0,
            });
        }

        const overlaps = (a: PositionedEntry, b: PositionedEntry) =>
            a.startDate < b.endDate && a.endDate > b.startDate;

        const titleCollides = (a: PositionedEntry, b: PositionedEntry) =>
            overlaps(a, b) && Math.abs(a.top - b.top) < titleSafeHeightPx;

        const rangesIntersect = (
            a: { left: number; width: number },
            b: { left: number; width: number }
        ) => a.left < b.left + b.width && a.left + a.width > b.left;

        // 2. Sort by start time, then longest first
        timedEntries.sort((a, b) => {
            const startDiff = a.startDate.getTime() - b.startDate.getTime();
            if (startDiff !== 0) return startDiff;
            return b.endDate.getTime() - a.endDate.getTime();
        });

        // 3. Cluster by title collisions
        const groups: PositionedEntry[][] = [];
        for (const entry of timedEntries) {
            const group = groups.find((g) =>
                g.some((other) => titleCollides(entry, other))
            );
            if (group) group.push(entry);
            else groups.push([entry]);
        }

        // 4. Assign columns and widths within each cluster
        for (const group of groups) {
            const columns: PositionedEntry[][] = [];

            for (const entry of group) {
                let col = 0;
                while (
                    (columns[col] ?? []).some((other) => titleCollides(entry, other))
                ) {
                    col++;
                }
                (columns[col] ??= []).push(entry);
                entry.column = col;
            }

            const totalColumns = columns.length;

            for (const entry of group) {
                let span = 1;
                for (let c = entry.column + 1; c < totalColumns; c++) {
                    const blocked = (columns[c] ?? []).some((other) =>
                        titleCollides(entry, other)
                    );
                    if (blocked) break;
                    span++;
                }

                entry.columnCount = totalColumns;
                entry.width = (span / totalColumns) * 100;
                entry.left = (entry.column / totalColumns) * 100;
            }
        }

        // 5. Peek offsets for entries stacked on top of earlier ones (right shift)
        for (const entry of timedEntries) {
            const stackedBehind = timedEntries.filter(
                (other) =>
                    other !== entry &&
                    other.startDate < entry.startDate &&
                    overlaps(entry, other) &&
                    rangesIntersect(entry, other) &&
                    other.column === 0
            );

            const depth = Math.min(stackedBehind.length, maxPeekDepth);
            entry.peekPx = depth * stackPeekPx;
            entry.isStacked = depth > 0;
        }

        return { date: dayStart, timedEntries };
    }
}
