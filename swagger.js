const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
require('dotenv').config();
const port = process.env.PORT;

const doc = {
    info: {
        title: 'SaintsBnB API',
        description:
            'API for SaintsBnB to display endpoints available and ready for consumption',
    },
    host: `localhost:${port}`,
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
            name: 'Session',
            description: 'Operations related to session',
        },
    ],
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        example: 'john_doe',
                        description: "User's full name.",
                    },
                    email: {
                        type: 'string',
                        example: 'johndoe@example.com',
                        description: 'A valid email address.',
                    },
                    password: {
                        type: 'string',
                        example: 'securePassword123!',
                        description:
                            'Minimum 8 characters with at least one uppercase, one lowercase, one number, and one special character.',
                    },
                    phone: {
                        type: 'string',
                        example: '1234567890',
                        description: 'An optional, valid phone number.',
                    },
                    role: {
                        type: 'string',
                        example: 'guest',
                        description: 'User role, can be guest, host, or admin.',
                    },
                },
            },
            Housing: {
                type: 'object',
                properties: {
                    rooms: {
                        type: 'integer',
                        example: 3,
                        description: 'Number of rooms.',
                    },
                    availability: {
                        type: 'boolean',
                        example: true,
                        description:
                            'Is the housing available? (optional on update)',
                    },
                    price: {
                        type: 'number',
                        example: 150.0,
                        description: 'Price per night.',
                    },
                    address: {
                        type: 'string',
                        example: '123 Example Street',
                        description: 'Street address.',
                    },
                    maxOccupants: {
                        type: 'integer',
                        example: 5,
                        description: 'Maximum number of occupants.',
                    },
                    features: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Wi-Fi', 'Pool', 'Air Conditioning'],
                        description: 'List of features.',
                    },
                    description: {
                        type: 'string',
                        example: 'Apartment with sea view and all amenities.',
                        description: 'Detailed description.',
                    },
                    images: {
                        type: 'array',
                        items: { type: 'string' },
                        example: [
                            'http://example.com/image1.jpg',
                            'http://example.com/image2.jpg',
                        ],
                        description: 'List of image URLs.',
                    },
                },
                required: ['rooms', 'price', 'address', 'maxOccupants'],
            },
        },
    },
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
