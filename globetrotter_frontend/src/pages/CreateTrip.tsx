import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Image, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useTrips } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function CreateTrip() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createTrip } = useTrips();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));

      const trip = createTrip({
        name,
        description,
        startDate,
        endDate,
        budget: parseFloat(budget) || 0,
        coverImage: coverImage || undefined,
        cities: [],
        costBreakdown: { stay: 0, transport: 0, activities: 0, meals: 0 },
        isPublic: false,
      });

      toast({
        title: 'Trip created! 🎉',
        description: 'Now add cities and activities to your itinerary.',
      });

      navigate(`/trips/${trip.id}/edit`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create trip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleCovers = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600',
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">New Adventure</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">Create Your Trip</h1>
          <p className="text-muted-foreground text-lg">
            Start by adding the basic details of your upcoming journey
          </p>
        </div>

        {/* Form */}
        <Card variant="featured" className="animate-scale-in">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Trip Name
                </label>
                <Input
                  placeholder="e.g., European Summer Adventure"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Describe your trip..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-xl border-2 border-input bg-card px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary transition-all duration-300 shadow-soft hover:border-primary/50 resize-none"
                />
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Trip Dates
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Calendar className="h-5 w-5 text-orange-500" />
                    </div>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="pl-12 h-12 text-base font-medium border-2 hover:border-orange-300 focus:border-orange-500 transition-all duration-300"
                      placeholder="Start date"
                    />
                    <div className="absolute -top-2 left-10 bg-background px-2 text-xs font-medium text-orange-600 dark:text-orange-400">
                      From
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Calendar className="h-5 w-5 text-orange-500" />
                    </div>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      required
                      className="pl-12 h-12 text-base font-medium border-2 hover:border-orange-300 focus:border-orange-500 transition-all duration-300"
                      placeholder="End date"
                    />
                    <div className="absolute -top-2 left-10 bg-background px-2 text-xs font-medium text-orange-600 dark:text-orange-400">
                      To
                    </div>
                  </div>
                </div>
                {startDate && endDate && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days trip from {format(new Date(startDate), 'MMM d')} to {format(new Date(endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Budget (INR)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 3000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="100"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Image className="h-4 w-4 text-primary" />
                  Cover Image
                </label>
                <Input
                  placeholder="Paste image URL or choose below..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
                <div className="grid grid-cols-4 gap-2">
                  {sampleCovers.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverImage(url)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        coverImage === url ? 'border-primary shadow-glow' : 'border-transparent'
                      }`}
                    >
                      <img src={url} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {(name || coverImage) && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Preview</p>
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <img
                      src={coverImage || sampleCovers[0]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-primary-foreground font-display">
                        {name || 'Your Trip Name'}
                      </h3>
                      {startDate && endDate && (
                        <p className="text-sm text-primary-foreground/80">
                          {format(new Date(startDate), 'MMM d')} - {format(new Date(endDate), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  'Create Trip'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
