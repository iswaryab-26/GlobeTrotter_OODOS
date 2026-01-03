import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  MapPin, 
  Calendar,
  Save,
  ArrowLeft,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { CityCard } from '@/components/CityCard';
import { ActivityCard } from '@/components/ActivityCard';
import { useTrips } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { City, Activity } from '@/types';
import { format } from 'date-fns';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTrip, updateTrip, cities: allCities, activities: allActivities } = useTrips();
  const { toast } = useToast();
  
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [showActivitySearch, setShowActivitySearch] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');

  const trip = getTrip(tripId || '');

  if (!trip) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
          <Link to="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddCity = (city: City) => {
    const updatedCities = [...trip.cities, { ...city, activities: [] }];
    updateTrip(trip.id, { cities: updatedCities });
    setShowCitySearch(false);
    setCitySearch('');
    // Automatically open activity dropdown for the newly added city
    setShowActivitySearch(city.id);
    toast({ title: `${city.name} added to your trip! Select tourist places below.` });
  };

  const handleRemoveCity = (cityId: string) => {
    const updatedCities = trip.cities.filter(c => c.id !== cityId);
    updateTrip(trip.id, { cities: updatedCities });
    toast({ title: 'City removed' });
  };

  const handleAddActivity = (cityId: string, activity: Activity) => {
    const updatedCities = trip.cities.map(city => {
      if (city.id === cityId) {
        return { ...city, activities: [...city.activities, activity] };
      }
      return city;
    });
    
    // Calculate total activity cost
    const totalActivityCost = updatedCities.reduce((sum, c) => 
      sum + c.activities.reduce((aSum, a) => aSum + a.cost, 0), 0
    );
    
    updateTrip(trip.id, { 
      cities: updatedCities,
      costBreakdown: {
        ...trip.costBreakdown,
        activities: totalActivityCost,
      },
    });
    
    toast({ title: `${activity.name} added! Cost: ₹${activity.cost.toLocaleString('en-IN')}` });
  };

  const handleRemoveActivity = (cityId: string, activityId: string) => {
    const updatedCities = trip.cities.map(city => {
      if (city.id === cityId) {
        return { ...city, activities: city.activities.filter(a => a.id !== activityId) };
      }
      return city;
    });
    
    // Recalculate total activity cost
    const totalActivityCost = updatedCities.reduce((sum, c) => 
      sum + c.activities.reduce((aSum, a) => aSum + a.cost, 0), 0
    );
    
    updateTrip(trip.id, { 
      cities: updatedCities,
      costBreakdown: {
        ...trip.costBreakdown,
        activities: totalActivityCost,
      },
    });
  };

  const handleUpdateCityDates = (cityId: string, startDate: string, endDate: string) => {
    const updatedCities = trip.cities.map(city => {
      if (city.id === cityId) {
        return { ...city, startDate, endDate };
      }
      return city;
    });
    updateTrip(trip.id, { cities: updatedCities });
  };

  const filteredCities = allCities.filter(c => 
    !trip.cities.some(tc => tc.id === c.id) &&
    (c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
     c.country.toLowerCase().includes(citySearch.toLowerCase()) ||
     (c.state && c.state.toLowerCase().includes(citySearch.toLowerCase())))
  );

  const getActivitiesForCity = (cityId: string) => {
    return allActivities.filter(a => 
      a.cityId === cityId &&
      a.name.toLowerCase().includes(activitySearch.toLowerCase())
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={`/trips/${trip.id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">{trip.name}</h1>
              <p className="text-muted-foreground">
                {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <Link to={`/trips/${trip.id}`}>
            <Button variant="hero" className="gap-2">
              <Save className="h-4 w-4" />
              Save & View
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Itinerary */}
          <div className="lg:col-span-2 space-y-6">
            {trip.cities.map((city, index) => (
              <Card key={city.id} variant="elevated" className="animate-scale-in">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg gradient-bg-sunset text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {city.name}
                          <Badge variant="outline">{city.country}</Badge>
                        </CardTitle>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveCity(city.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* City Dates */}
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Arrive</label>
                      <Input
                        type="date"
                        value={city.startDate || ''}
                        onChange={(e) => handleUpdateCityDates(city.id, e.target.value, city.endDate || e.target.value)}
                        min={trip.startDate}
                        max={trip.endDate}
                        className="h-9"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Depart</label>
                      <Input
                        type="date"
                        value={city.endDate || ''}
                        onChange={(e) => handleUpdateCityDates(city.id, city.startDate || e.target.value, e.target.value)}
                        min={city.startDate || trip.startDate}
                        max={trip.endDate}
                        className="h-9"
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Activities */}
                  <div className="space-y-2 mb-4">
                    {city.activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        compact
                        onRemove={() => handleRemoveActivity(city.id, activity.id)}
                      />
                    ))}
                  </div>

                  {/* Add Activity */}
                  {showActivitySearch === city.id ? (
                    <div className="space-y-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                          Select Tourist Places in {city.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setShowActivitySearch(null);
                            setActivitySearch('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Search tourist places..."
                          value={activitySearch}
                          onChange={(e) => setActivitySearch(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {getActivitiesForCity(city.id).map((activity) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onAdd={() => handleAddActivity(city.id, activity)}
                            isAdded={city.activities.some(a => a.id === activity.id)}
                          />
                        ))}
                        {getActivitiesForCity(city.id).length === 0 && (
                          <p className="text-sm text-muted-foreground col-span-2 text-center py-4">
                            No tourist places found for this city
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-orange-700 dark:text-orange-300 pt-2 border-t border-orange-200 dark:border-orange-800">
                        Tip: Select places to automatically calculate your trip cost
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                      onClick={() => setShowActivitySearch(city.id)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Tourist Places
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Add City Button */}
            {showCitySearch ? (
              <Card variant="gradient" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowCitySearch(false);
                      setCitySearch('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                  {filteredCities.slice(0, 6).map((city) => (
                    <CityCard
                      key={city.id}
                      city={city}
                      onAdd={handleAddCity}
                    />
                  ))}
                </div>
              </Card>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 border-dashed h-20"
                onClick={() => setShowCitySearch(true)}
              >
                <Plus className="h-5 w-5" />
                Add City
              </Button>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card variant="featured" className="sticky top-24">
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cities</span>
                  <span className="font-bold">{trip.cities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-bold">
                    {trip.cities.reduce((sum, c) => sum + c.activities.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Cost</span>
                  <span className="font-bold">
                    ₹{trip.cities.reduce((sum, c) => 
                      sum + c.activities.reduce((aSum, a) => aSum + a.cost, 0), 0
                    ).toLocaleString()}
                  </span>
                </div>

                <hr className="border-border" />

                <div className="space-y-2">
                  {trip.cities.map((city, i) => (
                    <div key={city.id} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full gradient-bg-ocean flex items-center justify-center text-xs text-secondary-foreground font-bold">
                        {i + 1}
                      </div>
                      <span>{city.name}</span>
                      <span className="text-muted-foreground ml-auto">
                        {city.activities.length} acts
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
