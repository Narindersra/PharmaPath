import { Router } from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAllPharmacies,
  togglePharmacyVerification,
} from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin routes strictly for ADMIN role
router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/pharmacies', getAllPharmacies);
router.patch('/pharmacies/:id/verify', togglePharmacyVerification);

export default router;
