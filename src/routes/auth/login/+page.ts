import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, params }) => {
    const action = url.searchParams.get('action') || '';

    return {
        action,
    };
};
