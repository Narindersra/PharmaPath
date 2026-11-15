import { Schema, model, Document, Types } from 'mongoose';

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COLLECTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface IReservation extends Document {
  customerId: Types.ObjectId;
  pharmacyId: Types.ObjectId;
  medicineId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: ReservationStatus;
  token: string;
  smsPin: string;
  counterNumber: string;
  expiresAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
      index: true,
    },
    pharmacyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pharmacy ID is required'],
      index: true,
    },
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: [true, 'Medicine ID is required'],
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COLLECTED', 'REJECTED', 'CANCELLED', 'EXPIRED'],
      default: 'CONFIRMED',
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => `TKN-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    smsPin: {
      type: String,
      required: true,
      trim: true,
      default: () => `${Math.floor(1000 + Math.random() * 9000)}`,
    },
    counterNumber: {
      type: String,
      default: 'Counter 2',
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Default hold window: 2 hours from reservation time
      default: () => new Date(Date.now() + 2 * 60 * 60 * 1000),
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Reservation = model<IReservation>('Reservation', reservationSchema);
export default Reservation;
