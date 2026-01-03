import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Trip, City, Activity } from '@/types';
import { storage, generateId } from '@/lib/storage';
import { mockTrips, mockCities, mockActivities } from '@/data/mockData';

interface TripContextType {
  trips: Trip[];
  cities: City[];
  activities: Activity[];
  createTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => Trip;
  updateTrip: (tripId: string, updates: Partial<Trip>) => Trip | null;
  deleteTrip: (tripId: string) => boolean;
  getTrip: (tripId: string) => Trip | null;
  addCityToTrip: (tripId: string, city: City) => Trip | null;
  removeCityFromTrip: (tripId: string, cityId: string) => Trip | null;
  reorderCities: (tripId: string, cities: City[]) => Trip | null;
  addActivityToCity: (tripId: string, cityId: string, activity: Activity) => Trip | null;
  removeActivityFromCity: (tripId: string, cityId: string, activityId: string) => Trip | null;
  refreshTrips: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [cities] = useState<City[]>(mockCities);
  const [activities] = useState<Activity[]>(mockActivities);

  const refreshTrips = () => {
    const storedTrips = storage.getTrips();
    if (storedTrips.length === 0) {
      storage.setTrips(mockTrips);
      setTrips(mockTrips);
    } else {
      setTrips(storedTrips);
    }
  };

  useEffect(() => {
    refreshTrips();
  }, []);

  const createTrip = (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Trip => {
    const newTrip: Trip = {
      ...tripData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedTrips = [...trips, newTrip];
    storage.setTrips(updatedTrips);
    setTrips(updatedTrips);
    return newTrip;
  };

  const updateTrip = (tripId: string, updates: Partial<Trip>): Trip | null => {
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) return null;

    const updatedTrip = { ...trips[tripIndex], ...updates, updatedAt: new Date() };
    const updatedTrips = [...trips];
    updatedTrips[tripIndex] = updatedTrip;
    
    storage.setTrips(updatedTrips);
    setTrips(updatedTrips);
    return updatedTrip;
  };

  const deleteTrip = (tripId: string): boolean => {
    const filtered = trips.filter(t => t.id !== tripId);
    if (filtered.length !== trips.length) {
      storage.setTrips(filtered);
      setTrips(filtered);
      return true;
    }
    return false;
  };

  const getTrip = (tripId: string): Trip | null => {
    return trips.find(t => t.id === tripId) || null;
  };

  const addCityToTrip = (tripId: string, city: City): Trip | null => {
    const trip = getTrip(tripId);
    if (!trip) return null;

    const updatedCities = [...trip.cities, { ...city, activities: [] }];
    return updateTrip(tripId, { cities: updatedCities });
  };

  const removeCityFromTrip = (tripId: string, cityId: string): Trip | null => {
    const trip = getTrip(tripId);
    if (!trip) return null;

    const updatedCities = trip.cities.filter(c => c.id !== cityId);
    return updateTrip(tripId, { cities: updatedCities });
  };

  const reorderCities = (tripId: string, newCities: City[]): Trip | null => {
    return updateTrip(tripId, { cities: newCities });
  };

  const addActivityToCity = (tripId: string, cityId: string, activity: Activity): Trip | null => {
    const trip = getTrip(tripId);
    if (!trip) return null;

    const updatedCities = trip.cities.map(city => {
      if (city.id === cityId) {
        return { ...city, activities: [...city.activities, activity] };
      }
      return city;
    });

    return updateTrip(tripId, { cities: updatedCities });
  };

  const removeActivityFromCity = (tripId: string, cityId: string, activityId: string): Trip | null => {
    const trip = getTrip(tripId);
    if (!trip) return null;

    const updatedCities = trip.cities.map(city => {
      if (city.id === cityId) {
        return { ...city, activities: city.activities.filter(a => a.id !== activityId) };
      }
      return city;
    });

    return updateTrip(tripId, { cities: updatedCities });
  };

  return (
    <TripContext.Provider value={{
      trips,
      cities,
      activities,
      createTrip,
      updateTrip,
      deleteTrip,
      getTrip,
      addCityToTrip,
      removeCityFromTrip,
      reorderCities,
      addActivityToCity,
      removeActivityFromCity,
      refreshTrips,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
