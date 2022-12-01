import { dbConnect } from './db.connect.js';
import mongoose from 'mongoose';

const spiConnect = jest.spyOn(mongoose, 'connect');
describe('Given "dbConnect"', () => {
    describe('When the environment is "test"', () => {
        test('Then it should connect with DB', async () => {
            const result = await dbConnect();
            expect(spiConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe('testing');
        });
    });
    describe('When the environment is not "test"', () => {
        test('Then it should connect with DB', async () => {
            process.env.NODE_ENV = 'development';
            const result = await dbConnect();
            expect(spiConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe('Proyecto-Final');
        });
    });
    afterEach(() => {
        mongoose.disconnect();
    });
});
