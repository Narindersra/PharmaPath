import { Response } from 'express';
import { User } from '../models/user.model.js';
import { Medicine } from '../models/medicine.model.js';
import { Reservation } from '../models/reservation.model.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * @desc    Get comprehensive platform telemetry and metrics for Admin
 * @route   GET /api/admin/stats
 * @access  Private (ADMIN)
 */
export const getAdminStats = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: 'CUSTOMER' });
    const pharmacyCount = await User.countDocuments({ role: 'PHARMACY' });
    const verifiedPharmacyCount = await User.countDocuments({ role: 'PHARMACY', isVerified: true });

    const totalMedicines = await Medicine.countDocuments();
    const allMedicines = await Medicine.find().select('stock price');
    const totalStockUnits = allMedicines.reduce((acc, m) => acc + m.stock, 0);
    const totalInventoryValue = allMedicines.reduce((acc, m) => acc + m.stock * m.price, 0);

    const totalReservations = await Reservation.countDocuments();
    const activeReservations = await Reservation.countDocuments({
      status: 'CONFIRMED',
      expiresAt: { $gt: new Date() },
    });
    const collectedReservations = await Reservation.countDocuments({ status: 'COLLECTED' });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          customers: customerCount,
          pharmacies: pharmacyCount,
          verifiedPharmacies: verifiedPharmacyCount,
        },
        inventory: {
          totalMedicines,
          totalStockUnits,
          totalInventoryValue,
        },
        reservations: {
          total: totalReservations,
          activeHolds: activeReservations,
          collected: collectedReservations,
        },
      },
    });
  } catch (error) {
    console.error('[Admin Controller - getAdminStats Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to retrieve admin stats',
    });
  }
};

/**
 * @desc    Get all registered users
 * @route   GET /api/admin/users
 * @access  Private (ADMIN)
 */
export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.query;
    const filter: Record<string, unknown> = {};

    if (role && typeof role === 'string' && role !== 'all') {
      filter.role = role.toUpperCase();
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('[Admin Controller - getAllUsers Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to retrieve users',
    });
  }
};

/**
 * @desc    Get all pharmacies with inventory and verification stats
 * @route   GET /api/admin/pharmacies
 * @access  Private (ADMIN)
 */
export const getAllPharmacies = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const pharmacies = await User.find({ role: 'PHARMACY' })
      .select('-password')
      .sort({ createdAt: -1 });

    const pharmacyListWithMetrics = await Promise.all(
      pharmacies.map(async (ph) => {
        const medicineCount = await Medicine.countDocuments({ pharmacyId: ph._id });
        const reservationCount = await Reservation.countDocuments({ pharmacyId: ph._id });

        return {
          id: ph._id,
          name: ph.name,
          email: ph.email,
          pharmacyName: ph.pharmacyName || ph.name,
          address: ph.address,
          city: ph.city,
          phone: ph.phone,
          licenseNumber: ph.licenseNumber,
          isVerified: ph.isVerified,
          rating: ph.rating,
          medicineCount,
          reservationCount,
          createdAt: ph.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: pharmacyListWithMetrics.length,
      data: pharmacyListWithMetrics,
    });
  } catch (error) {
    console.error('[Admin Controller - getAllPharmacies Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to retrieve pharmacies',
    });
  }
};

/**
 * @desc    Toggle pharmacy verification status
 * @route   PATCH /api/admin/pharmacies/:id/verify
 * @access  Private (ADMIN)
 */
export const togglePharmacyVerification = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const pharmacy = await User.findOne({ _id: id, role: 'PHARMACY' });
    if (!pharmacy) {
      res.status(404).json({
        success: false,
        message: 'Pharmacy not found',
      });
      return;
    }

    pharmacy.isVerified = isVerified !== undefined ? Boolean(isVerified) : !pharmacy.isVerified;
    await pharmacy.save();

    res.status(200).json({
      success: true,
      message: `Pharmacy ${pharmacy.isVerified ? 'verified' : 'unverified'} successfully`,
      data: {
        id: pharmacy._id,
        name: pharmacy.name,
        pharmacyName: pharmacy.pharmacyName,
        isVerified: pharmacy.isVerified,
      },
    });
  } catch (error) {
    console.error('[Admin Controller - togglePharmacyVerification Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to toggle pharmacy verification',
    });
  }
};
