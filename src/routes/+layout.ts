import { userStore } from '#lib/stores/userStore.svelte.ts';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = ({ url }) => {
    const path = url.pathname;

    //     if (!userStore.isLoggedIn && path.startsWith('/app')) {
    //         redirect(307, '/auth');
    //     }
    //
    //     if (userStore.isLoggedIn && path === '/') {
    //         redirect(307, '/app/home');
    //     } else if (!userStore.isLoggedIn && path === '/') {
    //         redirect(307, '/auth');
    //     }
    //
    //     if (userStore.isLoggedIn && path.includes('/auth')) {
    //         redirect(307, '/app/home');
    //     }
};
