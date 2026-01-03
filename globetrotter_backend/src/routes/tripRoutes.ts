import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/index.js';
import { validate } from '../middleware/index.js';
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  shareTrip,
  getSharedTrip,
  addCityToTrip,
  removeCityFromTrip,
  addActivityToCity,
  removeActivityFromCity,
  createTripValidation,
  updateTripValidation
} from '../controllers/tripController.js';

const router = Router();

// Trip CRUD
router.get('/', authenticate, getAllTrips);
router.get('/:id', authenticate, getTripById);
router.post('/', authenticate, createTripValidation, validate, createTrip);
router.put('/:id', authenticate, updateTripValidation, validate, updateTrip);
router.delete('/:id', authenticate, deleteTrip);

// Sharing
router.post('/:id/share', authenticate, shareTrip);
router.get('/shared/:shareUrl', optionalAuth, getSharedTrip);

// Cities management
router.post('/:id/cities', authenticate, addCityToTrip);
router.delete('/:id/cities/:cityId', authenticate, removeCityFromTrip);

// Activities management
router.post('/:id/cities/:cityId/activities', authenticate, addActivityToCity);
router.delete('/:id/cities/:cityId/activities/:activityId', authenticate, removeActivityFromCity);

export default router;
