import { Product, ProductI, ProtoProduct } from '../entities/product';
import { Repo, id } from './repository-Interface';
import createDebug from 'debug';
const debug = createDebug('projectBack:repository:Product');
export class ProductRepository implements Repo<ProductI> {
    static instance: ProductRepository;
    public static getInstance(): ProductRepository {
        if (!ProductRepository.instance) {
            ProductRepository.instance = new ProductRepository();
        }
        return ProductRepository.instance;
    }
    #Model = Product;
    private constructor() {
        debug('instance');
    }
    async getAll(): Promise<Array<ProductI>> {
        debug('getAll');
        const result = await this.#Model.find();
        return result;
    }
    async get(id: id): Promise<ProductI> {
        debug('get', id);
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('Not found id');
        return result;
    }

    async find(search: Partial<ProductI>): Promise<ProductI> {
        debug('find', { search });
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('Not found id');
        return result;
    }
    async create(data: ProtoProduct): Promise<ProductI> {
        debug('post', data);
        const result = await await this.#Model.create(data);
        return result;
    }
    async patch(id: id, data: Partial<ProductI>): Promise<ProductI> {
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
