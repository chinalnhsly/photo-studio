import axios from 'axios';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import type { User } from '@prisma/client';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: string;
  phone?: string;
}

export const auth = {
  login: async (data: LoginRequest) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      return response;
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  },
  register: (data: RegisterData) =>
    api.post<User>('/users/register', data),

  resetPassword: (email: string) =>
    api.post('/auth/reset-password', { email }),
};

// 请求拦截器：添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
