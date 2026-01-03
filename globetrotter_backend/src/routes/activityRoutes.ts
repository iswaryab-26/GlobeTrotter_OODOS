import { Router } from 'express';
import { getAllActivities, getActivityById, searchActivities } from '../controllers/activityController.js';

const router = Router();

router.get('/', getAllActivities);
router.get('/search', searchActivities);
router.get('/:id', getActivityById);

export default router;
