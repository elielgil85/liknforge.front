const isProduction = process.env.NODE_ENV === 'production';

export const BACKEND_URL = isProduction
  ? 'https://liknforge-back.onrender.com'
  : 'http://localhost:3001';
