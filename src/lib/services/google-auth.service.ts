import { signIn, signOut } from '@choochmeque/tauri-plugin-google-auth-api';
import { GOOGLE_CLIENT_ID } from '$app/env/public';

export const GoogleAuthService = {
    async linkGoogleCalendarOnly() {
        try {
            const googleRes = await signIn({
                clientId: GOOGLE_CLIENT_ID,
                accessType: 'offline',
                scopes: [
                    'https://www.googleapis.com/auth/calendar.events',
                    'https://www.googleapis.com/auth/calendar.readonly',
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
