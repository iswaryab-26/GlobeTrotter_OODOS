import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  rating: number;
  priceRange: string;
  popularity: number;
  costIndex: 'budget' | 'moderate' | 'expensive' | 'luxury';
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  country: {
    type: String,
    required: true,
    index: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  priceRange: {
    type: String,
    default: '$$'
  },
  popularity: {
    type: Number,
    default: 0
  },
  costIndex: {
    type: String,
    enum: ['budget', 'moderate', 'expensive', 'luxury'],
    default: 'moderate'
  }
}, {
  timestamps: true
});

// Indexes for search
CitySchema.index({ name: 'text', country: 'text', description: 'text' });
CitySchema.index({ popularity: -1 });

export const City = mongoose.model<ICity>('City', CitySchema);
