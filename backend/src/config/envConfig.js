import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '90d',
  emailHost: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  emailPort: process.env.EMAIL_PORT || 587,
  emailUser: process.env.EMAIL_USER || 'test@ethereal.email',
  emailPass: process.env.EMAIL_PASS || 'password',
  port:process.env.PORT || '5000',
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
};
