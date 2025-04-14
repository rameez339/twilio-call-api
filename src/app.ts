import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { logger, loggerHttp } from './logger';
import { setupSwagger } from './swagger';
import db from './db';
dotenv.config();
db();

const app = express();

// Setup Swagger for API documentation
setupSwagger(app);

// --- Security Middleware ---
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --- Request Parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Logging ---
app.use(loggerHttp);

// --- Routes ---
app.use('/api/v1', routes);

// --- Health Check ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', environment: process.env.NODE_ENV || 'development' });
});

// --- 404 Handler ---
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Global Error Handler ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
