import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { setCors } from './middlewares/cors.js';
import { errorManager } from './middlewares/error.js';
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

app.get('/', (_req, res) => {
    res.send('Proyecto final En progreso... Sigan observando :D').end();
});
app.use('/users', usersRouter);

app.use(errorManager);
