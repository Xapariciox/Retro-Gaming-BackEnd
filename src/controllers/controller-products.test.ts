import { Types } from 'mongoose';
import { ProductRepository } from '../repository/product';
import { UserRepository } from '../repository/user';
import { ProductController } from './controller-product';
import { NextFunction, Request, Response } from 'express';

const mockProduct = { Products: [{ name: 'Consola', image: 'image.png' }] };

const mockUser = [
    { name: 'Ango', email: 'ango123@gmail.com', password: '1234' },
];

const mockResolvedValue = { Product: ['pizza'] };

describe('Given the Product Controller', () => {
    const productRepo = ProductRepository.getInstance();
    const userRepo = UserRepository.getInstance();

    const userId = new Types.ObjectId();

    productRepo.getAll = jest
        .fn()
        .mockResolvedValue([{ name: 'Consola', image: 'image.png' }]);
    productRepo.get = jest.fn().mockRejectedValue(mockResolvedValue);
    userRepo.get = jest.fn().mockResolvedValue({
        name: 'Ango',
        email: 'ango123@gmail.com',
        password: '1234',
    });
    userRepo.patch = jest.fn().mockResolvedValue(mockProduct);

    const productController = new ProductController(productRepo, userRepo);

    const req: Partial<Request> = {};
    const resp: Partial<Response> = {
        json: jest.fn(),
        status: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('when we run getAll', () => {
        test('It should return an array of all the Products', async () => {
            await productController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith(mockProduct);
        });
    });
});
