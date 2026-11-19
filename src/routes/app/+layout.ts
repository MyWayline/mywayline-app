import { userStore } from '#lib/shared/stores/userStore.svelte.ts';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    const userInfo = userStore.userData;
    // if (!userInfo) {
    //     redirect(307, '/auth/login');
    // }

    return { userInfo };
};
