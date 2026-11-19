import { Frequency, RRule, Weekday } from 'rrule';
import type { RecurrenceFrequency } from '../types/CalendarRecurrence.types';

const RRULE_DAYS = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];

export const CalendarFrequencyUtil = {
    inputsToRRule(
        frequency: RecurrenceFrequency,
        weekNumber: string,
        weekDays: string[]
    ) {
        if (frequency === 'none') return null;

        const options: Partial<ConstructorParameters<typeof RRule>[0]> = {
            interval: 1,
        };

        switch (frequency) {
            case 'daily':
                options.freq = Frequency.DAILY;
                break;
            case 'weekly':
                options.freq = Frequency.WEEKLY;
                options.interval = parseInt(weekNumber, 10) || 1;

                if (weekDays.length > 0) {
                    options.byweekday = weekDays
                        .map((d) => RRULE_DAYS[parseInt(d, 10)])
                        .filter((day): day is Weekday => !!day);
                }
                break;
            case 'monthly':
                options.freq = Frequency.MONTHLY;
                break;
            case 'yearly':
                options.freq = Frequency.YEARLY;
                break;
        }

        return new RRule(options);
    },
    stringToInputs(inputString: string): {
        frequency: RecurrenceFrequency;
        weekNumber: string;
        weekDays: string[];
    } {
        if (!inputString || inputString.trim() === '') {
            return {
                frequency: 'none',
                weekNumber: '1',
                weekDays: [],
            };
        }

        const rule = RRule.fromString(inputString);

        const freq = rule.options.freq;

        let selectedFreq: RecurrenceFrequency = 'none';
        let selectedDays: string[] = [];
        let selectedWeekNumber: string = '1';

        if (freq === Frequency.DAILY) {
            selectedFreq = 'daily';
        } else if (freq === Frequency.WEEKLY) {
            selectedFreq = 'weekly';
            selectedWeekNumber = (rule.options.interval ?? 1).toString();

            if (rule.options.byweekday && rule.options.byweekday.length > 0) {
                selectedDays = rule.options.byweekday.map((day) => {
                    const rruleDayIndex = day;
                    const jsDayIndex = (rruleDayIndex + 1) % 7;
                    return jsDayIndex.toString();
                });
            }
        } else if (freq === Frequency.MONTHLY) {
            selectedFreq = 'monthly';
        } else if (freq === Frequency.YEARLY) {
            selectedFreq = 'yearly';
        }

        return {
            frequency: selectedFreq,
            weekDays: selectedDays,
            weekNumber: selectedWeekNumber,
        };
    },
};
