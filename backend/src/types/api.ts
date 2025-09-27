/**
 * API Types
 * 
 * These define the structure of data that flows between our frontend
 * and backend. They ensure type safety and clear data contracts.
 */

import { Apartment, Compound, ApartmentImage, Amenity, ListingType, Prisma } from '@prisma/client';

// Standard response format for all API endpoints
export interface ApiResponse<T = any> {
  success: boolean;  // Whether the request succeeded
  data?: T;         // The actual data (if successful)
  error?: string;   // Error type (if failed)
  message?: string; // Human-readable message
}

// Full apartment details with all related information
export type ApartmentWithDetails = Apartment & {
  compound: Compound;
  images: ApartmentImage[];
  amenities: Array<{
    amenity: Amenity;
  }>;
};

// Apartment info for listing pages (includes essential data only)
export type ApartmentListItem = Apartment & {
  compound: {
    id: number;
    name: string;
    city: string;
    district: string;
  };
  images: Array<{
    id: number;
    url: string;
    altText: string | null;
    position: number;
  }>;
};

// Create apartment request
export interface CreateApartmentRequest {
  compoundId: number;
  title: string;
  referenceNumber: string;
  listingType: ListingType;
  price: number;
  currency?: string;
  description?: string;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  finished?: boolean;
  floor?: number;
  unitNumber?: string;
  amenityIds?: number[];
  images?: Array<{
    url: string;
    altText?: string;
    position?: number;
  }>;
}

// Search and filter parameters
export interface ApartmentFilters {
  search?: string;           // Search in title, description, compound name
  listingType?: ListingType; // 'rent' or 'sale'
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  district?: string;
  compoundId?: number;
  amenityIds?: number[];     // Filter by amenities
  finished?: boolean;
  minSize?: number;
  maxSize?: number;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'sizeSqm' | 'bedrooms';
  sortOrder?: 'asc' | 'desc';
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
