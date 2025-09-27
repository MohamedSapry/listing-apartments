/**
 * Apartment Service
 * 
 * This handles all the business logic for apartment operations
 * like searching, filtering, and managing apartment data.
 */

import { prisma } from './database';
import { 
  ApartmentWithDetails, 
  ApartmentListItem, 
  CreateApartmentRequest, 
  ApartmentFilters, 
  PaginationParams,
  PaginatedResponse 
} from '../types/api';
import { Prisma } from '@prisma/client';

export class ApartmentService {
  
  /**
   * Get a list of apartments with optional filtering and pagination
   */
  async getApartments(
    filters: ApartmentFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<ApartmentListItem>> {
    
    const {
      search,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      district,
      compoundId,
      amenityIds,
      finished,
      minSize,
      maxSize
    } = filters;

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = pagination;

    // Build where clause
    const where: Prisma.ApartmentWhereInput = {
      isActive: true,
      ...(listingType && { listingType }),
      ...(minPrice && { price: { gte: minPrice } }),
      ...(maxPrice && { price: { lte: maxPrice } }),
      ...(minPrice && maxPrice && { price: { gte: minPrice, lte: maxPrice } }),
      ...(bedrooms && { bedrooms }),
      ...(bathrooms && { bathrooms }),
      ...(finished !== undefined && { finished }),
      ...(minSize && { sizeSqm: { gte: minSize } }),
      ...(maxSize && { sizeSqm: { lte: maxSize } }),
      ...(compoundId && { compoundId }),
      
      // Compound filters
      ...(city || district) && {
        compound: {
          ...(city && { city: { contains: city, mode: 'insensitive' } }),
          ...(district && { district: { contains: district, mode: 'insensitive' } })
        }
      },

      // Search across title, description, and compound name
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { referenceNumber: { contains: search, mode: 'insensitive' } },
          { unitNumber: { contains: search, mode: 'insensitive' } },
          { 
            compound: { 
              name: { contains: search, mode: 'insensitive' } 
            } 
          }
        ]
      }),

      // Amenity filters
      ...(amenityIds && amenityIds.length > 0 && {
        amenities: {
          some: {
            amenityId: { in: amenityIds }
          }
        }
      })
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.apartment.count({ where });

    // Get apartments with relations
    const apartments = await prisma.apartment.findMany({
      where,
      include: {
        compound: {
          select: {
            id: true,
            name: true,
            city: true,
            district: true
          }
        },
        images: {
          select: {
            id: true,
            url: true,
            altText: true,
            position: true
          },
          orderBy: { position: 'asc' }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: apartments as ApartmentListItem[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get apartment details by ID
   */
  async getApartmentById(id: number): Promise<ApartmentWithDetails | null> {
    const apartment = await prisma.apartment.findUnique({
      where: { id, isActive: true },
      include: {
        compound: true,
        images: {
          orderBy: { position: 'asc' }
        },
        amenities: {
          include: {
            amenity: true
          }
        }
      }
    });

    return apartment as ApartmentWithDetails | null;
  }

  /**
   * Create new apartment
   */
  async createApartment(data: CreateApartmentRequest): Promise<ApartmentWithDetails> {
    const { amenityIds, images, ...apartmentData } = data;

    // Create apartment with relations in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the apartment
      const apartment = await tx.apartment.create({
        data: {
          ...apartmentData,
          // Connect amenities if provided
          ...(amenityIds && amenityIds.length > 0 && {
            amenities: {
              create: amenityIds.map(amenityId => ({
                amenityId
              }))
            }
          }),
          // Create images if provided
          ...(images && images.length > 0 && {
            images: {
              create: images.map((image, index) => ({
                url: image.url,
                altText: image.altText,
                position: image.position ?? index
              }))
            }
          })
        },
        include: {
          compound: true,
          images: {
            orderBy: { position: 'asc' }
          },
          amenities: {
            include: {
              amenity: true
            }
          }
        }
      });

      return apartment;
    });

    return result as ApartmentWithDetails;
  }

  /**
   * Get all available amenities
   */
  async getAmenities() {
    return prisma.amenity.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Get all compounds (for compound filter dropdown)
   */
  async getCompounds() {
    return prisma.compound.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        district: true
      },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Get apartment statistics (for dashboard/overview)
   */
  async getStatistics() {
    const [
      totalApartments,
      rentApartments,
      saleApartments,
      averagePrice
    ] = await Promise.all([
      prisma.apartment.count({ where: { isActive: true } }),
      prisma.apartment.count({ where: { isActive: true, listingType: 'rent' } }),
      prisma.apartment.count({ where: { isActive: true, listingType: 'sale' } }),
      prisma.apartment.aggregate({
        where: { isActive: true },
        _avg: { price: true }
      })
    ]);

    return {
      totalApartments,
      rentApartments,
      saleApartments,
      averagePrice: averagePrice._avg.price || 0
    };
  }
}
