import { userStore } from '#lib/stores/userStore.svelte.ts';
import { redirect } from '@sveltejs/kit';
import type { ClientInit } from '@sveltejs/kit/hooks';
import '#lib/config/hey-api-config.js';
import { goto } from '$app/navigation';

export const init: ClientInit = async () => {
    await userStore.init();
};
