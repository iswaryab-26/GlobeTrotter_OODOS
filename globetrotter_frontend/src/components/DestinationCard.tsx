import { Destination } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card variant="elevated" className="overflow-hidden group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
        
        {/* Rating */}
        <div className="absolute top-3 right-3">
          <Badge className="gap-1 bg-accent text-accent-foreground">
            <Star className="h-3 w-3 fill-current" />
            {destination.rating}
          </Badge>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-primary-foreground/70 text-sm">{destination.country}</p>
              <h3 className="text-2xl font-bold text-primary-foreground font-display">
                {destination.name}
              </h3>
            </div>
            <Badge variant="glass" className="backdrop-blur-md">
              {destination.priceRange}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {destination.description}
        </p>
        <Button variant="ghost" className="w-full justify-between group/btn">
          Explore
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
