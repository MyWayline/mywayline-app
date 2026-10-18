import { api } from '#lib/api/api.ts';
import { setItem, getItem, deleteItem } from 'tauri-plugin-secure-keystore';
import { type UserInfo } from '#lib/types/User.ts';
import { goto } from '$app/navigation';

let accessToken: string | null = $state(null);
let isLoggedIn = $state(false);
let userData = $state<UserInfo | null>(null);

export const userStore = {
    get accessToken() {
        return accessToken;
    },
    get isLoggedIn() {
        return isLoggedIn;
    },
    get userData() {
        return userData;
    },
    async getRefreshToken(): Promise<string | null> {
        return await getItem('refresh_token');
    },
    async setSession(newAccessToken: string, refreshToken: string) {
        accessToken = newAccessToken;
        await setItem('refresh_token', refreshToken);

        await userStore.init();
    },
    async logOut() {
        await deleteItem('refresh_token');
        accessToken = null;
        userData = null;
        isLoggedIn = false;

        goto('/auth', { replace: true });
    },
    async init() {
        // Tries to get user details on first launch, since we have no accessToken, it tries to refresh in the background.  If that doesn't work,
        // we will get a error, set loggedIn to false. Hook will redirect to login
        const userDetailsRes = await api.user.getDetails();
        if (!userDetailsRes.success) {
            isLoggedIn = false;
            return false;
        }
        const data = userDetailsRes.data;
        userData = { username: data.username as string, email: data.email as string };
        isLoggedIn = true;
        return true;
    },
};
