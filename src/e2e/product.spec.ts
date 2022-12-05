import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db-connect/db.connect';

describe('Given an "app" with "/Products" route', () => {
    describe('When we connected whit mongo', () => {
        beforeEach(async () => {
            await dbConnect();
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then the get to url /Products/:id with invalid id should sent status 404', async () => {
            const response = await request(app).get(
                '/Products/637d232badb33f47c88058b5'
            );
            expect(response.status).toBe(404);
        });
        test('Then the get to url /:key/:value with  params should sent status 200', async () => {
            const response = await request(app).get('/Products/name/rodrigo');
            expect(response.status).toBe(200);
        });
    });
});
