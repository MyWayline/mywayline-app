import { createContext } from 'svelte';
import type { ColumnRangeSelection } from './types/CalendarLayout.types';

type CalendarContext = {
    viewingDate: Date;
    selectedDate: Date;
    columnHourPxGap: number;
    todaysDate: Date;
    setSelectedDate: (newDate: Date) => void;
    setViewingDate: (newDate: Date) => void;
    navigateDate: (direction: number) => void;
    setColumnRangeSelection: (data: ColumnRangeSelection | null) => void;
    columnRangeSelection: ColumnRangeSelection | null;
    setSelectedItemId: (value: string) => void;
};

export const [getCalendarContext, setCalendarContext] = createContext<CalendarContext>();
