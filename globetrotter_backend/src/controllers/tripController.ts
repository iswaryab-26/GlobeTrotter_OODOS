import { Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { Trip } from '../models/index.js';
import { AuthRequest } from '../middleware/index.js';

// Validation rules
export const createTripValidation = [
  body('name').trim().notEmpty().withMessage('Trip name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('budget').isNumeric().withMessage('Budget must be a number')
];

export const updateTripValidation = [
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('budget').optional().isNumeric()
];

// Controllers
export const getAllTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTripById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tripData = {
      ...req.body,
      userId: req.userId,
      cities: req.body.cities || [],
      costBreakdown: req.body.costBreakdown || { stay: 0, transport: 0, activities: 0, meals: 0 }
    };

    const trip = new Trip(tripData);
    await trip.save();

    res.status(201).json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const shareTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    if (!trip.shareUrl) {
      trip.shareUrl = uuidv4();
      trip.isPublic = true;
      await trip.save();
    }

    res.json({ shareUrl: trip.shareUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSharedTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({
      shareUrl: req.params.shareUrl,
      isPublic: true
    });

    if (!trip) {
      res.status(404).json({ error: 'Shared trip not found' });
      return;
    }

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addCityToTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    trip.cities.push(req.body);
    trip.updatedAt = new Date();
    await trip.save();

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeCityFromTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    trip.cities = trip.cities.filter((city: any) => city.id !== req.params.cityId);
    trip.updatedAt = new Date();
    await trip.save();

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addActivityToCity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    const city = trip.cities.find((c: any) => c.id === req.params.cityId);
    if (!city) {
      res.status(404).json({ error: 'City not found in trip' });
      return;
    }

    city.activities.push(req.body);
    trip.updatedAt = new Date();
    await trip.save();

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeActivityFromCity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    const city = trip.cities.find((c: any) => c.id === req.params.cityId);
    if (!city) {
      res.status(404).json({ error: 'City not found in trip' });
      return;
    }

    city.activities = city.activities.filter((a: any) => a.id !== req.params.activityId);
    trip.updatedAt = new Date();
    await trip.save();

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
