import { model, Schema, Types } from 'mongoose';

export type UserI = {
    id: Types.ObjectId;
    name: string;
    email: string;
    imageProfile: string;
    password: string;
    purchasedProducts: [
        {
            productID: Types.ObjectId;
            amount: number;
        }
    ];
    favorites: Array<Types.ObjectId>;
    cart: [
        {
            productID: Types.ObjectId;
            amount: number;
        }
    ];
};
export type ProtoUser = {
    name?: string;
    email?: string;
    imageProfile?: string;
    password?: string;
    purchasedProducts?: [
        {
            productID: Types.ObjectId;
            amount: number;
        }
    ];
    favorites?: Array<Types.ObjectId>;
    cart?: [
        {
            productID: Types.ObjectId;
            amount: number;
        }
    ];
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
