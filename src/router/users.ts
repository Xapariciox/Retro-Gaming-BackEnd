import { Router } from 'express';
import { UserController } from '../controllers/controller-user.js';
import { logged } from '../middlewares/interceptors.js';
import { ProductRepository } from '../repository/product.js';
import { UserRepository } from '../repository/user.js';
export const usersRouter = Router();

const controller = new UserController(
    UserRepository.getInstance(),
    ProductRepository.getInstance()
);

usersRouter.get('/', logged, controller.get.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch(
    '/addfavorites',
    logged,
    controller.addFavorites.bind(controller)
);
usersRouter.delete(
    '/delete',
    logged,
    controller.deleteAccount.bind(controller)
);
usersRouter.patch(
    '/deletefavorites',
    logged,
    controller.deleteFavorites.bind(controller)
);
usersRouter.patch('/addcart', logged, controller.addCart.bind(controller));
usersRouter.patch(
    '/updatecart',
    logged,
    controller.updateCart.bind(controller)
);
usersRouter.patch(
    '/deletecart',
    logged,
    controller.deleteCart.bind(controller)
);
usersRouter.patch('/buycart', logged, controller.buyCart.bind(controller));
usersRouter.patch('/updateuser', logged, controller.patch.bind(controller));
