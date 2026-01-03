import { useState } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { CityCard } from '@/components/CityCard';
import { useTrips } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { City } from '@/types';

const costFilters = ['all', 'budget', 'moderate', 'expensive', 'luxury'] as const;

export default function CitySearch() {
  const [search, setSearch] = useState('');
  const [costFilter, setCostFilter] = useState<typeof costFilters[number]>('all');
  const { cities, trips } = useTrips();
  const { toast } = useToast();

  // Get cities already in active trips
  const addedCityIds = new Set(trips.flatMap(t => t.cities.map(c => c.id)));

  const filteredCities = cities.filter(city => {
    const searchLower = search.toLowerCase();
    const matchesSearch = city.name.toLowerCase().includes(searchLower) ||
                          city.country.toLowerCase().includes(searchLower) ||
                          (city.state && city.state.toLowerCase().includes(searchLower));
    const matchesCost = costFilter === 'all' || city.costIndex === costFilter;
    return matchesSearch && matchesCost;
  });

  const handleAddCity = (city: City) => {
    toast({
      title: 'Add to which trip?',
      description: 'Go to a specific trip to add this city to your itinerary.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-display font-bold mb-2">Explore Cities</h1>
          <p className="text-muted-foreground">
            Discover amazing destinations around the world
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cities or countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {costFilters.map((filter) => (
              <Button
                key={filter}
                variant={costFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCostFilter(filter)}
                className="capitalize"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Popular Cities Banner */}
        <div className="mb-8 p-6 rounded-2xl gradient-bg-ocean text-secondary-foreground">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Trending Destinations</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {cities
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 5)
              .map((city) => (
                <Badge
                  key={city.id}
                  variant="glass"
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSearch(city.name)}
                >
                  {city.name}, {city.country}
                </Badge>
              ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map((city, i) => (
            <div
              key={city.id}
              className="animate-scale-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <CityCard
                city={city}
                onAdd={handleAddCity}
                isAdded={addedCityIds.has(city.id)}
              />
            </div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cities found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
