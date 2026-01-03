import { Router } from 'express';
import { authenticate } from '../middleware/index.js';
import { validate } from '../middleware/index.js';
import {
  register,
  login,
  getProfile,
  updateProfile,
  registerValidation,
  loginValidation
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
