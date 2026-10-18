import { api } from '#lib/api/api.ts';
import { client } from '#lib/api/generated/client.gen.js';
import { userStore } from '#lib/stores/userStore.svelte.ts';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

client.setConfig({
    fetch: tauriFetch,
});

client.interceptors.request.use(async (request) => {
    const token = userStore.accessToken;

    if (token) {
        request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
});

let refreshPromise: Promise<boolean> | null = null;

const refreshSession = async (): Promise<boolean> => {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const refreshToken = await userStore.getRefreshToken();

            if (!refreshToken) return false;

            const result = await api.auth.refreshToken({
                headers: { Authorization: refreshToken },
            });

            if (!result.success) return false;

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                result.data;

            if (!newAccessToken || !newRefreshToken) return false;

            await userStore.setSession(newAccessToken, newRefreshToken);

            return true;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
};

let excludedPaths = ['/auth/refresh', '/auth/login', '/auth/register'];
client.interceptors.response.use(async (response, request) => {
    if (response.status !== 401) return response;

    // Don't retry refresh, login, register endpoint itself -> infinite loop
    for (const path of excludedPaths) {
        if (new URL(request.url).pathname.includes(path)) {
            return response;
        }
    }

    const retryRequest = request.clone();

    const refreshed = await refreshSession();

    if (!refreshed) {
        // handle expired
        return response;
    }
    console.log('REFRESHED');
    const token = userStore.accessToken;

    if (!token) return response;

    retryRequest.headers.set('Authorization', `Bearer ${token}`);

    // Redo original request with the refreshed token
    return tauriFetch(retryRequest);
});
