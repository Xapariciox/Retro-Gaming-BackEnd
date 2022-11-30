import { Product, ProductI } from '../entities/product';
import { Repo, id } from './repository-Interface';
import mongoose from 'mongoose';
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
    async get(id: id): promise<ProductI>;
}
