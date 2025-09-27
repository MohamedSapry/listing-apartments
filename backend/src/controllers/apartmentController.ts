/**
 * Apartment Controller
 * 
 * This handles all HTTP requests related to apartments and
 * transforms them into appropriate responses for the frontend.
 */

import { Request, Response, NextFunction } from 'express';
import { ApartmentService } from '../services/apartmentService';
import { ApiResponse, ApartmentFilters, PaginationParams } from '../types/api';

const apartmentService = new ApartmentService();

export class ApartmentController {

  /**
   * GET /api/apartments - Get list of apartments with optional filters
   */
  async getApartments(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        // Search and filters
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
        maxSize,
        // Pagination
        page,
        limit,
        sortBy,
        sortOrder
      } = req.query;

      // Parse filters
      const filters: ApartmentFilters = {
        ...(search && { search: search as string }),
        ...(listingType && { listingType: listingType as 'rent' | 'sale' }),
        ...(minPrice && { minPrice: parseFloat(minPrice as string) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice as string) }),
        ...(bedrooms && { bedrooms: parseInt(bedrooms as string) }),
        ...(bathrooms && { bathrooms: parseInt(bathrooms as string) }),
        ...(city && { city: city as string }),
        ...(district && { district: district as string }),
        ...(compoundId && { compoundId: parseInt(compoundId as string) }),
        ...(amenityIds && { 
          amenityIds: Array.isArray(amenityIds) 
            ? amenityIds.map(id => parseInt(id as string))
            : [parseInt(amenityIds as string)]
        }),
        ...(finished !== undefined && { finished: finished === 'true' }),
        ...(minSize && { minSize: parseInt(minSize as string) }),
        ...(maxSize && { maxSize: parseInt(maxSize as string) })
      };

      // Parse pagination
      const pagination: PaginationParams = {
        ...(page && { page: parseInt(page as string) }),
        ...(limit && { limit: parseInt(limit as string) }),
        ...(sortBy && { sortBy: sortBy as any }),
        ...(sortOrder && { sortOrder: sortOrder as 'asc' | 'desc' })
      };

      const result = await apartmentService.getApartments(filters, pagination);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: `Found ${result.data.length} apartments`
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/apartments/:id - Get detailed information about one apartment
   */
  async getApartmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const apartmentId = parseInt(id);

      if (isNaN(apartmentId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid apartment ID',
          message: 'Apartment ID must be a valid number'
        });
      }

      const apartment = await apartmentService.getApartmentById(apartmentId);

      if (!apartment) {
        return res.status(404).json({
          success: false,
          error: 'Apartment not found',
          message: `Apartment with ID ${apartmentId} not found`
        });
      }

      const response: ApiResponse = {
        success: true,
        data: apartment,
        message: 'Apartment details retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/apartments - Create a new apartment listing
   */
  async createApartment(req: Request, res: Response, next: NextFunction) {
    try {
      const apartmentData = req.body;

      // Basic validation
      if (!apartmentData.title || !apartmentData.referenceNumber || !apartmentData.compoundId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Title, reference number, and compound ID are required'
        });
      }

      const apartment = await apartmentService.createApartment(apartmentData);

      const response: ApiResponse = {
        success: true,
        data: apartment,
        message: 'Apartment created successfully'
      };

      res.status(201).json(response);
    } catch (error: any) {
      // Handle Prisma unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Duplicate reference number',
          message: 'An apartment with this reference number already exists'
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/apartments/amenities
   * Get all available amenities
   */
  async getAmenities(req: Request, res: Response, next: NextFunction) {
    try {
      const amenities = await apartmentService.getAmenities();

      const response: ApiResponse = {
        success: true,
        data: amenities,
        message: 'Amenities retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/apartments/compounds
   * Get all compounds for filter dropdown
   */
  async getCompounds(req: Request, res: Response, next: NextFunction) {
    try {
      const compounds = await apartmentService.getCompounds();

      const response: ApiResponse = {
        success: true,
        data: compounds,
        message: 'Compounds retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/apartments/statistics
   * Get apartment statistics for dashboard
   */
  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await apartmentService.getStatistics();

      const response: ApiResponse = {
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
