import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityCard } from '@/components/ActivityCard';
import { Logo } from '@/components/Logo';
import { useTrips } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';

export default function SharedTrip() {
  const { tripId } = useParams();
  const { getTrip } = useTrips();
  const { toast } = useToast();

  const trip = getTrip(tripId || '');

  const handleCopyTrip = () => {
    toast({ title: 'Trip copied!', description: 'Sign in to customize this itinerary.' });
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
          <Link to="/auth"><Button>Get Started</Button></Link>
        </div>
      </div>
    );
  }

  const tripDays = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Logo size="md" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyTrip} className="gap-2">
              <Copy className="h-4 w-4" /> Copy Trip
            </Button>
            <Link to="/auth"><Button variant="hero">Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-72">
        <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'} alt={trip.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 container mx-auto px-4">
          <Badge variant="glass" className="mb-2">{tripDays} Days</Badge>
          <h1 className="text-4xl font-display font-bold">{trip.name}</h1>
          <div className="flex gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.cities.length} cities</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {trip.description && <p className="text-lg text-muted-foreground mb-8 max-w-2xl">{trip.description}</p>}
        
        <div className="space-y-6">
          {trip.cities.map((city, i) => (
            <Card key={city.id} variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg gradient-bg-ocean text-secondary-foreground font-bold">{i + 1}</div>
                  <div>
                    <h3 className="text-xl font-bold">{city.name}, {city.country}</h3>
                    {city.startDate && <p className="text-sm text-muted-foreground">{format(new Date(city.startDate), 'MMM d')} - {format(new Date(city.endDate || city.startDate), 'MMM d')}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  {city.activities.map(a => <ActivityCard key={a.id} activity={a} compact />)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
