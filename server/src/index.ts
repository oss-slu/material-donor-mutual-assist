import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config(); // Load environment variables

const app = express();
const prisma = new PrismaClient(); // Initialize Prisma Client

// CORS setup: allow localhost + *.github.io
app.use(cors({
  origin: (origin, callback) => {
    const allowedLocalhost = 'http://localhost:3000';
    const githubPagesPattern = /^https:\/\/([a-zA-Z0-9-]+)\.github\.io$/;

    if (!origin || origin === allowedLocalhost || githubPagesPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true
}));

// ✅ Allow preflight OPTIONS requests for all routes
app.options('*', cors());

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
import donorRouter from './routes/donorRoutes';
import programRouter from './routes/programRoutes';
import donatedItemRouter from './routes/donatedItemRoutes';
import donatedItemStatusRouter from './routes/donatedItemStatusRoutes';
import passwordResetRouter from './routes/passwordResetRoutes';

app.use('/donor', donorRouter);
app.use('/program', programRouter);
app.use('/api', programRouter); // review this duplicate
app.use('/passwordReset', passwordResetRouter);
app.use('/donatedItem', donatedItemRouter);
app.use('/donatedItem/status', donatedItemStatusRouter);

// Root health check
app.get('/', (req: Request, res: Response) => {
  res.send('Material Donor API is live!');
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, 'Route not found'));
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
});

// Start server and connect to DB
const startServer = async () => {
  const timestamp = new Date().toISOString();

  try {
    await prisma.$connect();
    console.log(`[${timestamp}] Logger: Connected to the database successfully!`);

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`[${timestamp}] Server running on https://material-donor-mutual-assist.onrender.com`);
    });
  } catch (error) {
    console.error(`[${timestamp}] Error connecting to the database:`, (error as Error).message);
    console.error('Stack Trace:', (error as Error).stack);
  }
};

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
  process.exit(0);
});

export default app;
