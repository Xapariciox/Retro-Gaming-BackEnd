# Proyecto Final Roberto

## Marketplace de artículos escritos (Referencia : (https://es.webuy.com)

### un e-comerce de Consolas y videojuegos Retro que solo el Propietario o la empresa propietaria pueda agregar productos para vender cada usuario podra agregar, eliminar y agregar una nota a sus favoritos habrán las siguientes páginas:

### Home:

#### Saldra el logo de la pagina con una breve descripcion de la misma

### Profile:

#### Motraran los datos del usuario: Nombre, email, imagen perfil y los productos que ha comprodado

### Seccion consolas:

#### Consolas a la venta

### seccion VideoJuegos:

#### videoJuegos a la venta

### detalles:

#### detalles de cada articulo

### carrito:

#### los productos de los cuales el cliente este interesado

### Registro:

#### Pagina a donde seran reedirigidos los usuarios si le dan a la opcion "registro"

### Login:

#### Pagina a donde seran reedirigidos los usuarios si le dan a la opcion "login"

### Error 404 :

#### Diseño personal de como quiero que se vea el error 404

### Error 503

#### Diseño personal de como quiero que se vea el error 503

## Planteamiento de algun extra :

### Los usuarios Podran Filtrar Los productos que quieran buscar por nombre y por tipos

### cada producto dispondrá de un stock limitado que cuando alcance ese número Máximo cambiará su renderizado y mostrará “Sold out” (solo el propietario puedo volver a colocar el stock)

### Los usuarios podrán vender sus propios artículos en otra sección y comprárselos a otros Usuarios.

## Modelo de datos

```

import { Schema} from 'mongoose';

export type User = {
    id: Object.id
    name: string;
    email: string;
    imageProfile: string;
    password: string;
    purchasedProducts: Array<{id}>
    Favorites: Array<{id}>
    cart: [
        {
            productID: Object.id;
            amount: number;
        }
    ];

};
export type ProtoUser = {
    name?: string;
    email?: string;
    imageProfile?: string;
    password?: string;
    purchasedProducts?: Array<{id}>
    Favorites?: Array<{id}>
    cart?: [
        {
            productID: Object.id;
            amount: number;
        }
    ];
};

export type Product = {
    id: Object.id
    name: string;
    image: string;
    date: Date;
    Description: string;
    stock: number;
    brand: string;
    price: number
};
export type ProtoProduct = {
    name?: string;
    image?: string;
    date?: Date;
    Description?: string;
    stock?: number;
    brand?: string;
    price?: number

};
export const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,                                                           
        unique: true,
    },
    password: String,
    productsInCart: Array<Product>, 
    purchasedProducts: Array<Product>, 
    Favorites?: Array<Product> 
});


export const productSchema = new Schema<Product>({
    name: {
        type: String,
        required: true,
    },
    image: String,
    date: Date,
    Description: String,                                
    stock: Number,         
    brand: String,
});

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
