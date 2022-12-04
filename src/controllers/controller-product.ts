import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ProductI } from '../entities/product.js';
import { UserI } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptors.js';
import { BasicRepo, BasicRepo2 } from '../repository/repository-Interface.js';

const debug = createDebug('retro-back:controller:product');

export class ProductController {
    constructor(
        public readonly ProductRepository: BasicRepo2<ProductI>,
        public readonly UserRepository: BasicRepo<UserI>
    ) {
        debug('instance');
    }
    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('getAll');
            const getProducts = await this.ProductRepository.getAll();
            if (!getProducts) {
                throw new Error('no data');
            }
            const Products = getProducts.map((data) => data);
            resp.json({ Products });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }
    async find(req: Request, res: Response, next: NextFunction) {
        try {
            debug('find');
            const products = await this.ProductRepository.find(
                req.params.key,
                req.params.value
            );
            if (products.length < 1) {
                throw new Error('Not Found');
            }
            res.json({ products });
        } catch (error) {
            const httpError = new HTTPError(
                404,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async get(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('get', req.params.id);

            const getProduct = await this.ProductRepository.get(req.params.id);
            resp.status(200).json({ getProduct });
        } catch (error) {
            const httpError = new HTTPError(
                404,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    createHttpError(error: Error) {
        if ((error as Error).message === 'Not found id') {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            (error as Error).message
        );
        return httpError;
    }
}
