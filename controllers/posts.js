const { initDb, getClient } = require('../database/index');
const ObjectId = require('mongodb').ObjectId;

const postController = {};

postController.getHousing = async (req, res) => {
    try {
        const client = await getClient();
        const allHousing = await client.db("group-project").collection("posts");

        await allHousing.find().toArray().then((house) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(house);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching houses", error: err.message });
    }
}

postController.getById = async (req, res) => {
    try {
        const houseId = new ObjectId(req.params.id);
        // console.log(houseId);
        const client = await getClient();
        const allHousing = await client.db("group-project").collection("posts");

        await allHousing.find({ _id: houseId }).toArray().then((houses) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(houses[0]);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching house/post", error: err.message });
    }
}

postController.getByLocation = async (req, res) => {
    try {
        const location = req.params.location;
        // console.log(location);
        const client = await getClient();
        const allHousing = await client.db("group-project").collection("posts");

        await allHousing.find({ location: location.toLowerCase() }).toArray().then((houses) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(houses);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching house/post", error: err.message });
    }
}

postController.addHousing = async (req, res) => {
    try {

        let user_id = req.body.user_id;
        let rooms = req.body.rooms;
        let availability = req.body.availability;
        let owner = req.body.owner;
        let price = req.body.price;
        let address = req.body.address;
        let max_occupants = req.body.max_occupants;
        let location = req.body.location;

        const client = await getClient();
        const addHousing = await client.db("group-project").collection("posts").insertOne({
            user_id,
            rooms,
            availability,
            owner,
            price,
            address,
            max_occupants,
            location
        });
        res.status(201).json(addHousing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add Housing/post", error: err.message });
    }

};

postController.updateHousing = async (req, res) => {
    try {
        const houseId = new ObjectId(req.params.id);
        let user_id = req.body.user_id;
        let rooms = req.body.rooms;
        let availability = req.body.availability;
        let owner = req.body.owner;
        let price = req.body.price;
        let address = req.body.address;
        let max_occupants = req.body.max_occupants;
        let location = req.body.location;

        const client = await getClient();
        const allHousing = await client.db("group-project").collection("posts");

        await allHousing.replaceOne({ _id: houseId }, {
            user_id,
            rooms,
            availability,
            owner,
            price,
            address,
            max_occupants,
            location
        });
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Housing/post updated sucessfully!" });

    } catch (error) {

        res.status(500).json({ message: 'Error updating house/post', error: err });
    }
}

postController.deleteHousing = async (req, res) => {

    try {
        const houseId = new ObjectId(req.params.id);
        const client = await getClient();

        await client.db("group-project").collection("posts").deleteOne({ _id: houseId });

        res.status(200).json({ message: "Housing/post deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting Housing/post", error: err.message });
    }
}

module.exports = postController;