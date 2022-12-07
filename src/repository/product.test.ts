import mongoose from 'mongoose';
import { dbConnect } from '../db-connect/db.connect.js';
import { Product } from '../entities/product.js';
import { ProductRepository } from './product.js';

describe('Given a singleton instance of the class "ProductRepository"', () => {
    const mockData = [
        { name: 'Carlos', image: 'imagen cool' },
        { name: 'rodrigo', image: 'imagen no cool' },
    ];
    const setUpCollection = async () => {
        await dbConnect();
        await Product.deleteMany();
        await Product.insertMany(mockData);
        const data = await Product.find();
        return [data[0].id, data[1].id];
    };
    const repository = ProductRepository.getInstance();

    const badFormattedId = '1';
    const invalidId = '437b472da27b69l98b1416e6';
    let testIds: Array<string>;
    beforeAll(async () => {
        testIds = await setUpCollection();
    });

    describe('when i run getAll and i called Model.find', () => {
        test('then it returns the Products in the collection', async () => {
            const spyModel = jest.spyOn(Product, 'find');
            const result = await repository.getAll();
            expect(spyModel).toHaveBeenCalled();
            expect(result[0].name).toEqual(mockData[0].name);
        });
    });

    describe('when it has been run get and i called Model.finByid', () => {
        const spyModel = jest.spyOn(Product, 'findById');
        test('then it return the Product in the collection', async () => {
            const result = await repository.get(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });
        test('Then, if the ID has been bad formatted, it should be thrown an Cast error', async () => {
            expect(async () => {
                await repository.get(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyModel).toHaveBeenCalled();
        });
        test('Then, if the ID has been invalid, it should be thrown a Validation error', async () => {
            expect(async () => {
                await repository.get('638dbf0228fc47a26a8055d9');
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
        test('Then, if the ID has been invalid, it should be thrown a Validation error', async () => {
            expect(async () => {
                await repository.get(invalidId);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });
    describe('When it has been run find and it has called Model.find', () => {
        const spyModel = jest.spyOn(Product, 'find');
        test('Then, if the data has been valid, it should be returned the found Product ', async () => {
            const result = await repository.find('name', 'Carlos');
            expect(spyModel).toHaveBeenCalled();
            expect(result.map((item) => item.name)).toEqual([mockData[0].name]);
        });
    });
    describe('When it has been run find and it has called Model.create', () => {
        const spyModel = jest.spyOn(Product, 'create');
        test('Then, if the data has been valid, it should be returned the found Product ', async () => {
            const mockDataCreate = {
                name: 'pepe',
                image: 'sss',
            };
            const result = await repository.post(mockDataCreate);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockDataCreate.name);
        });
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
});
