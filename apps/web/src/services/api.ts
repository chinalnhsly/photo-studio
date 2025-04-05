import axios from 'axios';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import type { User } from '@prisma/client';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';  // 添加 /api 前缀

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
  register: async (data: RegisterData) => {
    const response = await api.post<User>('/users/register', data);
    return response;
  },

  resetPassword: async (email: string) => {
    const response = await api.post('/auth/reset-password', { email });
    return response;
  }
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const fetchOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

// 请求拦截器：添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
);

export default api;
