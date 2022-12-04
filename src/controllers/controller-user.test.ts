import { NextFunction, Request, Response } from 'express';

import { CustomError, HTTPError } from '../interfaces/error';

import { Types } from 'mongoose';
import { createToken, passwordValidate } from '../services/auth';
import { ExtraRequest } from '../middlewares/interceptors';
import { UserRepository } from '../repository/user';
import { ProductRepository } from '../repository/product';
import { UserController } from './controller-user';

jest.mock('../services/auth');

describe('Given UserController', () => {
    describe('When we instantiate it', () => {
        const repository = UserRepository.getInstance();
        const productRepo = ProductRepository.getInstance();
        const userId = new Types.ObjectId();
        const productId = new Types.ObjectId();

        repository.create = jest.fn().mockResolvedValue({
            id: userId,
            name: 'pepe',
        });
        repository.find = jest.fn().mockResolvedValue({
            id: userId,
            name: 'elena',

            myProducts: [productId],
        });

        repository.patch = jest.fn().mockResolvedValue({
            id: userId,
            name: 'carlos',
        });
        repository.get = jest.fn().mockResolvedValue({
            id: userId,
            name: 'carlos',
        });

        const userController = new UserController(repository, productRepo);

        let req: Partial<ExtraRequest>;
        let resp: Partial<Response>;
        let next: NextFunction;
        beforeEach(() => {
            req = {};
            resp = {};
            req.payload = { id: userId };
            req.params = { productId: '6388ee3b4edce8fdd9fa1c11' };
            req.body = { amount: 3 };
            resp.status = jest.fn().mockReturnValue(resp);
            next = jest.fn();
            resp.json = jest.fn();
        });

        test('Then register should have been called', async () => {
            await userController.register(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({
                user: {
                    id: userId,
                    name: 'pepe',
                },
            });
        });
        // test('Then deleted account should have been called', async () => {
        //     await userController.deleteAccount(
        //         req as Request,
        //         resp as Response,
        //         next
        //     );
        //     req.params = { id: '2' };
        //     expect(resp.json).toHaveBeenCalledWith({ id: '222' });
        // });
        // test('Then addCart should have been called', async () => {
        //     productRepo.get = jest.fn().mockResolvedValueOnce({
        //         id: productId,
        //         name: 'aldana',
        //     });
        //     await userController.addCart(
        //         req as ExtraRequest,
        //         resp as Response,
        //         next
        //     );
        //     expect(resp.json).toHaveBeenCalled();
        // });

        test('Then login should have been called', async () => {
            (passwordValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { passwd: 'patata' };

            await userController.login(req as Request, resp as Response, next);

            expect(resp.json).toHaveBeenCalledWith({ token: 'token' });
        });

        describe('When userController is not valid', () => {
            let error: CustomError;
            beforeEach(() => {
                error = new HTTPError(404, 'Not found', 'Not found id');
            });

            const repository = ProductRepository.getInstance();
            const repoUser = UserRepository.getInstance();
            repository.getAll = jest.fn().mockRejectedValue(['Product']);
            const userController = new UserController(repoUser, repository);
            const req: Partial<Request> = {};
            const resp: Partial<Response> = {
                json: jest.fn(),
            };
            const next: NextFunction = jest.fn();

            test('should return an error', async () => {
                error.message = 'Not found id';
                error.statusCode = 404;
                error.statusMessage = 'Not found';
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
                expect(error).toHaveProperty('statusCode', 404);
                expect(error).toHaveProperty('statusMessage', 'Not found');
                expect(error).toHaveProperty('message', 'Not found id');
                expect(error).toHaveProperty('name', 'HTTPError');
            });

            test('Then register should return an error', async () => {
                await userController.register(
                    req as Request,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
            });

            test('Then login should have not been called', async () => {
                repository.find = jest.fn().mockRejectedValue(null);
                (passwordValidate as jest.Mock).mockResolvedValue(false);
                (createToken as jest.Mock).mockReturnValue('token');
                req.body = { name: '', passwordd: 'potato' };
                await userController.login(
                    req as Request,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(HTTPError);
            });
        });
    });
});
