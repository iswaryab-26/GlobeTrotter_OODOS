import { City } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, DollarSign, Plus, Check } from 'lucide-react';

interface CityCardProps {
  city: City;
  onAdd?: (city: City) => void;
  isAdded?: boolean;
}

const costLabels = {
  budget: { label: 'Budget', color: 'success' as const },
  moderate: { label: 'Moderate', color: 'secondary' as const },
  expensive: { label: 'Expensive', color: 'accent' as const },
  luxury: { label: 'Luxury', color: 'default' as const },
};

export function CityCard({ city, onAdd, isAdded }: CityCardProps) {
  const costInfo = costLabels[city.costIndex];

  return (
    <Card variant="interactive" className="overflow-hidden group">
      <div className="relative h-40 overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        
        {/* Popularity */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="glass" className="backdrop-blur-md gap-1">
            <TrendingUp className="h-3 w-3" />
            {city.popularity}%
          </Badge>
        </div>

        {/* Name */}
        <div className="absolute bottom-3 left-3">
          <p className="text-primary-foreground/70 text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {city.state ? `${city.state}, ${city.country}` : city.country}
          </p>
          <h3 className="text-xl font-bold text-primary-foreground font-display">
            {city.name}
          </h3>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Badge variant={costInfo.color}>{costInfo.label}</Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {city.activities.length} activities
          </span>
        </div>

        {onAdd && (
          <Button
            variant={isAdded ? 'secondary' : 'default'}
            size="sm"
            className="w-full gap-2"
            onClick={() => onAdd(city)}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Trip
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
