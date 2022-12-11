import { model, Schema } from 'mongoose';
import { ProductI } from './product';

export type MyProducts = {
    product: string | ProductI;
    amount: number;
    isBuy: boolean;
};
export type UserI = {
    id: string;
    name: string;
    email: string;
    imageProfile: string;
    password: string;
    purchasedProducts: Array<MyProducts>;
    favorites: Array<string>;
    cart: Array<MyProducts>;
};
export type ProtoUser = {
    name?: string;
    email?: string;
    imageProfile?: string;
    password?: string;
    purchasedProducts?: [
        {
            product: {
                product: string;
            };
            amount: number;
        }
    ];
    favorites?: Array<string>;
    cart?: Array<MyProducts>;
};

export const userSchema = new Schema<UserI>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    imageProfile: String,

    purchasedProducts: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            amount: Number,
        },
    ],
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
    cart: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            amount: Number,
            isBuy: {
                type: Boolean,
                default: false,
            },
        },
    ],
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});

export const User = model<UserI>('User', userSchema, 'users');
