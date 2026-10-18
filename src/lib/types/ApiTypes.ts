export type ApiError = {
    message: string;
    status?: number;
};

export type ApiResult<T> =
    { success: true; data: T } | { success: false; error: ApiError };

export type ApiErrorPayload = {
    detail?: string;
    title?: string;
    message?: string;
    status?: number;
};

export const isApiErrorPayload = (value: unknown): value is ApiErrorPayload => {
    if (typeof value !== 'object' || value === null) return false;

    const payload = value as Record<string, unknown>;
    const hasKnownField = ['detail', 'title', 'message', 'status'].some(
        (key) => key in payload
    );

    return (
        hasKnownField &&
        (payload.detail === undefined || typeof payload.detail === 'string') &&
        (payload.title === undefined || typeof payload.title === 'string') &&
        (payload.message === undefined || typeof payload.message === 'string') &&
        (payload.status === undefined || typeof payload.status === 'number')
    );
};
