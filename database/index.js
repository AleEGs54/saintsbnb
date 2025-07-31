const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let client;

const initDb = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI not found in .env");
    }

    client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    await client.connect();
    console.log("Database connected!");
    return client;
};

const getClient = () => {
    if (!client) {
        throw new Error("DB client not initialized. Call initDb() first.");
    }
    return client;
};

module.exports = { initDb, getClient };