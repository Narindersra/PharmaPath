import { Router } from 'express';
import { searchMedicines, getMedicineById } from '../controllers/medicine.controller.js';

const router = Router();

// Public medicine routes
router.get('/search', searchMedicines);
router.get('/:id', getMedicineById);

export default router;
