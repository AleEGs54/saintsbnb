const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server')
const Reservation = require('../models/reservationModel');

describe('Reservations', () => {
  let fakePostId, fakeUserId, reservation;

  beforeEach(async () => {
    fakePostId = new mongoose.Types.ObjectId();
    fakeUserId = new mongoose.Types.ObjectId();

    reservation = await Reservation.create({
      post_id: fakePostId,
      user_id: fakeUserId,
      check_in_date: new Date('2025-08-10'),
      check_out_date: new Date('2025-08-15'),
      status: 'confirmed',
      total_price: '200'
    });
  });

  it('should return all reservations', async () => {
    const res = await request(app).get('/reservations').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe('confirmed');
  });

  it('should return a reservation by ID', async () => {
    const res = await request(app).get(`/reservations/${reservation._id}`).expect(200);
    expect(res.body._id).toBe(reservation._id.toString());
    expect(res.body.total_price).toBe('200');
  });

  it('should return 404 for non-existing reservation', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/reservations/${nonExistingId}`).expect(404);
    expect(res.body.message).toBe(`Reservation/booking not found`);
  });

  it('should return error for invalid ID', async () => {
    const res = await request(app).get('/reservations/000').expect(500);
    expect(res.body.message).toBe('Error fetching reservation/booking');
  });
});
