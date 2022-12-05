import { model, Schema, Types } from 'mongoose';
export type ProductI = {
    _id?: string;
    id: Types.ObjectId;
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

export const productSchema = new Schema<ProductI>({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    date: String,
    description: String,
    stock: Number,
    brand: String,
    price: Number,
    category: String,
});

productSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export const Product = model<ProductI>('Product', productSchema, 'products');
