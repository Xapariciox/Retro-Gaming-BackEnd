import { CustomError, HTTPError } from './error';

describe('Given the HTTPError', () => {
    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(
            426,
            'upgrade required',
            'please upgrade your version'
        );
    });
    test('should first', () => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toHaveProperty('statusCode', 426);
        expect(error).toHaveProperty('statusMessage', 'upgrade required');
        expect(error).toHaveProperty('message', 'please upgrade your version');
        expect(error).toHaveProperty('name', 'HTTPError');
    });
});
