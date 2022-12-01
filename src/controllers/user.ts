import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { ProductI } from '../entities/product';
import { UserI } from '../entities/user';
import { Repo } from '../repository/repository-Interface';
import { HTTPError } from '../interfaces/error';
import { createToken, passwordValidate } from '../services/auth';

const debug = createDebug('Proyecto Final:controller:user');

export class UserController {
    constructor(
        public readonly UserRepository: Repo<UserI>,
        public readonly ProductRepository: Repo<ProductI>
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
                name: req.body.email,
            });
            const isPasswordValid = await passwordValidate(
                req.body.password,
                user.password
            );
            if (!isPasswordValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                email: user.email,
                password: user.password,
            });
            resp.json({ token });
        } catch (error) {
            next(this.#createHttpError);
        }
    }
    #createHttpError(error: Error) {
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
