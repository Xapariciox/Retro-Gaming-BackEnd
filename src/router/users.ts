import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { logged } from '../middlewares/interceptors.js';

import { UserRepository } from '../repository/user.js';
export const usersRouter = Router();

const controller = new UserController(UserRepository.getInstance());

usersRouter.get('/:id', controller.get.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.delete(
    '/delete/:id',
    logged,
    controller.deleteAccount.bind(controller)
);
