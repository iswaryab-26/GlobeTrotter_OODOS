import { Router } from 'express';
import authRoutes from './authRoutes.js';
import tripRoutes from './tripRoutes.js';
import cityRoutes from './cityRoutes.js';
import activityRoutes from './activityRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/cities', cityRoutes);
router.use('/activities', activityRoutes);

export default router;
