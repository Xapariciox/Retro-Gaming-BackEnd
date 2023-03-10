export type id = string | number;

export interface BasicRepo<T> {
    get: (id: id) => Promise<T>;
    getForMethods: (id: id) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    find: (data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
}

export interface BasicRepo2<T> {
    getAll: () => Promise<Array<T>>;
    get: (id: id) => Promise<T>;
    find: (key: string, value: string) => Promise<Array<T>>;
    post: (data: Partial<T>) => Promise<T>;
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
