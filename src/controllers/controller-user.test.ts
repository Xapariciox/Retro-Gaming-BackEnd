import { NextFunction, Response } from 'express';

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
            email: 'sss',
        });

        repository.patch = jest.fn().mockResolvedValue({
            id: userId,
            name: 'carlos',
        });
        repository.getForMethods = jest.fn().mockResolvedValue({
            id: userId,
            name: 'carlos',
        });
        repository.delete = jest.fn().mockResolvedValue({});
        repository.get = jest.fn().mockResolvedValue({
            id: userId,
            name: 'pepe',
        });

        const userController = new UserController(repository, productRepo);

        let req: Partial<ExtraRequest>;
        let resp: Partial<Response>;
        let next: NextFunction;
        beforeEach(() => {
            req = {};
            resp = {};
            req.payload = { id: userId };
            req.payload = { product: '6388ee3b4edce8fdd9fa1c11' };
            req.body = { id: '638dbf0228fc47a26a8055d7' };
            resp.status = jest.fn().mockReturnValue(resp);
            next = jest.fn();
            resp.json = jest.fn();
        });

        test('Then register should have been called', async () => {
            await userController.register(
                req as ExtraRequest,
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
        test('Then  GET should have been called', async () => {
            req.params = { id: '638901f4887798b01d443ed2' };
            await userController.get(
                req as ExtraRequest,
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
        test('Then delete should have been called', async () => {
            req.payload = { token: '638901f4887798b01d443ed2' };

            await userController.deleteAccount(
                req as ExtraRequest,
                resp as Response,
                next
            );

            expect(resp.json).toHaveBeenCalledWith({ id: {} });
        });
        test('Then delete should have been called', async () => {
            req.params = { token: '638901f4887798b01d443ed2' };

            await userController.deleteAccount(
                req as ExtraRequest,
                resp as Response,
                next
            );

            expect(resp.json).toHaveBeenCalledWith({ id: {} });
        });
        test('Then deleteFavorite should have been called', async () => {
            req.payload = { id: '638901f4887798b01d443ed2' };
            req.body = { id: '638901f4887798b01d443ed2' };

            repository.getForMethods = jest.fn().mockResolvedValue({
                _id: '638901f4887798b01d443ed2',
                favorites: ['638901f4887798b01d443ed2'],
            });

            await userController.deleteFavorites(
                req as ExtraRequest,
                resp as Response,
                next
            );

            expect(resp.json).toHaveBeenCalled();
        });

        test('Then login should have been called', async () => {
            (passwordValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { email: 'sdssd', password: 'dfssds' };

            await userController.login(
                req as ExtraRequest,
                resp as Response,
                next
            );

            expect(resp.json).toHaveBeenCalledWith({
                token: 'token',
                user: {
                    id: userId,
                    name: 'elena',
                    email: 'sss',
                },
            });
        });
        test('Then login should have been called but the password is invalid', async () => {
            (passwordValidate as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { email: 'sdssd', password: 'dfssds' };
            const error = new Error('user or password invalid');
            await userController.login(
                req as ExtraRequest,
                resp as Response,
                next
            );

            expect(error).toBeInstanceOf(Error);
        });
        test('Then login should have been called but the password is invalid', async () => {
            repository.find = jest.fn().mockResolvedValue(null);
            (passwordValidate as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { email: 'sdssd', password: 'dfssds' };
            const error = new Error('not found id');
            await userController.login(
                req as ExtraRequest,
                resp as Response,
                next
            );

            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller patch', async () => {
            repository.patch = jest
                .fn()
                .mockResolvedValue({ id: userId, name: 'pepe' });
            req.payload = { id: userId.toString() };
            req.body = { name: 'papa' };
            await userController.patch(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('when the run controller addFavorites', async () => {
            repository.getForMethods = jest.fn().mockResolvedValue({
                favorites: [],
            });
            req.payload = { id: userId.toString() };
            req.body = { id: productId };
            await userController.addFavorites(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('when the run controller addCart', async () => {
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        _id: '638901f4887798b01d443ed2',
                        product: '638901f4887798b01d443ed2',
                    },
                ],
            });
            req.payload = { id: userId.toString() };
            req.body = { id: productId };
            await userController.addCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('when the run controller deleteCart', async () => {
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        _id: '638901f4887798b01d443ed2',
                        product: '638901f4887798b01d443ed2',
                    },
                ],
            });
            req.payload = { id: userId.toString() };
            req.body = { id: '638901f4887798b01d443ed2' };
            await userController.deleteCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });

        test('when the run controller updateCart', async () => {
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        product: userId,
                        amount: 4,
                        isBuy: false,
                        _id: userId,
                    },
                ],
            });
            req.payload = { id: '638e96a104fe97fd938da8ad' };
            req.body = { product: { id: userId.toString() } };

            await userController.updateCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('when the run controller updateCart', async () => {
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        product: userId,
                        amount: 4,
                        isBuy: false,
                        _id: userId,
                    },
                ],
            });
            req.body = { product: { id: userId.toString() } };

            await userController.updateCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('when the run controller buycart', async () => {
            repository.getForMethods = jest.fn().mockResolvedValue({
                purchasedProducts: [],
                cart: [
                    {
                        product: userId,
                        amount: 4,
                        isBuy: false,
                        _id: userId,
                    },
                    {
                        product: userId,
                        amount: 4,
                        isBuy: false,
                        _id: userId,
                    },
                ],
            });
            req.payload = { id: '638e96a104fe97fd938da8ad' };

            await userController.buyCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('when the run controller addFavorites but we have id duplicated', async () => {
            repository.getForMethods = jest.fn().mockResolvedValue({
                favorites: [{ id: '638dbf0228fc47a26a8055d7' }],
            });
            req.payload = { id: userId.toString() };
            req.body = { id: '638dbf0228fc47a26a8055d7' };
            await userController.addFavorites(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('when the run controller addFavorites but we have id duplicated req.payload', async () => {
            req.payload = { id: '638901f4887798b01d443ed2' };
            req.body = { id: '638901f4887798b01d443ed5' };
            const error = new Error('duplicate id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        _id: '638901f4887798b01d443ed2',
                        product: '638901f4887798b01d443ed5',
                    },
                ],
            });
            await userController.addCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('', async () => {
            req.body = { id: '638901f4887798b01d443ed5' };
            req.payload = undefined;
            const error = new Error('duplicate id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        _id: '638901f4887798b01d443ed2',
                        product: '638901f4887798b01d443ed5',
                    },
                ],
            });
            await userController.addCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller deleteCart but we dont have a id valid', async () => {
            req.payload = { id: '638901f4887798b01d443ed2' };
            req.body = { id: '638901f4887798b01d443ed5' };
            const error = new Error('Not found id');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        _id: '638901f4887798b01d443ed2',
                        product: '638901f4887798b01d443ed5',
                    },
                ],
            });
            await userController.deleteCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller updateCart but we dont any id ', async () => {
            req.payload = { id: '638901f4887798b01d443ed2' };
            req.body = { id: '638901f4887798b01d443ed5' };
            const error = new Error('duplicate id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        product: userId,
                        amount: 4,
                        isBuy: false,
                        _id: '638901f4887798b01d443ed2',
                    },
                ],
            });
            await userController.updateCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller updateCart but we dont any id equal ', async () => {
            req.payload = { id: '638901f4887798b01d443ed2' };
            req.body = { product: { id: '638901f4887798b01d443ed5' } };
            const error = new Error('duplicate id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        product: '638901f4887798b01d443ed6',
                        amount: 4,
                        isBuy: false,
                        _id: '638901f4887798b01d443ed3',
                    },
                ],
            });
            await userController.updateCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller updateCart but we dont any id ', async () => {
            req.payload = undefined;
            req.body = { id: '638901f4887798b01d443ed5' };
            const error = new Error('duplicate id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        product: userId,
                        amount: 4,
                        isBuy: false,
                        _id: '638901f4887798b01d443ed2',
                    },
                ],
            });
            await userController.updateCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller buycart but the cart is empty', async () => {
            req.payload = { id: '638901f4887798b01d443ed2' };

            const error = new Error('duplicate id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [],
            });
            await userController.buyCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller buycart but we cont have a payload ', async () => {
            req.payload = undefined;

            const error = new Error('duplicate id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [],
            });
            await userController.buyCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller deleteCart but we have a error', async () => {
            const error = new Error('not found id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        _id: '638901f4887798b01d443ed2',
                        product: '638901f4887798b01d443ed2',
                    },
                ],
            });
            req.payload = { id: userId.toString() };
            req.body = { id: productId };
            await userController.deleteCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('when the run controller deleteCart but we dont have a payload', async () => {
            const error = new Error('not found id in cart');
            repository.getForMethods = jest.fn().mockResolvedValue({
                cart: [
                    {
                        _id: '638901f4887798b01d443ed2',
                        product: '638901f4887798b01d443ed2',
                    },
                ],
            });
            req.payload = undefined;
            req.body = { id: productId };
            await userController.deleteCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
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
            const req: Partial<ExtraRequest> = {};
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
                    req as ExtraRequest,
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
                    req as ExtraRequest,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(HTTPError);
            });

            test('Then patch Error', async () => {
                await userController.patch(
                    req as ExtraRequest,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
            });
            test('Then addfavorites Error for duplicated id', async () => {
                await userController.addFavorites(
                    req as ExtraRequest,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
            });
            test('when get throws an error', async () => {
                const error = new Error('Not found id');
                await userController.get(
                    req as ExtraRequest,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
            });
            test('when DeleteFavorites throws an error', async () => {
                const error = new Error('Not found id');
                await userController.deleteFavorites(
                    req as ExtraRequest,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
            });
            test('when DeleteFavorites throws an error not found id', async () => {
                req.payload = { id: '638901f4887798b01d443ed2' };
                req.body = { id: '638901f4887798b01d443ed2' };

                repoUser.getForMethods = jest.fn().mockResolvedValue({
                    _id: '638901f4887798b01d443ed2',
                    favorites: ['638901f4887798b01d443ed5'],
                });
                const error = new Error('Not found id');
                await userController.deleteFavorites(
                    req as ExtraRequest,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
            });
            test('Then delete account Error ', async () => {
                req.payload = undefined;
                repoUser.delete = jest.fn().mockRejectedValue(['Product']);
                await userController.deleteAccount(
                    req as ExtraRequest,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
            });
            test('when the run controller addFavorites but we have id duplicated req.payload', async () => {
                req.payload = { id: '638901f4887798b01d443ed2' };
                req.body = { id: '638901f4887798b01d443ed5' };
                const error = new Error('Not found id');
                repoUser.getForMethods = jest.fn().mockResolvedValue({
                    id: '638901f4887798b01d443ed2',
                    favorites: ['638901f4887798b01d443ed5'],
                });
                await userController.addFavorites(
                    req as ExtraRequest,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
            });
        });
    });
});
