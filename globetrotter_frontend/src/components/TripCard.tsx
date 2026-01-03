import { Trip } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface TripCardProps {
  trip: Trip;
  onDelete?: (tripId: string) => void;
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const totalCost = trip.costBreakdown.stay + trip.costBreakdown.transport + 
                    trip.costBreakdown.activities + trip.costBreakdown.meals;
  const isOverBudget = totalCost > trip.budget;

  return (
    <Card variant="interactive" className="overflow-hidden group">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
          alt={trip.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="glass" className="backdrop-blur-md">
            <MapPin className="h-3 w-3 mr-1" />
            {trip.cities.length} {trip.cities.length === 1 ? 'City' : 'Cities'}
          </Badge>
          {trip.isPublic && (
            <Badge variant="secondary">Public</Badge>
          )}
        </div>

        {/* Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-primary-foreground font-display line-clamp-1">
            {trip.name}
          </h3>
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {trip.description || 'An exciting adventure awaits!'}
        </p>

        {/* Budget Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="font-bold text-lg">₹{trip.budget.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Estimated</p>
            <p className={`font-bold text-lg ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
              ₹{totalCost.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Cities Preview */}
        {trip.cities.length > 0 && (
          <div className="flex -space-x-2 mb-4">
            {trip.cities.slice(0, 4).map((city, index) => (
              <div
                key={city.id}
                className="h-8 w-8 rounded-full border-2 border-card overflow-hidden shadow-soft"
                style={{ zIndex: 4 - index }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {trip.cities.length > 4 && (
              <div className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium">
                +{trip.cities.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/trips/${trip.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full gap-2">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
          <Link to={`/trips/${trip.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(trip.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
