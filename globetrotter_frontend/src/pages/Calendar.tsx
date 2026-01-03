import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTrips } from '@/contexts/TripContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, parseISO, isWithinInterval } from 'date-fns';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { trips } = useTrips();
  const navigate = useNavigate();

  // Get all days in current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get padding days for the calendar grid
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => null);

  // Find trips for a specific day
  const getTripsForDay = (day: Date) => {
    return trips.filter(trip => {
      if (!trip.startDate || !trip.endDate) return false;
      const tripStart = typeof trip.startDate === 'string' ? parseISO(trip.startDate) : trip.startDate;
      const tripEnd = typeof trip.endDate === 'string' ? parseISO(trip.endDate) : trip.endDate;
      
      return isWithinInterval(day, { start: tripStart, end: tripEnd });
    });
  };

  // Get upcoming trips
  const upcomingTrips = useMemo(() => {
    const today = new Date();
    return trips
      .filter(trip => {
        if (!trip.startDate) return false;
        const tripStart = typeof trip.startDate === 'string' ? parseISO(trip.startDate) : trip.startDate;
        return tripStart >= today;
      })
      .sort((a, b) => {
        const dateA = typeof a.startDate === 'string' ? parseISO(a.startDate) : a.startDate;
        const dateB = typeof b.startDate === 'string' ? parseISO(b.startDate) : b.startDate;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  }, [trips]);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Travel Calendar</h1>
            <p className="text-muted-foreground">Plan and visualize your trips</p>
          </div>
          <Button onClick={() => navigate('/create-trip')} variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Plan New Trip
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card variant="featured">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-display">
                    {format(currentDate, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Week days header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map(day => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {paddingDays.map((_, i) => (
                    <div key={`padding-${i}`} className="aspect-square" />
                  ))}
                  {daysInMonth.map((day, i) => {
                    const dayTrips = getTripsForDay(day);
                    const isCurrentDay = isToday(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);

                    return (
                      <div
                        key={i}
                        className={`
                          aspect-square p-1 rounded-lg border-2 transition-all cursor-pointer
                          ${isCurrentDay ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                          ${!isCurrentMonth ? 'opacity-40' : ''}
                          ${dayTrips.length > 0 ? 'bg-gradient-to-br from-primary/10 to-secondary/10' : 'hover:bg-muted'}
                        `}
                      >
                        <div className="flex flex-col h-full">
                          <div className={`text-sm font-semibold ${isCurrentDay ? 'text-primary' : ''}`}>
                            {format(day, 'd')}
                          </div>
                          <div className="flex-1 flex flex-col gap-0.5 mt-1 overflow-hidden">
                            {dayTrips.slice(0, 2).map((trip, idx) => (
                              <div
                                key={trip.id}
                                onClick={() => navigate(`/trips/${trip.id}`)}
                                className="text-[10px] px-1 py-0.5 rounded bg-primary/20 text-primary font-medium truncate hover:bg-primary/30 transition-colors"
                                title={trip.name}
                              >
                                {trip.name}
                              </div>
                            ))}
                            {dayTrips.length > 2 && (
                              <div className="text-[9px] text-muted-foreground font-medium">
                                +{dayTrips.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-primary bg-primary/5" />
                    <span className="text-muted-foreground">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-border" />
                    <span className="text-muted-foreground">Has trips</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Trips Sidebar */}
          <div>
            <Card variant="featured">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Upcoming Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingTrips.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No upcoming trips planned
                    </p>
                    <Button
                      onClick={() => navigate('/create-trip')}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Trip
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingTrips.map(trip => {
                      const startDate = typeof trip.startDate === 'string' 
                        ? parseISO(trip.startDate) 
                        : trip.startDate;
                      const endDate = typeof trip.endDate === 'string' 
                        ? parseISO(trip.endDate) 
                        : trip.endDate;

                      return (
                        <div
                          key={trip.id}
                          onClick={() => navigate(`/trips/${trip.id}`)}
                          className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-md group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                              {trip.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {trip.cities?.length || 0} cities
                            </Badge>
                          </div>
                          
                          {trip.cities && trip.cities.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1">
                                {trip.cities.map(c => c.name).join(', ')}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            {startDate && endDate ? (
                              <span>
                                {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                              </span>
                            ) : (
                              <span>Dates not set</span>
                            )}
                          </div>

                          {trip.budget && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <div className="text-xs text-muted-foreground">Budget</div>
                              <div className="text-sm font-semibold text-primary">
                                ₹{trip.budget.toLocaleString('en-IN')}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {upcomingTrips.length > 0 && (
                  <Button
                    onClick={() => navigate('/trips')}
                    variant="outline"
                    className="w-full mt-4"
                    size="sm"
                  >
                    View All Trips
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card variant="featured" className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Trips</span>
                    <span className="text-lg font-bold">
                      {trips.filter(trip => {
                        if (!trip.startDate) return false;
                        const tripStart = typeof trip.startDate === 'string' ? parseISO(trip.startDate) : trip.startDate;
                        return isSameMonth(tripStart, currentDate);
                      }).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Days Traveling</span>
                    <span className="text-lg font-bold">
                      {daysInMonth.reduce((count, day) => {
                        return count + (getTripsForDay(day).length > 0 ? 1 : 0);
                      }, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cities Visiting</span>
                    <span className="text-lg font-bold">
                      {new Set(
                        trips
                          .filter(trip => {
                            if (!trip.startDate) return false;
                            const tripStart = typeof trip.startDate === 'string' ? parseISO(trip.startDate) : trip.startDate;
                            return isSameMonth(tripStart, currentDate);
                          })
                          .flatMap(trip => trip.cities || [])
                          .map(city => city.id)
                      ).size}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
