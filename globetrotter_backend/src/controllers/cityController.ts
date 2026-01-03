import { Response, Request } from 'express';
import { City } from '../models/index.js';

export const getAllCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, country, limit = 50 } = req.query;
    
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search as string };
    }
    
    if (country) {
      query.country = country;
    }

    const cities = await City.find(query)
      .sort({ popularity: -1 })
      .limit(Number(limit));

    res.json(cities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await City.findOne({ id: req.params.id });

    if (!city) {
      res.status(404).json({ error: 'City not found' });
      return;
    }

    res.json(city);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const searchCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, costIndex, minRating } = req.query;
    
    let query: any = {};
    
    if (q) {
      query.$text = { $search: q as string };
    }
    
    if (costIndex) {
      query.costIndex = costIndex;
    }
    
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    const cities = await City.find(query)
      .sort({ popularity: -1, rating: -1 })
      .limit(50);

    res.json(cities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
