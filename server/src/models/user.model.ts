import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'CUSTOMER' | 'PHARMACY' | 'ADMIN';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // Pharmacy-specific attributes
  pharmacyName?: string;
  address?: string;
  city?: string;
  phone?: string;
  licenseNumber?: string;
  isVerified?: boolean;
  open24Hours?: boolean;
  closingTime?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type IUserModel = Model<IUser>;

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password in normal queries
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'PHARMACY', 'ADMIN'],
      default: 'CUSTOMER',
    },
    pharmacyName: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: 'Main Market, City Center',
    },
    city: {
      type: String,
      trim: true,
      default: 'New Delhi',
    },
    phone: {
      type: String,
      trim: true,
      default: '+91 98765 43210',
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: 'DL-2026-PH-001',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    open24Hours: {
      type: Boolean,
      default: false,
    },
    closingTime: {
      type: String,
      default: '10:00 PM',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password with bcryptjs
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser, IUserModel>('User', userSchema);
export default User;
