import { Globe, Compass } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 gradient-bg-sunset rounded-xl rotate-3 opacity-80"></div>
        <div className="relative flex items-center justify-center h-full w-full bg-card rounded-xl shadow-soft">
          <Globe className="h-1/2 w-1/2 text-primary animate-pulse-slow" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-display font-bold text-white ${textSizes[size]}`} style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5), 0 0 15px rgba(0,0,0,0.3)' }}>
            GlobeTrotter
          </span>
          {size === 'lg' && (
            <span className="text-xs text-white font-bold tracking-wider uppercase" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3)' }}>
              Personalized Travel Planner
            </span>
          )}
        </div>
      )}
    </div>
  );
}
