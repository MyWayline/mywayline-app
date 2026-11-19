import { UserCalendarMode } from '#lib/shared/types/UserSettings.types.ts';
import { locale } from '@tauri-apps/plugin-os';
import { setDefaultOptions, type Locale } from 'date-fns';

let calendarMode = $state<UserCalendarMode>(UserCalendarMode.WEEK);
let dateLocale = $state<Locale>();

export const userSettingsStore = {
    get calendarMode() {
        return calendarMode;
    },
    get dateLocale() {
        return dateLocale;
    },
    setCalendarMode(newMode: UserCalendarMode) {
        calendarMode = newMode;
    },
    async init() {
        await getInitialOSLanguage();
    },
};

const getInitialOSLanguage = async () => {
    const locales = await import('date-fns/locale');

    try {
        const osLocale = (await locale()) || navigator.language || 'en-US';
        const language = new Intl.Locale(osLocale).language.toLowerCase();
        const tag = new Intl.Locale(osLocale).baseName.toLowerCase();

        const allLocales = Object.values(locales);

        const matchedLocale =
            allLocales.find((item) => item.code.toLowerCase() === tag) ??
            allLocales.find(
                (item) => item.code.split('-')[0].toLowerCase() === language
            ) ??
            locales.enUS;

        dateLocale = matchedLocale;
        setDefaultOptions({ locale: matchedLocale });
    } catch {
        // Fallback
        dateLocale = locales.deAT;
        setDefaultOptions({ locale: locales.deAT });
    }
};
