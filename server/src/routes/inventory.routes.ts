import { Router } from 'express';
import {
  getPharmacyInventory,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from '../controllers/inventory.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all inventory routes for Pharmacy Owners and Admins
router.use(authenticate);
router.use(authorizeRoles('PHARMACY', 'ADMIN'));

router.route('/')
  .get(getPharmacyInventory)
  .post(addMedicine);

router.route('/:id')
  .put(updateMedicine)
  .delete(deleteMedicine);

export default router;
