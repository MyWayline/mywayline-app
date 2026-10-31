import type { ICalEvent, ICalItem, ICalTask } from '#lib/types/index.ts';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const getCurrentWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    return monday;
};

const shiftDate = (original: Date) => {
    const result = new Date(original);

    const diff = result.getTime() - new Date(2026, 7, 17).getTime();

    result.setTime(getCurrentWeekStart().getTime() + diff);

    return result;
};

const event = (
    uid: string,
    summary: string,
    color: string,
    start: Date,
    end: Date
): ICalEvent => ({
    type: 'event',
    uid,
    summary,
    color,
    dtstart: shiftDate(start),
    dtend: shiftDate(end),
    status: 'CONFIRMED',
});

const task = (
    uid: string,
    summary: string,
    due: Date,
    options: Partial<Omit<ICalTask, 'type' | 'uid' | 'summary' | 'due'>> = {}
): ICalTask => ({
    type: 'task',
    uid,
    summary,
    due: shiftDate(due),
    status: 'NEEDS-ACTION',
    ...options,
});

const generatedItems: ICalItem[] = [
    event(
        'event-team-standup',
        'Team standup',
        '#4F86F7',
        new Date(2026, 7, 16, 9, 0),
        new Date(2026, 7, 16, 9, 30)
    ),
    // Mon
    event(
        'event-team-standup',
        'Team standup',
        '#4F86F7',
        new Date(2026, 7, 17, 9, 0),
        new Date(2026, 7, 17, 9, 30)
    ),

    event(
        'event-product-design-review',
        'Product design review',
        '#9B6BFF',
        new Date(2026, 7, 17, 10, 0),
        new Date(2026, 7, 17, 11, 30)
    ),

    task('task-send-weekly-report', 'Send weekly report', new Date(2026, 7, 17, 16, 0), {
        priority: 5,
    }),

    // Tue
    event(
        'event-dentist',
        'Dentist',
        '#EF6C6C',
        new Date(2026, 7, 18, 8, 30),
        new Date(2026, 7, 18, 9, 30)
    ),

    event(
        'event-frontend-sync',
        'Frontend sync',
        '#22A06B',
        new Date(2026, 7, 18, 10, 0),
        new Date(2026, 7, 18, 11, 0)
    ),

    event(
        'event-project-planning',
        'Project planning',
        '#4F86F7',
        new Date(2026, 7, 18, 14, 0),
        new Date(2026, 7, 18, 15, 30)
    ),

    task('task-buy-groceries', 'Buy groceries', new Date(2026, 7, 18, 17, 30), {
        priority: 5,
    }),

    // Wed
    event(
        'event-coffee-with-alex',
        'Coffee with Alex',
        '#E56B9F',
        new Date(2026, 7, 19, 9, 0),
        new Date(2026, 7, 19, 10, 0)
    ),

    // Intentionally overlaps with Coffee with Alex
    event(
        'event-development',
        'Development',
        '#22A06B',
        new Date(2026, 7, 19, 9, 30),
        new Date(2026, 7, 19, 12, 0)
    ),

    event(
        'event-lunch-with-sarah',
        'Lunch with Sarah',
        '#F59E0B',
        new Date(2026, 7, 19, 12, 30),
        new Date(2026, 7, 19, 13, 30)
    ),

    event(
        'event-client-call',
        'Client call',
        '#9B6BFF',
        new Date(2026, 7, 19, 15, 30),
        new Date(2026, 7, 19, 16, 30)
    ),

    // Thur
    event(
        'event-gym',
        'Gym',
        '#22A06B',
        new Date(2026, 7, 20, 7, 30),
        new Date(2026, 7, 20, 8, 30)
    ),

    event(
        'event-weekly-planning',
        'Weekly planning',
        '#4F86F7',
        new Date(2026, 7, 20, 9, 0),
        new Date(2026, 7, 20, 10, 0)
    ),

    event(
        'event-design-workshop',
        'Design workshop',
        '#9B6BFF',
        new Date(2026, 7, 20, 11, 0),
        new Date(2026, 7, 20, 13, 0)
    ),

    task('task-book-train-tickets', 'Book train tickets', new Date(2026, 7, 20, 15, 0), {
        priority: 5,
    }),

    event(
        'event-dinner-with-friends',
        'Dinner with friends',
        '#E56B9F',
        new Date(2026, 7, 20, 18, 30),
        new Date(2026, 7, 20, 20, 30)
    ),

    // Fr
    event(
        'event-code-review',
        'Code review',
        '#22A06B',
        new Date(2026, 7, 21, 8, 30),
        new Date(2026, 7, 21, 9, 30)
    ),

    event(
        'event-team-meeting',
        'Team meeting',
        '#4F86F7',
        new Date(2026, 7, 21, 10, 0),
        new Date(2026, 7, 21, 11, 0)
    ),
    event(
        'event-team-meeting2',
        'Team meeting2',
        '#4F86F7',
        new Date(2026, 7, 21, 8, 30),
        new Date(2026, 7, 21, 11, 0)
    ),

    event(
        'event-team-meeting2',
        'Team meeting2',
        '#4F86F7',
        new Date(2026, 7, 19, 0, 0),
        new Date(2026, 7, 19, 24, 0)
    ),

    event(
        'event-product-sync',
        'Product sync',
        '#9B6BFF',
        new Date(2026, 7, 21, 10, 30),
        new Date(2026, 7, 21, 12, 0)
    ),

    event(
        'event-product-sync2',
        'Product sync2',
        '#9B6BFF',
        new Date(2026, 7, 21, 8, 30),
        new Date(2026, 7, 21, 13, 0)
    ),

    event(
        'event-product-sync3',
        'Product sync3',
        '#9B6BFF',
        new Date(2026, 7, 21, 12, 0),
        new Date(2026, 7, 21, 13, 0)
    ),
    task('task-submit-timesheet2', 'Submit timesheet2', new Date(2026, 7, 21, 11, 50), {
        priority: 1,
    }),
    task('task-submit-timesheet4', 'Submit timesheet4', new Date(2026, 7, 21, 12, 20), {
        priority: 1,
    }),
    task('task-submit-timesheet', 'Submit timesheet', new Date(2026, 7, 21, 12, 0), {
        priority: 1,
    }),

    event(
        'event-lunch-with-team',
        'Lunch with team',
        '#E56B9F',
        new Date(2026, 7, 21, 12, 30),
        new Date(2026, 7, 21, 13, 30)
    ),

    event(
        'event-focus-time',
        'Focus time',
        '#000',
        new Date(2026, 7, 21, 14, 0),
        new Date(2026, 7, 21, 16, 30)
    ),

    task('task-pick-up-package', 'Pick up package', new Date(2026, 7, 21, 17, 0), {
        priority: 5,
    }),

    // Sat
    event(
        'event-breakfast-with-family',
        'Breakfast with family',
        '#E56B9F',
        new Date(2026, 7, 22, 9, 30),
        new Date(2026, 7, 22, 11, 0)
    ),

    event(
        'event-personal-appointment',
        'Personal appointment',
        '#EF6C6C',
        new Date(2026, 7, 22, 12, 0),
        new Date(2026, 7, 22, 13, 0)
    ),

    task(
        'task-buy-birthday-present',
        'Buy birthday present',
        new Date(2026, 7, 22, 14, 0),
        {
            priority: 1,
        }
    ),

    event(
        'event-shopping',
        'Shopping',
        '#4F86F7',
        new Date(2026, 7, 22, 15, 0),
        new Date(2026, 7, 22, 16, 30)
    ),

    // Sun
    event(
        'event-weekend-trip',
        'Weekend trip',
        '#22A06B',
        new Date(2026, 7, 23, 9, 0),
        new Date(2026, 7, 23, 17, 0)
    ),

    task('task-prepare-for-monday', 'Prepare for Monday', new Date(2026, 7, 23, 18, 0), {
        priority: 5,
    }),

    event(
        'event-conference',
        'Conference',
        '#9B6BFF',
        new Date(2026, 7, 20, 9, 0),
        new Date(2026, 7, 22, 17, 0)
    ),

    event(
        'event-vacation',
        'Vacation',
        '#E56B9F',
        new Date(2026, 7, 21, 18, 0),
        new Date(2026, 7, 24, 10, 0)
    ),
    event(
        'event-fun',
        'Fun',
        '#E56B9F',
        new Date(2026, 7, 21, 18, 0),
        new Date(2026, 7, 23, 10, 0)
    ),

    task('task-review-prs', 'Review open pull requests', new Date(2026, 7, 20, 16, 0), {
        status: 'IN-PROCESS',
        percentComplete: 50,
        priority: 5,
        description: 'Review and approve outstanding pull requests.',
    }),

    task('task-update-roadmap', 'Update product roadmap', new Date(2026, 7, 21, 15, 0), {
        priority: 5,
    }),

    task('task-clean-inbox', 'Clean up inbox', new Date(2026, 7, 22, 11, 30), {
        priority: 9,
    }),

    task('task-backup-project', 'Back up project files', new Date(2026, 7, 23, 16, 0), {
        priority: 5,
    }),
];

let calendarItems = $state(generatedItems);

export const calendarDataStore = {
    get calendarItems() {
        return calendarItems;
    },
    getItemsForWeekOf(date: Date) {
        const rangeStart = startOfWeek(date, { weekStartsOn: 1 });
        const rangeEnd = endOfWeek(date, { weekStartsOn: 1 });
        return calendarItems.filter((item) => overlapsRange(item, rangeStart, rangeEnd));
    },
    getItemsForMonthOf(date: Date) {
        const rangeStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
        const rangeEnd = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
        return calendarItems.filter((item) => overlapsRange(item, rangeStart, rangeEnd));
    },
};

const overlapsRange = (item: ICalItem, rangeStart: Date, rangeEnd: Date) => {
    return calendarItems.filter((item) => {
        if (item.type === 'event') {
            const eventEnd = item.dtend as Date;

            return item.dtstart < rangeEnd && eventEnd > rangeStart;
        }

        if (item.type === 'task') {
            if (!item.due) return false;

            return item.due >= rangeStart && item.due < rangeEnd;
        }

        return false;
    });
};
