import mongoose from 'mongoose';
import { dbConnect } from '../db-connect/db.connect.js';
import { User } from '../entities/user.js';
import { UserRepository } from './user.js';

describe('Given a singleton instance of the class "UserRepository"', () => {
    const mockData = [
        { name: 'Carlos', password: 'Robdff', email: 'totin@gmail.com' },
        { name: 'rodrigo', password: 'ssffdc', email: 'rodri123n@gmail.com' },
    ];
    const setUpCollection = async () => {
        await dbConnect();
        await User.deleteMany();
        await User.insertMany(mockData);
        const data = await User.find();
        return [data[0].id, data[1].id];
    };
    const repository = UserRepository.getInstance();
    const invalidId = '537b422da27b69c98b1916e1aa';
    let testIds: Array<string>;

    beforeAll(async () => {
        testIds = await setUpCollection();
    });
    describe('when it has been run get and it has called Model.findById', () => {
        const spyModel = jest.spyOn(User, 'findById');
        test('then, the id exist in the collecion returned the user ', async () => {
            const result = await repository.get(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });
    });
    describe('when it has been run get and it has called Model.findById', () => {
        const spyModel = jest.spyOn(User, 'findById');
        test('then, the id does not exist in the collection returned one Error ', async () => {
            expect(spyModel).toHaveBeenCalled();
            expect(async () => {
                await repository.get(testIds[2]);
            }).rejects.toThrowError(mongoose.MongooseError);
        });
    });
    describe('When it has been run find and it has called Model.findOne', () => {
        const spyModel = jest.spyOn(User, 'findOne');
        test('Then, if the data has been valid, it should be returned the found user ', async () => {
            const result = await repository.find(mockData[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then if the data has been invalid, it should be throw an error', async () => {
            expect(async () => {
                await repository.find({ name: 'Perla' });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run create and it has called Model.create', () => {
        const spyModel = jest.spyOn(User, 'create');
        const newUser = {
            name: 'Carlos',
            password: 'asa',
            email: 'alonso@gmail.com',
        };
        test('Then, if the data has been valid, it should be returned the new user', async () => {
            const result = await repository.create(newUser);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(newUser.name);
        });

        test('Then, if the data has been invalid, it should be thrown a Validation error', () => {
            const newUser = {};
            expect(async () => {
                await repository.create(newUser);
            }).rejects.toThrowError(mongoose.Error.ValidationError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run patch and it has called Model.findByIdAndUpdate', () => {
        const spyModel = jest.spyOn(User, 'findByIdAndUpdate');
        test('Then, if the ID has been valid, it should be returned the updated user', async () => {
            const updateName = 'pepe';
            const result = await repository.patch(testIds[0], {
                name: updateName,
            });
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(updateName);
        });

        test('Then, if the ID has been invalid, it should be thrown an error', async () => {
            const updateName = 'Sergio';
            expect(async () => {
                await repository.patch(invalidId, { name: updateName });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run delete and it has called Model.findByIdAndDelete', () => {
        const spyModel = jest.spyOn(User, 'findByIdAndDelete');
        test('Then, if the ID has been valid, it should be returned the deleted User', async () => {
            const result = await repository.delete(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result).toEqual(testIds[0]);
        });
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
});
