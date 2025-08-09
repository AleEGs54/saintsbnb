const swaggerAutogen = require('swagger-autogen')();


const doc = {
    info: {
        title: 'SaintsBnB API',
        description:
            'Api for SaintsBnB to display endpoints available and ready for consumption',
    },
    host: 'saintsbnb.onrender.com',
    // host: 'localhost:3000',
    basePath: '/',
    schemes: ['https'],
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
