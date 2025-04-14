import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const option: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Twilio API',
            version: '1.0.0',
            description: 'API documentation for Twilio application',
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1',
            },
        ],
    },
    apis: ['./src/routes/**/*.ts', './src/interfaces/*.ts'],
}

const swaggerSpec = swaggerJSDoc(option);

export const setupSwagger  = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}