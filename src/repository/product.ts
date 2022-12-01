import { Product, ProductI } from '../entities/product';
import { id, BasicRepo2 } from './repository-Interface';
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

    async find(search: Partial<ProductI>): Promise<ProductI> {
        debug('find', { search });
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('Not found id');
        return result;
    }
}
