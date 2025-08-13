const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server')
const Post = require('../models/postModel');

describe('Posts', () => {
    let fakeUserId, post;

    beforeEach(async () => {
        fakeUserId = new mongoose.Types.ObjectId();

        post = await Post.create({
            user_id: fakeUserId,
            rooms: 2,
            availability: true,
            owner: 'saints BnB',
            price: '150',
            address: '123 Main St, Springfield',
            max_occupants: 4,
            location: 'Downtown'
        });
    });

    it('should return all posts', async () => {
        const res = await request(app).get('/posts').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].location).toBe('Downtown');
    });

    it('should return a post by ID', async () => {
        const res = await request(app).get(`/posts/${post._id}`).expect(200);
        expect(res.body._id).toBe(post._id.toString());
        expect(res.body.price).toBe('150');
    });

    it('should return posts filtered by availability (true)', async () => {
    const res = await request(app).get('/posts/availability/true').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(post => {
        expect(post.availability).toBe(true);
    });
});

it('should return posts filtered by availability (false)', async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    await Post.create({
        user_id: fakeUserId,
        rooms: 1,
        availability: false,
        owner: 'test owner',
        price: '100',
        address: '456 Another St',
        max_occupants: 2,
        location: 'Suburb'
    });

    const res = await request(app).get('/posts/availability/false').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(post => {
        expect(post.availability).toBe(false);
    });
});

it('should return 404 if no posts found with that availability', async () => {
    const res = await request(app).get('/posts/availability/invalidstatus').expect(404);
    expect(res.body.message).toBe('Invalid availability status. Must be either true or false.');
});

    it('should return 404 for non-existing post', async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/posts/${nonExistingId}`).expect(404);
        expect(res.body.message).toBe(`Post not found`);
    });

    it('should return error for invalid ID', async () => {
        const res = await request(app).get('/posts/000').expect(500);
        expect(res.body.message).toBe('Error fetching post');
    });
});