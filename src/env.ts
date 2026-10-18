import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
    GOOGLE_CLIENT_ID: {
        public: true,
    },
});
