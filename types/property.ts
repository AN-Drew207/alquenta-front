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
  whatsapp: string | null;
  hasWhatsappContact: boolean;
  contactRevealToken: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export type PropertySortBy = "price" | "createdAt" | "squareMeters";
export type SortOrder = "asc" | "desc";

export interface PropertyFilters {
  type?: PropertyType;
  operationType?: OperationType;
  state?: string;
  municipality?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  search?: string;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
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
  whatsapp?: string;
  latitude?: number;
  longitude?: number;
}

export type UpdatePropertyInput = Partial<CreatePropertyInput> & {
  status?: PropertyStatus;
};
