import { User, Trip, City, Activity, Destination } from '@/types';

const STORAGE_KEYS = {
  USER: 'globetrotter_user',
  TRIPS: 'globetrotter_trips',
  AUTH: 'globetrotter_auth',
};

export const storage = {
  // Auth
  getAuth: (): { isLoggedIn: boolean; user: User | null } => {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : { isLoggedIn: false, user: null };
  },

  setAuth: (isLoggedIn: boolean, user: User | null) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isLoggedIn, user }));
  },

  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // User
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  updateUser: (updates: Partial<User>) => {
    const user = storage.getUser();
    if (user) {
      const updated = { ...user, ...updates };
      storage.setUser(updated);
      return updated;
    }
    return null;
  },

  // Trips
  getTrips: (): Trip[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return data ? JSON.parse(data) : [];
  },

  setTrips: (trips: Trip[]) => {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  },

  addTrip: (trip: Trip) => {
    const trips = storage.getTrips();
    trips.push(trip);
    storage.setTrips(trips);
    return trip;
  },

  updateTrip: (tripId: string, updates: Partial<Trip>): Trip | null => {
    const trips = storage.getTrips();
    const index = trips.findIndex(t => t.id === tripId);
    if (index !== -1) {
      trips[index] = { ...trips[index], ...updates, updatedAt: new Date() };
      storage.setTrips(trips);
      return trips[index];
    }
    return null;
  },

  deleteTrip: (tripId: string): boolean => {
    const trips = storage.getTrips();
    const filtered = trips.filter(t => t.id !== tripId);
    if (filtered.length !== trips.length) {
      storage.setTrips(filtered);
      return true;
    }
    return false;
  },

  getTrip: (tripId: string): Trip | null => {
    const trips = storage.getTrips();
    return trips.find(t => t.id === tripId) || null;
  },

  // Initialize with mock data
  initializeWithMockData: (trips: Trip[], user: User) => {
    if (storage.getTrips().length === 0) {
      storage.setTrips(trips);
    }
    if (!storage.getUser()) {
      storage.setUser(user);
    }
  },
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
