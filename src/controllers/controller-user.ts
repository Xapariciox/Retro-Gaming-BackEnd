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
    async addFavorites(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('addFavorites');
            const user = await this.UserRepository.getForMethods(req.params.id);
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
    async deleteFavorites(
        req: ExtraRequest,
        resp: Response,
        next: NextFunction
    ) {
        try {
            debug('deleteFavorites');
            const user = await this.UserRepository.getForMethods(req.params.id);
            if (
                !user.favorites.find((item) => item.toString() === req.body.id)
            ) {
                throw Error('Not found id');
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
    async addCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('addCart');
            const user = await this.UserRepository.getForMethods(req.params.id);
            if (
                user.cart.find(
                    (item) => item.product.toString() === req.body.id
                )
            ) {
                throw Error('duplicate favorites');
            }
            user.cart.push({
                product: req.body.id,
                amount: req.body.amount,
                isBuy: false,
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
    async updateCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('updateCartAmount');
            //viendo si me hace falta lo del payload
            // if (!req.payload) {
            //     throw new Error('Invalid payload');
            // }
            const user = await this.UserRepository.getForMethods(req.params.id);

            const userProduct = await user.cart.find((item) => {
                return item.product.toString() === req.body.id;
            });
            if (!userProduct) {
                throw new Error('Not found id');
            }
            userProduct.amount = req.body.amount;
            const userAmountUpdate = await this.UserRepository.patch(
                req.params.id,
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
            const user = await this.UserRepository.getForMethods(req.params.id);
            const userProduct = await user.cart.filter(
                (item) => item.toString() !== req.body.id
            );
            if (!userProduct) {
                throw new Error('Not found id');
            }
            user.cart = await user.cart.filter(
                (item) => item.product.toString() !== req.body.id
            );
            await this.UserRepository.patch(req.params.id, user);
            resp.status(202);
            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async buyCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('buyCart');
            const user = await this.UserRepository.getForMethods(req.params.id);
            user.cart.forEach((item) => (item.isBuy = true));
            const userUpdate = user.cart;
            user.purchasedProducts = [...user.purchasedProducts, ...userUpdate];
            user.cart = [];
            const userToResp = await this.UserRepository.patch(
                req.params.id,
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
