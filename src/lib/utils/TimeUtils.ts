export type HourFormat = '12h' | '24h';

export function formatHour(hour: number, formatType: HourFormat = '24h'): string {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);

    if (formatType === '12h') {
        return new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: true }).format(
            date
        );
    }

    return hour.toString().padStart(2, '0') + ':00';
}
