
## Marketplace de artículos escritos (Referencia : (https://es.webuy.com)

## Back-End Desarrollado con Las siguientes Tecnologias:
### NodeJs
### ExpressJs
### Jest
### Typescript
### Conexion Hacia MongoDB mediante Mongoose

## Modelo de datos

```


export type User = {
    id: string;
    name: string;
    email: string;
    imageProfile: string;
    password: string;
    purchasedProducts: Array<MyProducts>;
    favorites: Array<string>;
    cart: Array<MyProducts>

};
export type ProtoUser = {
    name?: string;
    email?: string;
    imageProfile?: string;
    password?: string;
    purchasedProducts?: Array<product>;
    favorites?: Array<string>;
    cart?: Array<productsInCart>;
};

export type Product = {
    id?: string;
    name: string;
    image: string;
    date: string;
    description: string;
    stock: number;
    brand: string;
    price: number;
    category: string;
};
export type ProtoProduct = {
    name?: string;
    image?: string;
    date?: string;
    description?: string;
    stock?: number;
    brand?: string;
    price?: number;
    category?: string;

};





```

### **ENDPOINT - User**:

[POST]/user/register ➡ Envía los datos de un usuario a la DB para registrarlo

[POST]/user/login ➡ Envía email y password para identificar a un usuario a través de token

[GET] user/favorites ➡ Obtiene el array de la lista de favoritos del usuario

[PATCH]user/favorites ➡ Borra algun producto de favoritos cuando el usuario lo desee

[PATCH]user/favorites ➡ Agrega algun producto a favoritos cuando el usuario lo desee

[PATCH]user/cart ➡ Añade el id del producto a cart añade(PATCH)

[GET] user/cart ➡ Obtiene el array del cart del usuario

[PATCH]user/cart ➡ Borra algun producto de cart cuando el usuario lo desee

[PATCH]user/favorites ➡ Agrega algun producto a cart cuando el usuario lo desee

### **ENDPOINT - Products**:

[GET]/products/consoles ➡ Obtiene la lista completa de consolas disponibles

[GET]/products/videogames ➡ Obtiene la lista completa de consolas disponibles

[GET]/products/:id ➡ Obtiene un producto por su id (GetById)

[POST] /products/add ➡ crea un nuevo producto a la coleccion products
