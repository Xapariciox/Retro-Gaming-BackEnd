import createDebug from 'debug';
import { User, UserI } from '../entities/user';
import { passwdEncrypt } from '../services/auth';
import { BasicRepo, id } from './repository-Interface';
const debug = createDebug('projectBack:repository:user');

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

    async getAll(): Promise<Array<UserI>> {
        debug('getAll');
        const result = this.#Model.find();
        return result;
    }

    async get(id: id): Promise<UserI> {
        debug('get', id);
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');
        return result;
    }
    async post(data: Partial<UserI>): Promise<UserI> {
        debug('post', data);
        if (typeof data.password !== 'string') throw new Error('');
        data.password = await passwdEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result;
    }
    async find(search: Partial<UserI>): Promise<UserI> {
        debug('find', { search });
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
        if (result === null) throw new Error('Not found id');
        return id;
    }
}
