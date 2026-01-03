export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  language: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  name: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation' | 'shopping' | 'nightlife';
  description: string;
  duration: number; // in hours
  cost: number;
  image: string;
  time?: string;
  cityId: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  state?: string;
  image: string;
  popularity: number;
  costIndex: 'budget' | 'moderate' | 'expensive' | 'luxury';
  startDate?: string;
  endDate?: string;
  activities: Activity[];
}

export interface CostBreakdown {
  stay: number;
  transport: number;
  activities: number;
  meals: number;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  cities: City[];
  budget: number;
  costBreakdown: CostBreakdown;
  isPublic: boolean;
  shareUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  rating: number;
  priceRange: string;
}
