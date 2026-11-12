import { Router } from 'express';
import { register } from '../controllers/auth/register.controller.js';
import { login } from '../controllers/auth/login.controller.js';
import { logout } from '../controllers/auth/logout.controller.js';
import { refreshToken } from '../controllers/auth/refresh.controller.js';
import { getProfile } from '../controllers/auth/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout); // gagamit ng authMiddleware para verified na logged-in user ang nagla-logout
router.post('/refresh', refreshToken);
router.get('/me', authMiddleware, getProfile);

export default router;