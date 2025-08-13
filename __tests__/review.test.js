const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server')
const Review = require('../models/reviewModel');

describe('Reviews', () => {
    let fakeUserId, fakePostId, review;

    beforeEach(async () => {
        fakeUserId = new mongoose.Types.ObjectId();
        fakePostId = new mongoose.Types.ObjectId();

        review = await Review.create({
            user_id: fakeUserId,
            post_id: fakePostId,
            review_date: new Date(),
            review_text: 'Great post!',
            ratings: 5
        });
    });

    it('should return all reviews', async () => {
        const res = await request(app).get('/reviews').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].ratings).toBe(5);
    });

    it('should return a review by ID', async () => {
        const res = await request(app).get(`/reviews/${review._id}`).expect(200);
        expect(res.body._id).toBe(review._id.toString());
        expect(res.body.review_text).toBe('Great post!');
    });

    it('should return 404 for non-existing review', async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/reviews/${nonExistingId}`).expect(404);
        expect(res.body.message).toBe(`Review not found`);
    });

    it('should return error for invalid ID', async () => {
        const res = await request(app).get('/reviews/000').expect(500);
        expect(res.body.message).toBe('Error fetching review');
    });
});