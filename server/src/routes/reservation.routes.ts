import { Router } from 'express';
import {
  createReservation,
  getCustomerReservations,
  getPharmacyReservations,
  updateReservationStatus,
  cancelReservation,
} from '../controllers/reservation.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

// All reservation routes require authentication
router.use(authenticate);

// Customer reservation endpoints
router.post('/', authorizeRoles('CUSTOMER', 'ADMIN'), createReservation);
router.get('/customer', authorizeRoles('CUSTOMER', 'ADMIN'), getCustomerReservations);
router.delete('/:id', authorizeRoles('CUSTOMER', 'ADMIN'), cancelReservation);

// Pharmacy reservation endpoints
router.get('/pharmacy', authorizeRoles('PHARMACY', 'ADMIN'), getPharmacyReservations);
router.patch('/:id/status', authorizeRoles('PHARMACY', 'ADMIN'), updateReservationStatus);

export default router;
