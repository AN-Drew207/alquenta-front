import type { OperationType, PropertyStatus, PropertyType } from "./enums";

export interface Property {
  id: string;
  adminId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  type: PropertyType;
  operationType: OperationType;
  price: number;
  status: PropertyStatus;
  bedrooms: number | null;
  bathrooms: number | null;
  squareMeters: number | null;
  images: string[];
  createdAt: string;
}

export interface PropertyFilters {
  type?: PropertyType;
  city?: string;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  address: string;
  city: string;
  type: PropertyType;
  operationType: OperationType;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  images?: string[];
}

export type UpdatePropertyInput = Partial<CreatePropertyInput> & {
  status?: PropertyStatus;
};
