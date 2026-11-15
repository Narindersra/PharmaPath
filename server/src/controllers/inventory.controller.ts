import { Response } from 'express';
import { Medicine } from '../models/medicine.model.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * @desc    Get all inventory medicines for the logged-in pharmacy
 * @route   GET /api/inventory
 * @access  Private (PHARMACY, ADMIN)
 */
export const getPharmacyInventory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const pharmacyId = req.user!._id;
    const { search, category, sort } = req.query;

    const queryFilter: Record<string, unknown> = { pharmacyId };

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      queryFilter.$or = [
        { name: searchRegex },
        { genericName: searchRegex },
        { batchNumber: searchRegex },
        { rackLocation: searchRegex },
      ];
    }

    if (category && typeof category === 'string' && category !== 'all') {
      if (category === 'low-stock') {
        queryFilter.$expr = { $lt: ['$stock', '$minStockAlert'] };
      } else if (category === 'cold-chain') {
        queryFilter.isColdChain = true;
      } else if (category === 'schedule-h') {
        queryFilter.requiresPrescription = true;
      } else {
        queryFilter.category = category;
      }
    }

    let sortOption: Record<string, 1 | -1> = { updatedAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'stock_asc') sortOption = { stock: 1 };

    const medicines = await Medicine.find(queryFilter).sort(sortOption);

    // Compute aggregated stats
    const allMedicines = await Medicine.find({ pharmacyId });
    const totalSKUs = allMedicines.length;
    const totalStockUnits = allMedicines.reduce((acc, m) => acc + m.stock, 0);
    const totalInventoryValue = allMedicines.reduce((acc, m) => acc + m.stock * m.price, 0);
    const lowStockCount = allMedicines.filter((m) => m.stock < (m.minStockAlert || 20)).length;

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
      stats: {
        totalSKUs,
        totalStockUnits,
        totalInventoryValue,
        lowStockCount,
      },
    });
  } catch (error) {
    console.error('[Inventory Controller - getPharmacyInventory Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to retrieve inventory items',
    });
  }
};

/**
 * @desc    Add a new medicine to inventory
 * @route   POST /api/inventory
 * @access  Private (PHARMACY, ADMIN)
 */
export const addMedicine = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const pharmacyId = req.user!._id;
    const {
      name,
      genericName,
      price,
      mrp,
      stock,
      minStockAlert,
      expiryDate,
      batchNumber,
      rackLocation,
      category,
      isColdChain,
      requiresPrescription,
    } = req.body;

    if (!name || price === undefined || stock === undefined || !expiryDate) {
      res.status(400).json({
        success: false,
        message: 'Name, price, stock, and expiry date are required fields.',
      });
      return;
    }

    const medicine = await Medicine.create({
      name: name.trim(),
      genericName: genericName ? genericName.trim() : 'Pharmaceutical Formulation',
      price: Number(price),
      mrp: mrp ? Number(mrp) : Number(price) * 1.25,
      stock: Number(stock),
      minStockAlert: minStockAlert ? Number(minStockAlert) : 20,
      expiryDate: expiryDate.trim(),
      batchNumber: batchNumber ? batchNumber.trim() : `BT-${Math.floor(1000 + Math.random() * 9000)}`,
      rackLocation: rackLocation ? rackLocation.trim() : 'Rack A-01',
      category: category || (isColdChain ? 'cold-chain' : 'all'),
      isColdChain: Boolean(isColdChain),
      requiresPrescription: Boolean(requiresPrescription),
      pharmacyId,
    });

    res.status(201).json({
      success: true,
      message: 'Medicine successfully added to inventory',
      data: medicine,
    });
  } catch (error) {
    console.error('[Inventory Controller - addMedicine Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to add medicine to inventory',
    });
  }
};

/**
 * @desc    Update an existing medicine in inventory
 * @route   PUT /api/inventory/:id
 * @access  Private (PHARMACY, ADMIN)
 */
export const updateMedicine = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pharmacyId = req.user!._id;

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      res.status(404).json({
        success: false,
        message: 'Medicine not found in inventory',
      });
      return;
    }

    // Ensure pharmacy owner owns this item (or user is admin)
    if (medicine.pharmacyId.toString() !== pharmacyId.toString() && req.user!.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not have permission to modify this item.',
      });
      return;
    }

    const allowedUpdates = [
      'name',
      'genericName',
      'price',
      'mrp',
      'stock',
      'minStockAlert',
      'expiryDate',
      'batchNumber',
      'rackLocation',
      'category',
      'isColdChain',
      'requiresPrescription',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (medicine as any)[field] = req.body[field];
      }
    });

    await medicine.save();

    res.status(200).json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine,
    });
  } catch (error) {
    console.error('[Inventory Controller - updateMedicine Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to update medicine',
    });
  }
};

/**
 * @desc    Delete a medicine from inventory
 * @route   DELETE /api/inventory/:id
 * @access  Private (PHARMACY, ADMIN)
 */
export const deleteMedicine = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pharmacyId = req.user!._id;

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
      return;
    }

    if (medicine.pharmacyId.toString() !== pharmacyId.toString() && req.user!.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not have permission to delete this item.',
      });
      return;
    }

    await Medicine.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully from inventory',
    });
  } catch (error) {
    console.error('[Inventory Controller - deleteMedicine Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to delete medicine',
    });
  }
};
