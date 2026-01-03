import { Response, Request } from 'express';
import { Activity } from '../models/index.js';

export const getAllActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cityId, category, maxCost, search, limit = 50 } = req.query;
    
    let query: any = {};
    
    if (cityId) {
      query.cityId = cityId;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (maxCost) {
      query.cost = { $lte: Number(maxCost) };
    }
    
    if (search) {
      query.$text = { $search: search as string };
    }

    const activities = await Activity.find(query)
      .sort({ rating: -1 })
      .limit(Number(limit));

    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const activity = await Activity.findOne({ id: req.params.id });

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.json(activity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const searchActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, cityId, category, minRating, maxCost } = req.query;
    
    let query: any = {};
    
    if (q) {
      query.$text = { $search: q as string };
    }
    
    if (cityId) {
      query.cityId = cityId;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    
    if (maxCost) {
      query.cost = { $lte: Number(maxCost) };
    }

    const activities = await Activity.find(query)
      .sort({ rating: -1, cost: 1 })
      .limit(100);

    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
