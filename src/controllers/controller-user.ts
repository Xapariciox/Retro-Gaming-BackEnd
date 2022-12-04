import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { UserI } from '../entities/user.js';
import { BasicRepo, BasicRepo2 } from '../repository/repository-Interface.js';
import { HTTPError } from '../interfaces/error.js';
import { createToken, passwordValidate } from '../services/auth.js';
import { ProductI } from '../entities/product.js';

const debug = createDebug('retro-back:controller:user');

export class UserController {
    constructor(
        public readonly UserRepository: BasicRepo<UserI>,
        public readonly ProductRepository: BasicRepo2<ProductI>
    ) {
        //falta repository product
        debug('instance');
    }
    async register(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('register');
            const user = await this.UserRepository.create(req.body);
            resp.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async login(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('login', req.body.email);
            const user = await this.UserRepository.find({
                email: req.body.email,
            });
            const isPasswordValid = await passwordValidate(
                req.body.password,
                user.password
            );
            if (!isPasswordValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                password: user.password,
            });
            resp.json({ token });
        } catch (error) {
            next(this.#createHttpError);
        }
    }
    async deleteAccount(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('delete', req.params.id);
            const deleteAccount = await this.UserRepository.delete(
                req.params.id
            );

            resp.json({ id: deleteAccount });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async get(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('get');
            const user = await this.UserRepository.get(req.params.id);

            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async patch(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('patch');
            const updatedUser = await this.UserRepository.patch(
                req.params.id,
                req.body
            );
            resp.json({ updatedUser });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async addFavorites(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('addFavorites');
            const user = await this.UserRepository.get(req.params.id);
            if (
                user.favorites.find((item) => item.toString() === req.body.id)
            ) {
                throw Error('duplicate favorites');
            }
            user.favorites.push(req.body.id);
            const userUpdate = await this.UserRepository.patch(
                req.params.id,
                user
            );
            resp.status(202);
            resp.json({ userUpdate });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async deleteFavorites(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('deleteFavorites');
            const user = await this.UserRepository.get(req.params.id);
            if (
                !user.favorites.find((item) => item.toString() === req.body.id)
            ) {
                throw Error('Not Found id');
            }
            user.favorites = user.favorites.filter(
                (item) => item.toString() !== req.body.id
            );
            await this.UserRepository.patch(req.params.id, user);
            resp.status(202);
            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async addCart(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('addCart');
            console.log('esto es lo que busca');
            const user = await this.UserRepository.get(req.params.id);
            if (user.cart.find((item) => item.toString() === req.body.id)) {
                throw Error('duplicate ');
            }
            user.cart.push({
                productID: req.body.id,
                amount: req.body.amount,
            });
            const userUpdate = await this.UserRepository.patch(
                req.params.id,
                user
            );

            resp.status(202);
            resp.json({ userUpdate });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    #createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not Found', error.message);
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
