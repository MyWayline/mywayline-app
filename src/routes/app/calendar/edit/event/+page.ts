import { calendarDataStore } from '#lib/app/calendar/stores/calendarDataStore.svelte.ts';
import type { PageLoad } from '../../../../auth/login/$types';

export const load: PageLoad = async ({ url, params }) => {
    const itemId = url.searchParams.get('id');

    if (!itemId) {
        return;
    }

    const eventToEdit = calendarDataStore.getItemById(itemId);

    if (eventToEdit.type !== 'event') return;

    return {
        eventToEdit: eventToEdit,
    };
};
