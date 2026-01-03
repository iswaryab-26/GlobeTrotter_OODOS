import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity {
  id: string;
  name: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation' | 'shopping' | 'nightlife';
  description: string;
  duration: number;
  cost: number;
  image: string;
  time?: string;
  cityId: string;
}

export interface ICity {
  id: string;
  name: string;
  country: string;
  image: string;
  popularity: number;
  costIndex: 'budget' | 'moderate' | 'expensive' | 'luxury';
  startDate?: string;
  endDate?: string;
  activities: IActivity[];
}

export interface ICostBreakdown {
  stay: number;
  transport: number;
  activities: number;
  meals: number;
}

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  coverImage?: string;
  startDate: Date;
  endDate: Date;
  cities: ICity[];
  budget: number;
  costBreakdown: ICostBreakdown;
  isPublic: boolean;
  shareUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'nightlife'],
    required: true
  },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  cost: { type: Number, required: true },
  image: { type: String, required: true },
  time: { type: String },
  cityId: { type: String, required: true }
});

const CitySchema = new Schema<ICity>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String, required: true },
  popularity: { type: Number, required: true },
  costIndex: {
    type: String,
    enum: ['budget', 'moderate', 'expensive', 'luxury'],
    required: true
  },
  startDate: { type: String },
  endDate: { type: String },
  activities: [ActivitySchema]
});

const CostBreakdownSchema = new Schema<ICostBreakdown>({
  stay: { type: Number, default: 0 },
  transport: { type: Number, default: 0 },
  activities: { type: Number, default: 0 },
  meals: { type: Number, default: 0 }
});

const TripSchema = new Schema<ITrip>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  cities: [CitySchema],
  budget: {
    type: Number,
    required: true,
    default: 0
  },
  costBreakdown: {
    type: CostBreakdownSchema,
    default: () => ({ stay: 0, transport: 0, activities: 0, meals: 0 })
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareUrl: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
TripSchema.index({ userId: 1, createdAt: -1 });
TripSchema.index({ isPublic: 1 });

export const Trip = mongoose.model<ITrip>('Trip', TripSchema);
