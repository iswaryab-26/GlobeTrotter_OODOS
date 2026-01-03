import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plane, MapPin, Calendar, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Plane className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">GlobeTrotter</h1>
              <p className="text-xs text-white/90 font-medium tracking-wide">PERSONALIZED TRAVEL PLANNER</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 font-semibold"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
            <Button 
              className="bg-white text-orange-500 hover:bg-white/90 font-bold shadow-lg"
              onClick={() => navigate('/auth')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            Your Journey,<br />
            Your Story
          </h2>
          
          <p className="text-xl md:text-2xl text-white/95 mb-12 drop-shadow-lg font-medium max-w-2xl leading-relaxed">
            Plan unforgettable adventures with personalized itineraries, budget tracking, and seamless sharing.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 mb-16">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg">
              <Plane className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Smart Planning</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">City Guides</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Day-by-Day</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg"
            className="bg-white text-orange-500 hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-2xl transform hover:scale-105 transition-all"
            onClick={() => navigate('/auth')}
          >
            Start Planning Your Dream Trip
          </Button>
        </div>

        {/* Social Proof */}
        <div className="absolute bottom-20 left-6 flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white"></div>
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white"></div>
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white"></div>
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white"></div>
          </div>
          <div className="text-white drop-shadow-lg">
            <p className="font-bold text-lg">10,000+</p>
            <p className="text-sm text-white/90">travelers planning their dreams</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
