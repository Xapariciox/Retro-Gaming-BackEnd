import { HTTPError } from './error';

export const createHttpError = (error: Error) => {
    if (error.message === 'Not found') {
        const httpError = new HTTPError(404, 'Not found', error.message);
        return httpError;
    }

    if (error.message === 'Empty collection') {
        const httpError = new HTTPError(404, 'Not found', error.message);
        return httpError;
    }

    if (error.message === 'No data provided') {
        const httpError = new HTTPError(406, 'Not acceptable', error.message);
        return httpError;
    }

    const httpError = new HTTPError(503, 'Service unavailable', error.message);
    return httpError;
};
