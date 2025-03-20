export const PORTS = {
  FRONTEND: 5173,    // 前端 Vite 开发服务器端口
  BACKEND: 3000,     // NestJS API服务器端口
  DATABASE: 5432,    // PostgreSQL数据库默认端口
  REDIS: 6379        // Redis缓存服务器端口
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/users/register'
  },
  PACKAGES: '/packages',
  BOOKINGS: '/bookings',
  ORDERS: '/orders',
  PHOTOS: '/photos'
} as const;
