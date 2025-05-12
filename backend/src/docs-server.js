const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Swagger configuration
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
                url: process.env.API_URL || 'http://localhost:5001',
                description: 'API Server',
            },
        ],
    },
    apis: [path.join(__dirname, 'server.js')], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

// Create Express app
const app = express();
const PORT = process.env.DOCS_PORT || 5002;

// Serve Swagger UI
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(PORT, () => {
    console.log(`API Documentation available at http://localhost:${PORT}`);
}); 