export enum Role {
  USER = 'USER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
}

export interface ResetPasswordRequest {
  email: string;
}
