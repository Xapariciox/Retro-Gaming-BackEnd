import { Types } from 'mongoose';

export type id = string | number;

export interface BasicRepo<T> {
    get: (id: id) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    find: (data: Partial<T>) => Promise<T>;
}

export interface ExtraRepo<T> {
    getAll: () => Promise<Array<T>>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface Repo<T> extends BasicRepo<T> {
    getAll: () => Promise<Array<T>>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}
