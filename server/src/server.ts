import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    // 1. Start Express Server immediately so endpoints and health checks are always responsive
    app.listen(env.PORT, () => {
      console.log(`[Server] Running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
    });

    // 2. Connect to MongoDB Atlas (with auto-retry)
    await connectDB();
  } catch (error) {
    console.error('[Server] Failed to start:', error);
  }
};

startServer();
