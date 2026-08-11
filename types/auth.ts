import type { Role } from "./enums";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}
