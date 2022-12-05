import { ProductRepository } from '../repository/product.js';
import { UserRepository } from '../repository/user.js';
import { ProductController } from './controller-product.js';
import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptors.js';

const mockProduct = { Products: [{ name: 'Consola', image: 'image.png' }] };

describe('Given the Product Controller', () => {
    const productRepo = ProductRepository.getInstance();
    const userRepo = UserRepository.getInstance();
    userRepo.getForMethods = jest.fn().mockResolvedValue({
        name: 'Ango',
        email: 'ango123@gmail.com',
        password: '1234',
    });
    userRepo.patch = jest.fn().mockResolvedValue(mockProduct);

    const productController = new ProductController(productRepo, userRepo);
    productRepo.getAll = jest
        .fn()
        .mockResolvedValue([{ name: 'Consola', image: 'image.png' }]);

    const req: Partial<Request> = {};
    const resp: Partial<Response> = {
        json: jest.fn(),
        status: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('when we run getAll', () => {
        productRepo.getAll = jest
            .fn()
            .mockResolvedValue([{ name: 'Consola', image: 'image.png' }]);
        test('It should return an array of all the Products', async () => {
            await productController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith(mockProduct);
        });
        test('when the array is empty', async () => {
            const error = new Error('Not found id');
            productRepo.getAll = jest.fn().mockResolvedValue([]);
            await productController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
    });
    describe('when we run get', () => {
        test('it should an Product by id', async () => {
            productRepo.get = jest.fn().mockResolvedValue({
                name: 'console',
            });
            req.params = { id: '2' };
            await productController.get(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({
                getProduct: { name: 'console' },
            });
        });
    });

    describe("Given the product's controller but,", () => {
        describe('When ProductController is not valid', () => {
            let error: CustomError;
            beforeEach(() => {
                error = new HTTPError(404, 'Not found', 'Not found id');
            });
            ProductRepository.prototype.getAll = jest
                .fn()
                .mockRejectedValue(['Consola']);

            const productRepo = ProductRepository.getInstance();
            const repoUser = UserRepository.getInstance();
            const productController = new ProductController(
                productRepo,
                repoUser
            );
            const req: Partial<Request> = {};
            const resp: Partial<Response> = {
                json: jest.fn(),
            };
            const next: NextFunction = jest.fn();

            test('Then getAll() should return an error', async () => {
                productRepo.getAll = jest.fn().mockRejectedValue('');
                error = new HTTPError(
                    503,
                    'Service unavailable',
                    'Not found service'
                );
                await productController.getAll(
                    req as Request,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
            });

            test('Then get() should return an error', async () => {
                productRepo.get = jest.fn().mockRejectedValue('');
                error = new HTTPError(
                    503,
                    'Service unavailable',
                    'Not found service'
                );
                await productController.get(
                    req as Request,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
            });
        });
    });
    describe('When we instantiate find()', () => {
        req.params = { key: 'name' };
        req.params = { value: 'rodrigo' };
        productRepo.find = jest.fn().mockResolvedValue({ name: 'rodrigo' });
        test('It should return the place search by params', async () => {
            await productController.find(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({
                products: { name: 'rodrigo' },
            });
        });
    });
    describe('when we instantiate find but return an array empty', () => {
        req.params = { key: '' };
        req.params = { value: '' };
        test('when the array is empty', async () => {
            const error = new Error('Not found id');
            productRepo.find = jest.fn().mockResolvedValue([]);
            await productController.find(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
    });
});
