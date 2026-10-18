import { userStore } from '#lib/stores/userStore.svelte.ts';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import type { UserInfo } from '#lib/types/User.ts';

export const load: LayoutLoad = async () => {
    // If we get to this load, we are sure the user is logged in
    return { userInfo: userStore.userData as UserInfo };
};
