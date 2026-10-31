import { createContext } from 'svelte';

type CalendarContext = {
    viewingDate: Date;
    selectedDate: Date;
    columnHourPxGap: number;
    todaysDate: Date;
    setSelectedDate: (newDate: Date) => void;
    setViewingDate: (newDate: Date) => void;
    navigateDate: (direction: number) => void;
};

export const [getCalendarContext, setCalendarContext] = createContext<CalendarContext>();
