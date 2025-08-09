const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');
const Housing = require('../models/housingModel');
const Booking = require('../models/bookingModel');
const Calendar = require('../models/calendarModel');

let testUserId;
let testHousingId;
let testBookingId;
let cookie; 

jest.setTimeout(30000); 

beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    await User.deleteMany({});
    await Housing.deleteMany({});
    await Booking.deleteMany({});
    await Calendar.deleteMany({});

    const user = new User({
        name: 'Test User',
        email: 'testuser@example.com',
        role: 'admin',
        password: 'Test1234',
    });
    await user.save();
    testUserId = user._id.toString();

    const housing = new Housing({
        rooms: 3,
        availability: true,
        price: 100,
        address: '123 Test St',
        maxOccupants: 4,
        userId: testUserId,
    });
    await housing.save();
    testHousingId = housing._id.toString();

    const booking = new Booking({
        housingId: testHousingId,
        userId: testUserId,
        checkInDate: new Date(Date.now() + 86400000),
        checkOutDate: new Date(Date.now() + 172800000),
        status: 'pending',
        totalPrice: 200,
    });
    await booking.save();
    testBookingId = booking._id.toString();

    const calendar = new Calendar({
        housingId: testHousingId,
        date: new Date(Date.now() + 86400000),
        available: true,
    });
    await calendar.save();

    const loginRes = await request(app)
        .post('/users/login')
        .send({ email: 'testuser@example.com', password: 'Test1234' });

    console.log('Login status:', loginRes.statusCode);
    console.log('Login headers:', loginRes.headers);
    console.log('Login body:', loginRes.body);

    expect(loginRes.statusCode).toBe(200);

    expect(loginRes.headers['set-cookie']).toBeDefined();
    expect(loginRes.headers['set-cookie'].length).toBeGreaterThan(0);

    cookie = loginRes.headers['set-cookie'][0];
    expect(cookie).toBeDefined(); 
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /users', () => {
    it('should get all users (auth required)', async () => {
        const res = await request(app).get('/users').set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe('GET /users/:id', () => {
    it('should get user by id (auth required)', async () => {
        const res = await request(app)
            .get(`/users/${testUserId}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', testUserId);
    });
});

describe('GET /housing', () => {
    it('should get all housing listings', async () => {
        const res = await request(app).get('/housing');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /housing/:id', () => {
    it('should get housing by id', async () => {
        const res = await request(app).get(`/housing/${testHousingId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', testHousingId);
    });
});

describe('GET /booking/:id', () => {
    it('should get booking by id', async () => {
        const res = await request(app)
            .get(`/booking/${testBookingId}`)
            .set('Cookie', cookie); // << adicione isto
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', testBookingId);
    });
});

describe('GET /booking/user/:userId', () => {
    it('should get all bookings by user id (auth required)', async () => {
        const res = await request(app)
            .get(`/booking/user/${testUserId}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /booking/housing/:housingId', () => {
    it('should get all bookings by housing id (auth required)', async () => {
        const res = await request(app)
            .get(`/booking/housing/${testHousingId}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /calendar/housing/:housingId', () => {
    it('should get all calendar entries by housing id', async () => {
        const res = await request(app).get(
            `/calendar/housing/${testHousingId}`,
        );
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /users/logout', () => {
  it('should logout the user and clear session cookie', async () => {
    const res = await request(app)
      .get('/users/logout')
      .set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    const clearedCookie = res.headers['set-cookie'][0];
    expect(clearedCookie).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
  });
});