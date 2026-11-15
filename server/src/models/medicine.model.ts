import { Schema, model, Document, Types } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  genericName: string;
  price: number;
  mrp?: number;
  stock: number;
  minStockAlert: number;
  expiryDate: string;
  batchNumber: string;
  rackLocation: string;
  category: 'all' | 'low-stock' | 'near-expiry' | 'cold-chain' | 'schedule-h';
  isColdChain: boolean;
  requiresPrescription: boolean;
  pharmacyId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      required: [true, 'Generic/salt formulation is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price cannot be negative'],
    },
    mrp: {
      type: Number,
      min: [0, 'MRP cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    minStockAlert: {
      type: Number,
      default: 20,
    },
    expiryDate: {
      type: String,
      required: [true, 'Expiry date is required'],
      trim: true,
    },
    batchNumber: {
      type: String,
      trim: true,
      default: () => `BT-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    rackLocation: {
      type: String,
      trim: true,
      default: 'Rack A-01',
    },
    category: {
      type: String,
      enum: ['all', 'low-stock', 'near-expiry', 'cold-chain', 'schedule-h'],
      default: 'all',
    },
    isColdChain: {
      type: Boolean,
      default: false,
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    pharmacyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pharmacy owner ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for powerful fuzzy and text search
medicineSchema.index({ name: 'text', genericName: 'text' });

export const Medicine = model<IMedicine>('Medicine', medicineSchema);
export default Medicine;
