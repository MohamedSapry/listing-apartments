// Service functions for apartment-related API calls
import { apiClient, endpoints } from './api';
import type {
  Apartment,
  ApartmentListItem,
  ApartmentWithDetails,
  SearchFilters,
  PaginationParams,
  ApiResponse,
  PaginatedResponse,
  Amenity,
  Compound,
} from '@/types';

export class ApartmentService {
  // Get all apartments with optional filters and pagination
  static async getApartments(
    filters: SearchFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<ApartmentListItem> & { success: boolean }> {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    // Add pagination params
    if (pagination.page) params.append('page', pagination.page.toString());
    if (pagination.limit) params.append('limit', pagination.limit.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `${endpoints.apartments}?${queryString}` : endpoints.apartments;
    
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ApartmentListItem>>>(endpoint);
    
    // Handle the nested data structure from backend
    return {
      success: response.success,
      data: response.data?.data || [], // Extract data.data
      pagination: response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  }

  // Get a single apartment by ID
  static async getApartmentById(id: number): Promise<ApiResponse<ApartmentWithDetails>> {
    const response = await apiClient.get<ApiResponse<ApartmentWithDetails>>(endpoints.apartment(id));
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  }

  // Get all amenities
  static async getAmenities(): Promise<ApiResponse<Amenity[]>> {
    const response = await apiClient.get<ApiResponse<Amenity[]>>(endpoints.amenities);
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  }

  // Get all compounds
  static async getCompounds(): Promise<ApiResponse<Compound[]>> {
    const response = await apiClient.get<ApiResponse<Compound[]>>(endpoints.compounds);
    return {
      success: response.success,
      data: response.data || [],
      message: response.message
    };
  }

  // Get statistics
  static async getStatistics(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get<ApiResponse<Record<string, unknown>>>(endpoints.statistics);
  }

  // Create a new apartment (for admin use)
  static async createApartment(apartmentData: Partial<Apartment>): Promise<ApiResponse<Apartment>> {
    return apiClient.post<ApiResponse<Apartment>>(endpoints.apartments, apartmentData);
  }
}

// Utility functions for formatting and display
export const formatPrice = (price: number, currency: string = 'EGP'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatSize = (sizeSqm: number): string => {
  return `${sizeSqm} sqm`;
};

export const formatListingType = (type: 'rent' | 'sale'): string => {
  return type === 'rent' ? 'For Rent' : 'For Sale';
};

export const getListingTypeColor = (type: 'rent' | 'sale'): string => {
  return type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
};
