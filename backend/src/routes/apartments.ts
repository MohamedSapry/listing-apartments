/**
 * Apartment API Routes
 * 
 * This defines all the URL endpoints for apartment-related operations
 * and connects them to the appropriate controller methods.
 */

import { Router } from 'express';
import { ApartmentController } from '../controllers/apartmentController';

const router = Router();
const apartmentController = new ApartmentController();

// Get list of apartments with optional filtering
router.get('/', apartmentController.getApartments);

// Get all available amenities
router.get('/amenities', apartmentController.getAmenities);

// Get all compounds/projects
router.get('/compounds', apartmentController.getCompounds);

// Get apartment statistics
router.get('/statistics', apartmentController.getStatistics);

// Get specific apartment details by ID
router.get('/:id', apartmentController.getApartmentById);

// Create a new apartment listing
router.post('/', apartmentController.createApartment);

export default router;
