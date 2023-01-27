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
            const Products = await this.ProductRepository.getAll();
            if (Products.length < 1) {
                throw new Error('no data');
            }

            resp.json({ Products });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }
    async find(req: ExtraRequest, res: Response, next: NextFunction) {
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
            resp.json({ getProduct });
        } catch (error) {
            const httpError = new HTTPError(
                404,
                'service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    createHttpError(error: Error) {
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
