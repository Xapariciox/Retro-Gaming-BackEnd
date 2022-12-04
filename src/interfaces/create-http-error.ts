import { HTTPError } from './error';

export const createHttpError = (error: Error) => {
    if ((error as Error).message === 'Not found') {
        const httpError = new HTTPError(
            404,
            'Not found',
            (error as Error).message
        );
        return httpError;
    }

    if ((error as Error).message === 'Empty collection') {
        const httpError = new HTTPError(
            404,
            'Not found',
            (error as Error).message
        );
        return httpError;
    }

    if ((error as Error).message === 'No data provided') {
        const httpError = new HTTPError(
            406,
            'Not acceptable',
            (error as Error).message
        );
        return httpError;
    }

    const httpError = new HTTPError(
        503,
        'Service unavailable',
        (error as Error).message
    );
    return httpError;
};
