import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { setCors } from './middlewares/cors.js';
import { errorManager } from './middlewares/error.js';
import { productRouter } from './router/product.js';
import { usersRouter } from './router/users.js';

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(setCors);

app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.header('Origin') || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    next();
});
//ver si es necesario
// const template = `
//     <body style='align'>
//         <h1>Proyecto Final Roberto</h1>
//         <h2>Endpoints Users</h2>
//         <ul>
//             <li><p>[POST]/users/register ➡ Envía los datos de un usuario a la DB para registrarlo</p></li>
//             <li><p>[POST]/users/login ➡ Envía email y password para identificar a un usuario a través de token</p></li>
//             <li><p>[GET]/users/:id ➡ Obtiene los datos de un usuario</p></li>
//             <li><p>[DELETE]users/delete ➡ le da la opcion al usuario de borrar su cuenta-registro</p></li>
//             <li><p>[GET] users/favorites ➡ Obtiene el array de la lista de favoritos del usuario</p></li>
//             <li><p>[PATCH]users/deletefavorites/:id ➡ Borra algun producto de favoritos cuando el usuario lo desee</p></li>
//             <li><p>[PATCH]users/addfavorites/:id ➡ Agrega algun producto a favoritos cuando el usuario lo desee</p></li>
//             <li><p>[PATCH]users/addcart/:id ➡ Añade el id del producto a cart añade(PATCH)</p></li>
//             <li><p>[PATCH]users/deletecart/:id ➡ Borra algun producto de cart cuando el usuario lo desee</p></li>
//             <li><p>[PATCH]users/updatecart/:id ➡ Updatea el Amount del producto en el carrito del usuario</p></li>
//             <li><p>[PATCH]users/buycart/:id ➡ mueve todos los elementos del cart al array purchasedProduct</p></li>
//         </ul>
//         </br>
//         <h2>Endpoints Products</h2>
//         <ul>
//             <li><p>[GET]/products ➡ Obtiene la lista completa de productos disponibles</p></li>
//             <li><p>[GET]/products/:id ➡ Obtiene un producto por su id (GetById)</p></li>
//             <li><p>[GET]/products/key:/value ➡ Busca por key: Nombre de categoria value: valor de la categoria</p></li>
//         </ul>

//     </body>`;

//ver si me hace falta
// app.get('/', (_req, res) => {
//     res.send(template).end();
// });
app.get('/', (_req, res) => {
    res.send('Proyecto Final Back Terminado').end();
});

app.use('/users', usersRouter);
app.use('/products', productRouter);

app.use(errorManager);
