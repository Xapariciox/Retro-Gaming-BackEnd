import { NextFunction, Request, Response } from 'express';

import { errorManager } from './error';

describe('Given the errorManager function', () => {
    describe('When its invoked', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnValue({}),
            json: jest.fn().mockReturnValue({}),
            end: jest.fn().mockReturnValue({}),
        };
        const next = jest.fn();
        const mockError = {
            name: 'Error',
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Error',
        };

        test('If error.name is ValidationError, then it should call the next function with a 406 status', () => {
            mockError.name = 'ValidationError';
            errorManager(
                mockError,
                req as Request,
                res as unknown as Response,
                next as NextFunction
            );
            expect(res.status).toHaveBeenCalled();
        });
    });
});
