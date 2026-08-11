import type { OperationType, PropertyStatus, PropertyType } from "./enums";

export interface Property {
  id: string;
  adminId: string;
  title: string;
  description: string;
  address: string;
  state: string;
  municipality: string;
  type: PropertyType;
  operationType: OperationType;
  price: number;
  status: PropertyStatus;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  squareMeters: number | null;
  images: string[];
  videos: string[];
  createdAt: string;
}

export interface PropertyFilters {
  type?: PropertyType;
  state?: string;
  municipality?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  address: string;
  state: string;
  municipality: string;
  type: PropertyType;
  operationType: OperationType;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  squareMeters?: number;
  images?: string[];
  videos?: string[];
}

export type UpdatePropertyInput = Partial<CreatePropertyInput> & {
  status?: PropertyStatus;
};
