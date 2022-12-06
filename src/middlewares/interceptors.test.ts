import { NextFunction, Response } from 'express';
import { UserI } from '../entities/user';
import { BasicRepo } from '../repository/repository-Interface';
import { UserRepository } from '../repository/user';
import { ExtraRequest, logged } from './interceptors';

describe('Given the logged interceptor', () => {
    let next: NextFunction;
    let res: Partial<Response>;
    UserRepository.getInstance();
    beforeEach(() => {
        next = jest.fn();
        res = {};
    });
    describe('When its invoked', () => {
        test('Then  if verifyToken() reads a correct token, it should return the payload', () => {
            const req: Partial<ExtraRequest> = {
                get: jest
                    .fn()
                    .mockReturnValueOnce(
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGE1NTA5ODkyNGQ1MDMzZWFiNWQyNiIsIm5hbWUiOiJhbG9uc28iLCJlbWFpbCI6InBydWViYWRlbGV0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCQyZ0FmQ2c5R29HZ1JIakF1MjZpZGRlR2tqUmdMM3V4Z2UwZGpWWkpYUzFqWHU1QTZwbnY0cSIsImlhdCI6MTY3MDMyMjA4Nn0.4XcxrJeWU6jFIXBuyef2eeY0W77tLzCyYeJG2mNf9Cg'
                    ),
            };

            logged(req as ExtraRequest, res as Response, next);

            expect(req.payload).toStrictEqual({
                id: '638a55098924d5033eab5d26',
                name: 'alonso',
                email: 'pruebadelete@gmail.com',
                password:
                    '$2a$10$2gAfCg9GoGgRHjAu26iddeGkjRgL3uxge0djVZJXS1jXu5A6pnv4q',
                iat: 1670322086,
            });
        });
    });
});
