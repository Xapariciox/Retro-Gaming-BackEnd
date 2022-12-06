import createDebug from 'debug';
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { readToken } from '../services/auth.js';
const debug = createDebug('retro-back:middlewares:interceptors');

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}
export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('logged');
    const authString = req.get('Authorization');
    if (!authString || !authString?.startsWith('Bearer')) {
        next(new HTTPError(403, 'Forbidden', 'Por favor haz loggin'));
        return;
    }
    try {
        const token = authString.slice(7);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
    }
};
