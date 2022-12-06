import { Product, ProductI, ProtoProduct } from '../entities/product.js';
import { id, BasicRepo2 } from './repository-Interface.js';
import createDebug from 'debug';
const debug = createDebug('Retro Back:repository:Product');
export class ProductRepository implements BasicRepo2<ProductI> {
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

    async find(key: string, value: string): Promise<Array<ProductI>> {
        debug('find categoria', { key });
        const result = await this.#Model.find({ [key]: value });
        return result as unknown as Promise<Array<ProductI>>;
    }
    async post(data: ProtoProduct): Promise<ProductI> {
        debug('post', data);
        const result = await await this.#Model.create(data);
        return result;
    }
}
