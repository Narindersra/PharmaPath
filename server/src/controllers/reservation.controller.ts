import { Response } from 'express';
import { Reservation, ReservationStatus } from '../models/reservation.model.js';
import { Medicine } from '../models/medicine.model.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * @desc    Create a new medicine reservation hold
 * @route   POST /api/reservations
 * @access  Private (CUSTOMER, ADMIN)
 */
export const createReservation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const customerId = req.user!._id;
    const { medicineId, quantity = 1, notes } = req.body;

    if (!medicineId) {
      res.status(400).json({
        success: false,
        message: 'Medicine ID is required to create a reservation',
      });
      return;
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const medicine = await Medicine.findById(medicineId).populate('pharmacyId');
    if (!medicine) {
      res.status(404).json({
        success: false,
        message: 'Medicine not found in dispensary catalog',
      });
      return;
    }

    if (medicine.stock < qty) {
      res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${medicine.stock} units available at this pharmacy.`,
      });
      return;
    }

    // Generate unique Token & SMS PIN
    const token = `TKN-${Math.floor(1000 + Math.random() * 9000)}`;
    const smsPin = `${Math.floor(1000 + Math.random() * 9000)}`;
    const counterNumber = `Counter ${Math.floor(1 + Math.random() * 3)}`;

    const reservation = await Reservation.create({
      customerId,
      pharmacyId: medicine.pharmacyId,
      medicineId: medicine._id,
      quantity: qty,
      unitPrice: medicine.price,
      totalPrice: medicine.price * qty,
      status: 'PENDING',
      token,
      smsPin,
      counterNumber,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      notes: notes || '',
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('medicineId', 'name genericName price mrp isColdChain requiresPrescription rackLocation')
      .populate('pharmacyId', 'name pharmacyName address city phone isVerified open24Hours closingTime rating');

    res.status(201).json({
      success: true,
      message: 'Reservation hold confirmed for 2 hours with instant pickup counter pass',
      data: populatedReservation,
    });
  } catch (error) {
    console.error('[Reservation Controller - createReservation Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to create reservation',
    });
  }
};

/**
 * @desc    Get active and history reservations for current logged-in customer
 * @route   GET /api/reservations/customer
 * @access  Private (CUSTOMER, ADMIN)
 */
export const getCustomerReservations = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const customerId = req.user!._id;

    // Auto-update expired holds
    await Reservation.updateMany(
      {
        customerId,
        status: 'CONFIRMED',
        expiresAt: { $lt: new Date() },
      },
      { status: 'EXPIRED' }
    );

    const reservations = await Reservation.find({ customerId })
      .populate('medicineId', 'name genericName price mrp isColdChain requiresPrescription batchNumber rackLocation')
      .populate('pharmacyId', 'name pharmacyName address city phone isVerified open24Hours closingTime rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error('[Reservation Controller - getCustomerReservations Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to retrieve reservations',
    });
  }
};

/**
 * @desc    Get reservations for current logged-in pharmacy owner
 * @route   GET /api/reservations/pharmacy
 * @access  Private (PHARMACY, ADMIN)
 */
export const getPharmacyReservations = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const pharmacyId = req.user!._id;
    const { status } = req.query;

    const filter: Record<string, unknown> = { pharmacyId };
    if (status && typeof status === 'string' && status !== 'all') {
      filter.status = status.toUpperCase();
    }

    const reservations = await Reservation.find(filter)
      .populate('customerId', 'name email phone')
      .populate('medicineId', 'name genericName price mrp stock batchNumber rackLocation isColdChain')
      .sort({ createdAt: -1 });

    const activeHoldsCount = await Reservation.countDocuments({
      pharmacyId,
      status: 'CONFIRMED',
      expiresAt: { $gt: new Date() },
    });

    res.status(200).json({
      success: true,
      count: reservations.length,
      activeHoldsCount,
      data: reservations,
    });
  } catch (error) {
    console.error('[Reservation Controller - getPharmacyReservations Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to retrieve pharmacy reservations',
    });
  }
};

/**
 * @desc    Update reservation status (Confirm, Reject, Collected)
 * @route   PATCH /api/reservations/:id/status
 * @access  Private (PHARMACY, ADMIN)
 */
export const updateReservationStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pharmacyId = req.user!._id;

    const allowedStatuses: ReservationStatus[] = [
      'PENDING',
      'CONFIRMED',
      'COLLECTED',
      'REJECTED',
      'CANCELLED',
    ];

    if (!status || !allowedStatuses.includes(status.toUpperCase() as ReservationStatus)) {
      res.status(400).json({
        success: false,
        message: `Valid status required: [${allowedStatuses.join(', ')}]`,
      });
      return;
    }

    const nextStatus = status.toUpperCase() as ReservationStatus;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
      return;
    }

    // Verify ownership
    if (
      reservation.pharmacyId.toString() !== pharmacyId.toString() &&
      req.user!.role !== 'ADMIN'
    ) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this reservation hold.',
      });
      return;
    }

    const previousStatus = reservation.status;

    // Handle inventory adjustments based on state transitions
    if (
      previousStatus === 'CONFIRMED' &&
      (nextStatus === 'REJECTED' || nextStatus === 'CANCELLED')
    ) {
      // Restore inventory if previously confirmed hold is rejected/cancelled
      const medicine = await Medicine.findById(reservation.medicineId);
      if (medicine) {
        medicine.stock += reservation.quantity;
        await medicine.save();
      }
    } else if (
      (previousStatus === 'PENDING' || previousStatus === 'REJECTED') &&
      nextStatus === 'CONFIRMED'
    ) {
      // Deduct inventory when moving into confirmed
      const medicine = await Medicine.findById(reservation.medicineId);
      if (medicine) {
        if (medicine.stock < reservation.quantity) {
          res.status(400).json({
            success: false,
            message: `Insufficient inventory stock to confirm. Available: ${medicine.stock}`,
          });
          return;
        }
        medicine.stock -= reservation.quantity;
        await medicine.save();
      }
    }

    reservation.status = nextStatus;
    await reservation.save();

    const updated = await Reservation.findById(id)
      .populate('customerId', 'name email phone')
      .populate('medicineId', 'name genericName price mrp stock batchNumber rackLocation');

    res.status(200).json({
      success: true,
      message: `Reservation status updated to ${nextStatus}`,
      data: updated,
    });
  } catch (error) {
    console.error('[Reservation Controller - updateReservationStatus Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to update reservation status',
    });
  }
};

/**
 * @desc    Customer cancels their own reservation hold
 * @route   DELETE /api/reservations/:id
 * @access  Private (CUSTOMER, ADMIN)
 */
export const cancelReservation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const customerId = req.user!._id;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
      return;
    }

    if (
      reservation.customerId.toString() !== customerId.toString() &&
      req.user!.role !== 'ADMIN'
    ) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only cancel your own reservations.',
      });
      return;
    }

    if (reservation.status === 'COLLECTED') {
      res.status(400).json({
        success: false,
        message: 'Cannot cancel an order that has already been collected.',
      });
      return;
    }

    // Restore stock if it was confirmed
    if (reservation.status === 'CONFIRMED') {
      const medicine = await Medicine.findById(reservation.medicineId);
      if (medicine) {
        medicine.stock += reservation.quantity;
        await medicine.save();
      }
    }

    reservation.status = 'CANCELLED';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation hold successfully cancelled and inventory released.',
      data: reservation,
    });
  } catch (error) {
    console.error('[Reservation Controller - cancelReservation Error]:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to cancel reservation',
    });
  }
};
