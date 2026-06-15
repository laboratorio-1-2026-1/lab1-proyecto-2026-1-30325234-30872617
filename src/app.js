require('dotenv').config(); // Esto debe ser la línea 1
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mainRouter = require('./routes/index'); // Asegúrate de que esta ruta sea correcta [11]

const app = express();
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SmartGym API',
            version: '1.0.0',
            description: 'Documentación técnica interactiva para la gestión de SmartGym [1]',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        codigoInterno: { type: 'string' },
                        mensaje: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
                Paginated: {
                    type: 'object',
                    properties: {
                        items: {
                            type: 'array',
                            items: { type: 'object' }
                        },
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' }
                    }
                },
            },
        },
        servers: [{ url: 'http://localhost:3000/api/v1' }],
        security: [{ bearerAuth: [] }], // Aplica seguridad global para las pruebas
    },
    apis: ['./src/routes/*.js'], // Indica dónde están tus comentarios de documentación
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Prefijo oficial de la API v1 [11, 12]
app.use('/api/v1', mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor SmartGym corriendo en el puerto ${PORT}`);
});