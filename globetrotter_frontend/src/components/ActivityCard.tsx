import { Activity } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Plus, X, Camera, Utensils, Mountain, Palette, Sparkles, ShoppingBag, Moon } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onAdd?: (activity: Activity) => void;
  onRemove?: (activity: Activity) => void;
  isAdded?: boolean;
  compact?: boolean;
}

const categoryIcons = {
  sightseeing: Camera,
  food: Utensils,
  adventure: Mountain,
  culture: Palette,
  relaxation: Sparkles,
  shopping: ShoppingBag,
  nightlife: Moon,
};

const categoryColors = {
  sightseeing: 'bg-primary/10 text-primary',
  food: 'bg-accent/20 text-accent-foreground',
  adventure: 'bg-success/10 text-success',
  culture: 'bg-secondary text-secondary-foreground',
  relaxation: 'bg-muted text-muted-foreground',
  shopping: 'bg-primary/10 text-primary',
  nightlife: 'bg-contrast/10 text-contrast',
};

export function ActivityCard({ activity, onAdd, onRemove, isAdded, compact }: ActivityCardProps) {
  const Icon = categoryIcons[activity.category];

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
        <div className={`p-2 rounded-lg ${categoryColors[activity.category]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{activity.name}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.duration}h
            </span>
            <span className="flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400">
              <DollarSign className="h-3 w-3" />
              ₹{activity.cost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(activity)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card variant="default" className="overflow-hidden group">
      <div className="relative h-32 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        <div className="absolute top-2 left-2">
          <Badge className={categoryColors[activity.category]}>
            <Icon className="h-3 w-3 mr-1" />
            {activity.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3">
        <h4 className="font-semibold text-sm mb-1 line-clamp-1">{activity.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {activity.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.duration}h
            </span>
            <span className="flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400">
              <DollarSign className="h-3 w-3" />
              ₹{activity.cost.toLocaleString('en-IN')}
            </span>
          </div>

          {onAdd && (
            <Button
              variant={isAdded ? 'secondary' : 'default'}
              size="sm"
              className={`h-7 text-xs ${!isAdded && 'bg-orange-500 hover:bg-orange-600'}`}
              onClick={() => onAdd(activity)}
              disabled={isAdded}
            >
              <Plus className="h-3 w-3 mr-1" />
              {isAdded ? 'Added' : 'Add'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
