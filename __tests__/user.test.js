const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server')
const User = require('../models/userModel');

describe('Users', () => {
    let fakeGoogleId, user;

    beforeEach(async () => {
        fakeGoogleId = new mongoose.Types.ObjectId();

        user = await User.create({
            googleId: fakeGoogleId.toString(),
            displayName: 'Test User',
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@gmail.com',
            isAdmin: false,
            isCustomer: true
        });
    });

    it('should return all users', async () => {
        const res = await request(app).get('/user').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].firstName).toBe('Test');
    });

    it('should return a user by ID', async () => {
        const res = await request(app).get(`/user/${user._id}`).expect(200);
        expect(res.body._id).toBe(user._id.toString());
        expect(res.body.email).toBe('testuser@gmail.com');
    });

    it('should return 404 for non-existing user', async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/user/${nonExistingId}`).expect(404);
        expect(res.body.message).toBe(`User not found`);
    });

    it('should return error for invalid ID', async () => {
        const res = await request(app).get('/user/000').expect(500);
        expect(res.body.message).toBe('Error fetching user');
    });
});