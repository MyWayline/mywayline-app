import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

const locales: Record<string, any> = {
    de: de,
    en: enUS,
};

const formatStrings = {
    de: {
        dayWeekday: "dd.MM ' | ' EEE",
        monthYear: 'MMMM yyyy',
        full: 'dd.MM.yyyy',
        weekDayMonthYear: 'EEE, d MMM yyyy',
        timeFormat: 'HH:mm',
        weekdayOnly: 'EEE',
        weekdaySmall: 'EEEEE',
    },
    en: {
        dayWeekday: "MM/dd ' | ' EEE",
        monthYear: 'MMMM yyyy',
        full: 'MM/dd/yyyy',
        weekDayMonthYear: 'EEE, MMM d yyyy',
        timeFormat: 'HH:mm',
        weekdayOnly: 'EEE',
        weekdaySmall: 'EEEEE',
    },
};

export const formatDate = (
    dateInput: Date,
    type:
        | 'dayWeekday'
        | 'monthYear'
        | 'full'
        | 'weekDayMonthYear'
        | 'timeFormat'
        | 'weekdayOnly'
        | 'weekdaySmall',
    lang: 'de' | 'en' = 'de'
): string => {
    const localeObj = locales[lang] || de;
    const pattern = formatStrings[lang]?.[type] || formatStrings.de[type];

    return format(dateInput, pattern, { locale: localeObj });
};
