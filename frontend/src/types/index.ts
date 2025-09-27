// Types for our apartment listing application
export interface Apartment {
  id: number;
  title: string;
  referenceNumber: string;
  listingType: 'rent' | 'sale';
  price: number;
  currency: string;
  description: string | null;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  finished: boolean;
  floor: number | null;
  unitNumber: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  compound: Compound;
  images: ApartmentImage[];
  amenities: ApartmentAmenity[];
}

export interface Compound {
  id: number;
  name: string;
  city: string;
  district: string;
  addressLine: string;
  lat: number | null;
  lng: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApartmentImage {
  id: number;
  apartmentId: number;
  url: string;
  altText: string | null;
  position: number;
  createdAt: string;
}

export interface Amenity {
  id: number;
  name: string;
}

export interface ApartmentAmenity {
  apartmentId: number;
  amenityId: number;
  amenity: Amenity;
}

export interface ApartmentListItem {
  id: number;
  title: string;
  referenceNumber: string;
  listingType: 'rent' | 'sale';
  price: number;
  currency: string;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  finished: boolean;
  floor: number | null;
  unitNumber: string | null;
  compound: {
    id: number;
    name: string;
    city: string;
    district: string;
  };
  images: ApartmentImage[];
}

export interface ApartmentWithDetails extends Apartment {
  amenities: ApartmentAmenity[];
}

export interface SearchFilters {
  listingType?: 'rent' | 'sale';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  district?: string;
  amenities?: number[];
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

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
