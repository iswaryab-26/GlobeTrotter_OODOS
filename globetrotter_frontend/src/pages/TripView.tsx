import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Share2, 
  Edit, 
  Clock,
  ChevronRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { ActivityCard } from '@/components/ActivityCard';
import { useTrips } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';

export default function TripView() {
  const { tripId } = useParams();
  const { getTrip } = useTrips();
  const { toast } = useToast();

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

  const totalCost = trip.costBreakdown.stay + trip.costBreakdown.transport + 
                    trip.costBreakdown.activities + trip.costBreakdown.meals;
  const isOverBudget = totalCost > trip.budget;
  const tripDays = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied!',
      description: 'Share this link with others.',
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {trip.isPublic && <Badge variant="secondary">Public</Badge>}
                  <Badge variant="glass">{tripDays} days</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  {trip.name}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {trip.cities.length} cities
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="glass" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Link to={`/trips/${trip.id}/edit`}>
                  <Button variant="default" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {trip.description && (
              <Card variant="default">
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{trip.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Itinerary</h2>
              
              {trip.cities.length > 0 ? (
                <div className="space-y-6">
                  {trip.cities.map((city, index) => (
                    <Card key={city.id} variant="elevated" className="overflow-hidden">
                      <div className="relative h-32">
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge variant="glass" className="mb-2">Stop {index + 1}</Badge>
                          <h3 className="text-2xl font-bold text-primary-foreground font-display">
                            {city.name}
                          </h3>
                          <p className="text-primary-foreground/80 text-sm">{city.country}</p>
                        </div>
                        {city.startDate && city.endDate && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary">
                              {format(new Date(city.startDate), 'MMM d')} - {format(new Date(city.endDate), 'MMM d')}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        {city.activities.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground mb-3">
                              {city.activities.length} activities planned
                            </p>
                            {city.activities.map((activity) => (
                              <ActivityCard
                                key={activity.id}
                                activity={activity}
                                compact
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm text-center py-4">
                            No activities added yet
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card variant="gradient" className="text-center p-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No cities added</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your itinerary by adding cities
                  </p>
                  <Link to={`/trips/${trip.id}/edit`}>
                    <Button>Edit Itinerary</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <Card variant="featured">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-bold text-xl">${trip.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className={`font-bold text-xl ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
                    ${totalCost.toLocaleString()}
                  </span>
                </div>

                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverBudget ? 'bg-destructive' : 'gradient-bg-ocean'
                    }`}
                    style={{ width: `${Math.min((totalCost / trip.budget) * 100, 100)}%` }}
                  />
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  {[
                    { label: 'Accommodation', value: trip.costBreakdown.stay },
                    { label: 'Transport', value: trip.costBreakdown.transport },
                    { label: 'Activities', value: trip.costBreakdown.activities },
                    { label: 'Meals', value: trip.costBreakdown.meals },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">₹{item.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/trips/${trip.id}/budget`}>
                  <Button variant="outline" className="w-full mt-4">
                    View Full Breakdown
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="default">
              <CardContent className="p-4 space-y-2">
                <Link to={`/trips/${trip.id}/calendar`} className="block">
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Calendar View
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                {trip.isPublic && trip.shareUrl && (
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={handleShare}
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Share Link
                    </span>
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
