const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production'

const doc = {
    info: {
        title: 'SaintsBnB API',
        description:
            'Api for SaintsBnB to display endpoints available and ready for consumption',
        version: '1.0.0',
    },
    host: isProduction ?  'saintsbnb.onrender.com' : 'localhost:3000',
    basePath: '/',
    schemes: isProduction ? ['https'] : ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        { name: 'Posts', description: 'Operations related to property posts' },
        { name: 'Reservations', description: 'Reservation operations' },
        { name: 'Users', description: 'User account operations' },
        { name: 'Reviews', description: 'Reviews in posts operations' },
        { name: 'Auth', description: 'Authentication operations' },
    ],
    securityDefinitions: {
        googleOAuth: {
            type: 'oauth2',
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            flow: 'accessCode',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: {
                'profile': 'View your profile',
                'email': 'View your email address'
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
