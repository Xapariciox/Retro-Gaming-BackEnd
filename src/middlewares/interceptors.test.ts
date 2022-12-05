import { NextFunction, Request, Response } from 'express';
import { createHttpError } from '../interfaces/create-http-error.js';
import { ExtraRequest, logged } from './interceptors.js';

describe('Given the logged interceptor', () => {
    describe('When its invoked', () => {
        test('When the authString is empty, it should return an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce(false),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Por favor haz loggin'))
            );
        });
    });
});
