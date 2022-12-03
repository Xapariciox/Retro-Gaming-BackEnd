import { Router } from 'express';
import { ProductController } from '../controllers/controller-product.js';
import { ProductRepository } from '../repository/product.js';
import { UserRepository } from '../repository/user.js';

export const productRouter = Router();

const controller = new ProductController(
    ProductRepository.getInstance(),
    UserRepository.getInstance()
);

productRouter.get('/', controller.getAll.bind(controller));
productRouter.post('/add', controller.post.bind(controller));
