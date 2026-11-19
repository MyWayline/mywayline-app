import { signIn, signOut } from '@choochmeque/tauri-plugin-google-auth-api';
import { GOOGLE_CLIENT_ID } from '$app/env/public';
import { api } from '#lib/api/api.ts';
import { userStore } from '#lib/shared/stores/userStore.svelte.ts';

export const googleAuthService = {
    async signInWithGoogleAccount() {
        try {
            const response = await signIn({
                clientId: GOOGLE_CLIENT_ID,
                scopes: ['openid', 'email', 'profile'],
            });

            let idToken = response.idToken;

            if (!idToken) {
                return { success: false, error: 'Authentication failed' };
            }

            let apiResponse = await api.auth.loginGoogle({ body: { idToken: idToken } });

            if (apiResponse.success) {
                let accessToken = apiResponse.data.accessToken;
                let refreshToken = apiResponse.data.refreshToken;
                if (!refreshToken || !accessToken) {
                    return { success: false, error: 'Authentication failed' };
                }

                await userStore.setSession(accessToken, refreshToken);

                return { success: true };
            }
        } catch (error) {
            return { success: false, error: 'Authentication failed' };
        }
    },
    async linkGoogleCalendarOnly() {
        try {
            const googleRes = await signIn({
                clientId: GOOGLE_CLIENT_ID,
                accessType: 'offline',
                scopes: [
                    'https://www.googleapis.com/auth/calendar.events',
                    'https://www.googleapis.com/auth/calendar',
                ],
            });

            return { success: true, res: googleRes };
        } catch (error) {
            return { success: false, error };
        }
    },

    async unlinkGoogleCalendar() {
        try {
            await signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    },
};
