const { initDb, getClient } = require('../database/index');
const ObjectId = require('mongodb').ObjectId;

const reservationController = {};

reservationController.getReservation = async (req, res) => {
    try {
        const client = await getClient();
        const allHReservations = await client.db("group-project").collection("reservations");

        await allHReservations.find().toArray().then((reservation) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(reservation);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching reservation/booking", error: err.message });
    }
}

reservationController.getById = async (req, res) => {
    try {
        const reservationId = new ObjectId(req.params.id);
        // console.log(reservationId);
        const client = await getClient();
        const allReservations = await client.db("group-project").collection("reservations");

        await allReservations.find({ _id: reservationId }).toArray().then((reservations) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(reservations[0]);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching reservation/booking", error: err.message });
    }
}

reservationController.addReservation = async (req, res) => {
    try {

        let post_id = req.body.post_id;
        let user_id = req.body.user_id;
        let check_in_date = req.body.check_in_date;
        let check_out_date = req.body.check_out_date;
        let status = req.body.status;
        let total_price = req.body.total_price;

        const client = await getClient();
        const addReservation = await client.db("group-project").collection("reservations").insertOne({
            post_id,
            user_id,
            check_in_date,
            check_out_date,
            status,
            total_price
        });
        res.status(201).json(addReservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to book reservation/booking", error: err.message });
    }

}

reservationController.updateReservation = async (req, res) => {
    try {
        const reservationId = new ObjectId(req.params.id);
        let post_id = req.body.post_id;
        let user_id = req.body.user_id;
        let check_in_date = req.body.check_in_date;
        let check_out_date = req.body.check_out_date;
        let status = req.body.status;
        let total_price = req.body.total_price;

        const client = await getClient();
        const allReservations = await client.db("group-project").collection("reservations");

        await allReservations.replaceOne({ _id: reservationId }, {
            post_id,
            user_id,
            check_in_date,
            check_out_date,
            status,
            total_price
        });
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Reservation/booking updated sucessfully!" });

    } catch (error) {

        res.status(500).json({ message: 'Error updating reservation/booking', error: err });
    }
}

reservationController.deleteReservation = async (req, res) => {

    try {
        const reservationId = new ObjectId(req.params.id);
        const client = await getClient();

        await client.db("group-project").collection("reservations").deleteOne({ _id: reservationId });

        res.status(200).json({ message: "Reservation/booking deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting Reservation/booking", error: err.message });
    }
}

module.exports = reservationController;