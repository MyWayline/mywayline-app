import type { ApiResult } from '#lib/types/ApiTypes.ts';
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshToken,
    getUserDetails,
} from './generated/sdk.gen';

const apiCall = async <T>(
    request: () => Promise<{
        data?: T;
        error?: unknown;
        response?: Response;
    }>
): Promise<ApiResult<T>> => {
    try {
        const result = await request();

        if (result.error != null) {
            console.log(result);
            const error = result.error as {
                detail?: string;
                title?: string;
                message?: string;
                status?: number;
            };

            return {
                success: false,
                error: {
                    message:
                        error.detail ?? error.title ?? error.message ?? 'Request failed',
                    status: error.status ?? result.response?.status,
                },
            };
        }

        if (result.data == null) {
            return {
                success: false,
                error: { message: 'No response data' },
            };
        }

        return { success: true, data: result.data };
    } catch {
        return {
            success: false,
            error: { message: 'Network error' },
        };
    }
};

type SdkResponse<T> = {
    data?: T;
    error?: unknown;
    response?: Response;
};

const withErrorHandling =
    <TArgs extends unknown[], TData>(
        fn: (...args: TArgs) => Promise<SdkResponse<TData>>
    ) =>
    (...args: TArgs): Promise<ApiResult<TData>> =>
        apiCall<TData>(() => fn(...args));

export const api = {
    auth: {
        login: withErrorHandling(loginUser),
        logout: withErrorHandling(logoutUser),
        register: withErrorHandling(registerUser),
        refreshToken: withErrorHandling(refreshToken),
    },
    user: {
        getDetails: withErrorHandling(getUserDetails),
    },
};
