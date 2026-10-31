import { UserCalendarMode } from '#lib/types/UserSettings.types.ts';

let calendarMode = $state<UserCalendarMode>(UserCalendarMode.WEEK);

export const userSettingsStore = {
    get calendarMode() {
        return calendarMode;
    },
    setCalendarMode(newMode: UserCalendarMode) {
        calendarMode = newMode;
    },
    async init() {
        // Get saved settings
    },
};
