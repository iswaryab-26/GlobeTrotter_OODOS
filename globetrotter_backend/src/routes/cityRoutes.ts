import { Router } from 'express';
import { getAllCities, getCityById, searchCities } from '../controllers/cityController.js';

const router = Router();

router.get('/', getAllCities);
router.get('/search', searchCities);
router.get('/:id', getCityById);

export default router;
