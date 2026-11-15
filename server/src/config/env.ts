import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  CLIENT_URL: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_pharmapath_secret_jwt_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
