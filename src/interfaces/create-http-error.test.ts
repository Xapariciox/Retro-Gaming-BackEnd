import { createHttpError } from './create-http-error';

describe('Given the createHttpError function', () => {
    describe('When its invoked', () => {
        test('Then when the error passed to the function has a "Not found" message it should return an http error with a statusMessage = "Not Found"', () => {
            const mockError = new Error('Not found');
            const result = createHttpError(mockError);
            expect(result.statusMessage.toString()).toEqual('Not found');
            expect(result.statusCode).toEqual(404);
        });

        test('Then when the error passed to the function has a standard message it should return an http error with a statusMessage = "Service unavailable"', () => {
            const mockError = new Error('Service unavailable');
            const result = createHttpError(mockError);
            expect(result.statusMessage.toString()).toEqual(
                'Service unavailable'
            );
        });

        test('Then when the error passed to the function has a standard message it should return an http error with a statusMessage = "Empty collection"', () => {
            const mockError = new Error('Empty collection');
            const result = createHttpError(mockError);
            expect(result.statusMessage.toString()).toEqual('Not found');
        });

        test('Then when the error passed to the function has a standard message it should return an http error with a statusMessage = "No data provided"', () => {
            const mockError = new Error('No data provided');
            const result = createHttpError(mockError);
            expect(result.statusMessage.toString()).toEqual('Not acceptable');
        });
    });

    test('Then when the error passed to the function has a standard message it should return an http error with a statusMessage = "Wrong credentials"', () => {
        const mockError = new Error('Wrong credentials');
        const result = createHttpError(mockError);
        expect(result.statusMessage.toString()).toEqual('Service unavailable');
    });
});
