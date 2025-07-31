const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();
const port = process.env.PORT;

const doc = {
    info: {
        title: 'SaintsBnB API',
        description:
            'Api for SaintsBnB to display endpoints available and ready for consumption',
    },
    host: port,
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
