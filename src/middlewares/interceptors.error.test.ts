import { NextFunction, Request, Response } from 'express';
import { UserI } from '../entities/user';
import { BasicRepo } from '../repository/repository-Interface';
import { UserRepository } from '../repository/user';
import { readToken } from '../services/auth';
import { ExtraRequest, logged } from './interceptors';
jest.mock('../services/auth');
describe('Given the logged interceptor', () => {
    let next: NextFunction;
    let res: Partial<Response>;
    const respository: BasicRepo<UserI> = UserRepository.getInstance();
    beforeEach(() => {
        next = jest.fn();
        res = {};
    });
    describe('When its invoked', () => {
        test('When the authString is empty, it should return an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce(false),
            };
            const res: Partial<Response> = {};
            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });

    test('Then if the readToken function reads the token and its not valid, then it should return an error', () => {
        (readToken as jest.Mock).mockImplementation(() => {
            throw new Error();
        });

        const req: Partial<Request> = {
            get: jest.fn().mockReturnValueOnce('Bearer token'),
        };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        logged(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });
});
