const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
require('dotenv').config();
const port = process.env.PORT;
const site = process.env.SITE;

const doc = {
    info: {
        title: 'SaintsBnB API',
        description:
            'API for SaintsBnB to display endpoints available and ready for consumption',
    },
    host: `${site}${port}`,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Users',
            description: 'Operations related to users',
        },
        {
            name: 'Housing',
            description: 'Operations related to housing',
        },
        {
            name: 'Home Page',
            description: 'Basic route for the API',
        },
        {
            name: 'Swagger',
            description: 'Swagger documentation for the API',
        },
        {
            name: 'Booking',
            description: 'Operations related to bookings',
        },
        {
            name: 'Calendar',
            description: 'Operations related to calendar',
        },
    ],
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
