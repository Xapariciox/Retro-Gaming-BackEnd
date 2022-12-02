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
    async get(id: id): Promise<UserI> {
        debug('get', id);
        const result = await this.#Model.findById(id);
        console.log(result);
        if (!result) throw new Error('Not found id');
        return result;
    }
    async create(data: Partial<UserI>): Promise<UserI> {
        debug('post', data.email);
        if (typeof data.password !== 'string')
            throw new mongoose.Error.ValidationError();
        data.password = await passwordEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result;
    }
    async find(search: Partial<UserI>): Promise<UserI> {
        debug('find', search);
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('Not found id');
        return result;
    }
    async patch(id: id, data: Partial<UserI>): Promise<UserI> {
        debug('patch', id);
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) throw new Error('Not found id');
        return result;
    }
    async delete(id: id): Promise<id> {
        debug('delete', id);
        const result = await this.#Model.findByIdAndDelete(id);
        if (!result) throw new Error('Not found id');
        return id;
    }
}
