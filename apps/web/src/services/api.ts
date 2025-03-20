import axios from 'axios';
import type { LoginRequest, LoginResponse, User } from '@photo-studio/shared/types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
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
  login: (data: LoginRequest) => 
    api.post<LoginResponse>('/auth/login', data),
    
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
