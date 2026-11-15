import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import medicineRoutes from './routes/medicine.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// Parse allowed CORS origins
const allowedOrigins = env.CLIENT_URL.split(',').map((o) => o.trim());
if (env.NODE_ENV !== 'production') {
  if (!allowedOrigins.includes('http://localhost:5173')) allowedOrigins.push('http://localhost:5173');
  if (!allowedOrigins.includes('http://127.0.0.1:5173')) allowedOrigins.push('http://127.0.0.1:5173');
}

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, or fallback to true
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health Check Route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'PharmaPath API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

// Global 404 Route
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

export default app;
