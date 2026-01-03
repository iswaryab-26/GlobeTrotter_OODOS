import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Plane, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { TripCard } from '@/components/TripCard';
import { useTrips } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';

export default function MyTrips() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { trips, deleteTrip } = useTrips();
  const { toast } = useToast();

  const handleDelete = (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
      toast({
        title: 'Trip deleted',
        description: 'Your trip has been removed.',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-display font-bold mb-2">My Trips</h1>
            <p className="text-muted-foreground">
              {trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-muted rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-card shadow-soft text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-card shadow-soft text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Link to="/create-trip">
              <Button variant="hero" className="gap-2">
                <Plus className="h-4 w-4" />
                New Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Trips Grid/List */}
        {trips.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4'
          }>
            {trips.map((trip, i) => (
              <div
                key={trip.id}
                className="animate-scale-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <TripCard trip={trip} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Plane className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">No trips yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start planning your first adventure! Create a trip and add destinations, activities, and a budget.
            </p>
            <Link to="/create-trip">
              <Button variant="hero" size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Plan Your First Trip
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
