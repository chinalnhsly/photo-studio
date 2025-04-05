import type { Role, User } from '@prisma/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  role: string;
}

export type { User, Role };
