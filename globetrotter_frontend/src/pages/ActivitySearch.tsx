import { useState } from 'react';
import { Search, Filter, Clock, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { ActivityCard } from '@/components/ActivityCard';
import { useTrips } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '@/types';

const categories = ['all', 'sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'nightlife'] as const;

export default function ActivitySearch() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<typeof categories[number]>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const { activities } = useTrips();
  const { toast } = useToast();

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(search.toLowerCase()) ||
                          activity.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    
    let matchesDuration = true;
    if (durationFilter === 'short') matchesDuration = activity.duration <= 2;
    else if (durationFilter === 'medium') matchesDuration = activity.duration > 2 && activity.duration <= 4;
    else if (durationFilter === 'long') matchesDuration = activity.duration > 4;

    return matchesSearch && matchesCategory && matchesDuration;
  });

  const handleAddActivity = (activity: Activity) => {
    toast({
      title: 'Add to which trip?',
      description: 'Go to your trip itinerary to add this activity.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-display font-bold mb-2">Discover Activities</h1>
          <p className="text-muted-foreground">
            Find the perfect experiences for your trip
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Categories</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Duration Filter */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Duration:
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'short', label: '≤2h' },
              { value: 'medium', label: '2-4h' },
              { value: 'long', label: '>4h' },
            ].map((d) => (
              <Badge
                key={d.value}
                variant={durationFilter === d.value ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setDurationFilter(d.value as any)}
              >
                {d.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map((activity, i) => (
            <div
              key={activity.id}
              className="animate-scale-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <ActivityCard
                activity={activity}
                onAdd={handleAddActivity}
              />
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No activities found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
