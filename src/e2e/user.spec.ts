import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db-connect/db.connect';

describe('Given an "app" with "/users" route', () => {
    describe('When I have connection to mongoDB', () => {
        beforeEach(async () => {
            await dbConnect();
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then the get to url / should sent status 200', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
        });

        test('Then the get to url /users/:id with invalid id should sent status 404', async () => {
            const response = await request(app).get('/users');
            expect(response.status).toBe(404);
        });
        test('Then the get to url /users/register with params should sent status 503', async () => {
            const response = await request(app).post('/users/register');
            expect(response.status).toBe(503);
        });
        test('Then the get to url /users/login with params should sent status 503', async () => {
            const response = await request(app).post('/users/login');
            expect(response.status).toBe(500);
        });
        test('Then the get to url /addfavorites/:id with params should sent status 500', async () => {
            const response = await request(app).post('/users/addfavorites');
            expect(response.status).toBe(404);
        });
    });
});
