const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Motorbike Store API',
            version: '1.0.0',
            description: 'API documentation for the Motorbike Store application',
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'API Server',
            },
            {
                url: 'http://localhost:5002',
                description: 'Documentation Server',
            },
        ],
    },
    apis: ['./src/server.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 