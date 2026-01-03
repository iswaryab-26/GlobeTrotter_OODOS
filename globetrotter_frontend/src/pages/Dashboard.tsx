import { Link } from 'react-router-dom';
import { 
  Plus, 
  Plane, 
  DollarSign, 
  MapPin, 
  Calendar,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { TripCard } from '@/components/TripCard';
import { DestinationCard } from '@/components/DestinationCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTrips } from '@/contexts/TripContext';
import { mockDestinations } from '@/data/mockData';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { trips } = useTrips();

  const upcomingTrips = trips
    .filter(t => new Date(t.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  const totalBudget = trips.reduce((sum, t) => sum + t.budget, 0);
  const totalCities = trips.reduce((sum, t) => sum + t.cities.length, 0);
  const totalActivities = trips.reduce(
    (sum, t) => sum + t.cities.reduce((cs, c) => cs + c.activities.length, 0),
    0
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-slide-up">
              <p className="text-muted-foreground text-sm mb-1">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
              <h1 className="text-4xl font-display font-bold mb-2">
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to plan your next adventure?
              </p>
            </div>

            <Link to="/create-trip">
              <Button variant="hero" size="lg" className="gap-2 animate-bounce-in">
                <Plus className="h-5 w-5" />
                Plan New Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Trips', value: trips.length, icon: Plane, color: 'gradient-bg-sunset' },
            { label: 'Cities Explored', value: totalCities, icon: MapPin, color: 'gradient-bg-ocean' },
            { label: 'Activities', value: totalActivities, icon: Sparkles, color: 'gradient-bg-night' },
            { label: 'Total Budget', value: `₹${totalBudget.toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-accent' },
          ].map((stat, i) => (
            <Card key={i} variant="elevated" className="animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold font-display">{stat.value}</p>
                  </div>
                  <div className={`p-2 md:p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Trips */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Upcoming Trips</h2>
              <Link to="/trips" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {upcomingTrips.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {upcomingTrips.map((trip, i) => (
                  <div key={trip.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                    <TripCard trip={trip} />
                  </div>
                ))}
              </div>
            ) : (
              <Card variant="gradient" className="text-center p-8">
                <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No upcoming trips</h3>
                <p className="text-muted-foreground mb-4">Start planning your next adventure!</p>
                <Link to="/create-trip">
                  <Button variant="default">Create Trip</Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Budget Overview */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Budget Highlights</h2>
            <Card variant="featured" className="mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {trips.slice(0, 3).map((trip) => {
                    const spent = trip.costBreakdown.stay + trip.costBreakdown.transport + 
                                  trip.costBreakdown.activities + trip.costBreakdown.meals;
                    const percentage = Math.round((spent / trip.budget) * 100);
                    const isOver = percentage > 100;

                    return (
                      <div key={trip.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium truncate max-w-[150px]">{trip.name}</span>
                          <Badge variant={isOver ? 'destructive' : 'success'} className="text-xs">
                            {percentage}%
                          </Badge>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOver ? 'bg-destructive' : 'gradient-bg-ocean'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>₹{spent.toLocaleString('en-IN')} spent</span>
                          <span>₹{trip.budget.toLocaleString('en-IN')} budget</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {trips.length > 0 && (
                  <Link to="/budget" className="block mt-4">
                    <Button variant="ghost" className="w-full justify-between">
                      View All Budgets
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Destinations */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold">Recommended Destinations</h2>
              <p className="text-muted-foreground">Trending places you might love</p>
            </div>
            <Link to="/cities" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
              Explore all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDestinations.map((dest, i) => (
              <div key={dest.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <DestinationCard destination={dest} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
