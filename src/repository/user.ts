import mongoose from 'mongoose';
import createDebug from 'debug';
import { User, UserI } from '../entities/user.js';
import { passwordEncrypt } from '../services/auth.js';
import { BasicRepo, id } from './repository-Interface.js';
const debug = createDebug('retro-back:repository:user');

export class UserRepository implements BasicRepo<UserI> {
    static instance: UserRepository;
    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }
    #Model = User;
    private constructor() {
        debug('instance');
    }
    async getForMethods(id: id): Promise<UserI> {
        debug('get', id);
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');

        return result;
    }
    async get(id: id): Promise<UserI> {
        debug('get', id);
        const result = await this.#Model
            .findById(id)
            .populate('favorites')
            .populate('cart.product')
            .populate('purchasedProducts.product');
        if (!result) throw new Error('Not found id');

        return result as UserI;
    }

    async create(data: Partial<UserI>): Promise<UserI> {
        debug('post', data);
        if (typeof data.password !== 'string')
            throw new mongoose.Error.ValidationError();
        data.password = await passwordEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result;
    }
    async find(search: Partial<UserI>): Promise<UserI> {
        debug('find', search);
        const result = await this.#Model
            .findOne(search)
            .populate('favorites')
            .populate('cart.product')
            .populate('purchasedProducts.product');
        return result as UserI;
    }
    async patch(id: id, data: Partial<UserI>): Promise<UserI> {
        debug('patch', id, data);
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        //no se si lo necesitare front
        // .populate('favorites')
        // .populate('cart.product');

        return result as UserI;
    }
    async delete(id: id): Promise<id> {
        debug('delete', id);
        await this.#Model.findByIdAndDelete(id);
        return id;
    }
}
