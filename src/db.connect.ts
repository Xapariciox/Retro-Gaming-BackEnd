import mongoose from 'mongoose';
import { USER, PASSWORD } from './config.js';

export async function dbConnect() {
    const DBName =
        process.env.NODE_ENV !== 'test' ? 'Coders2022' : 'CodersTesting';
    const uri = `mongodb+srv://${USER}:${PASSWORD}@cluster0.yswmjv0.mongodb.net/?retryWrites=true&w=majority`;
    return mongoose.connect(uri);
}
