import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  id: string;
  name: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation' | 'shopping' | 'nightlife';
  description: string;
  duration: number;
  cost: number;
  image: string;
  cityId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
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
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'nightlife'],
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  cityId: {
    type: String,
    required: true,
    index: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
ActivitySchema.index({ name: 'text', description: 'text' });
ActivitySchema.index({ cityId: 1, category: 1 });
ActivitySchema.index({ cost: 1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
