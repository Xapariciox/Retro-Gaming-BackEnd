import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { UserI } from '../entities/user.js';
import { BasicRepo, BasicRepo2 } from '../repository/repository-Interface.js';
import { HTTPError } from '../interfaces/error.js';
import { createToken, passwordValidate } from '../services/auth.js';
import { ProductI } from '../entities/product.js';
import { ExtraRequest } from '../middlewares/interceptors.js';
const debug = createDebug('retro-back:controller:user');
export class UserController {
    constructor(
        public readonly UserRepository: BasicRepo<UserI>,
        public readonly ProductRepository: BasicRepo2<ProductI>
    ) {
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
    async login(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('login', req.body.email);

            const user = await this.UserRepository.find({
                email: req.body.email.json,
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
    async deleteAccount(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            if (!req.payload) throw new Error('Not payload');
            debug('delete', req.payload.id);

            const deleteAccount = await this.UserRepository.delete(
                req.payload.id
            );

            resp.json({ id: deleteAccount });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async get(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('get', req.params.id);

            const user = await this.UserRepository.get(req.params.id);
            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async patch(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('patch');
            if (!req.payload) throw new Error('Not payload');
            const updatedUser = await this.UserRepository.patch(
                req.payload.id,
                req.body
            );
            resp.json({ updatedUser });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async addFavorites(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('addFavorites');
            if (!req.payload) throw new Error('Not payload');
            const user = await this.UserRepository.getForMethods(
                req.payload.id
            );
            if (
                user.favorites.find((item) => item.toString() === req.body.id)
            ) {
                throw Error('duplicate favorites');
            }
            user.favorites.push(req.body.id);
            const userUpdate = await this.UserRepository.patch(
                req.payload.id,
                user
            );
            resp.status(202);
            resp.json({ userUpdate });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async deleteFavorites(
        req: ExtraRequest,
        resp: Response,
        next: NextFunction
    ) {
        try {
            debug('deleteFavorites');
            if (!req.payload) throw new Error('Not payload');
            const user = await this.UserRepository.getForMethods(
                req.payload.id
            );
            if (
                !user.favorites.find((item) => item.toString() === req.body.id)
            ) {
                throw Error('Not found id');
            }
            user.favorites = user.favorites.filter(
                (item) => item.toString() !== req.body.id
            );
            await this.UserRepository.patch(req.payload.id, user);
            resp.status(202);
            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async addCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('addCart');
            if (!req.payload) throw new Error('Not payload');
            const user = await this.UserRepository.getForMethods(
                req.payload.id
            );
            if (
                user.cart.find(
                    (item) => item.product.toString() === req.body.id
                )
            ) {
                throw Error('duplicate id in cart');
            }
            user.cart.push({
                product: req.body.id,
                amount: req.body.amount,
                isBuy: false,
            });
            const userUpdate = await this.UserRepository.patch(
                req.payload.id,
                user
            );

            resp.status(202);
            resp.json({ userUpdate });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async updateCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('updateCartAmount');

            if (!req.payload) throw new Error('Invalid payload');

            const user = await this.UserRepository.getForMethods(
                req.payload.id
            );

            const userProduct = await user.cart.find((item) => {
                return item.product.toString() === req.body.id;
            });

            if (!userProduct) {
                throw new Error('Not found id');
            }
            userProduct.amount = req.body.amount;
            const userAmountUpdate = await this.UserRepository.patch(
                req.payload.id,
                user
            );

            resp.json({ userAmountUpdate });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async deleteCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('deleteCart');
            if (!req.payload) throw new Error('Not payload');
            const user = await this.UserRepository.getForMethods(
                req.payload.id
            );

            const comprobacion = user.cart.find(
                (item) => item.product.toString() === req.body.id
            );

            if (!comprobacion) {
                throw new Error('no found id');
            }

            user.cart = user.cart.filter(
                (item) => item.product.toString() !== req.body.id
            );

            await this.UserRepository.patch(req.payload.id, user);
            resp.status(202);
            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async buyCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('buyCart');
            if (!req.payload) throw new Error('Not payload');
            const user = await this.UserRepository.getForMethods(
                req.payload.id
            );
            user.cart.forEach((item) => (item.isBuy = true));
            if (user.cart.length < 1) {
                throw new Error('Cart is Empty');
            }
            user.purchasedProducts.push(...user.cart);

            const userToResp = await this.UserRepository.patch(
                req.payload.id,
                user
            );
            resp.status(202);
            resp.json({ userToResp });
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
