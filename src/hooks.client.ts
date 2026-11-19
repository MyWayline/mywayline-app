import { userStore } from '#lib/shared/stores/userStore.svelte.ts';
import type { ClientInit } from '@sveltejs/kit/hooks';
import '#lib/config/hey-api-config.js';
import { goto } from '$app/navigation';
import { userSettingsStore } from '#lib/shared/stores/userSettingStore.svelte.ts';

export const init: ClientInit = async () => {
    await userStore.init();
    await userSettingsStore.init();
};
