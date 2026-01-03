import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Plane, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login, signup, isLoggedIn } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
          navigate('/dashboard');
        } else {
          toast({ title: 'Login failed', description: result.error, variant: 'destructive' });
        }
      } else if (mode === 'signup') {
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast({ 
            title: 'Password mismatch', 
            description: 'Passwords do not match. Please try again.', 
            variant: 'destructive' 
          });
          setIsLoading(false);
          return;
        }
        
        const result = await signup(name, email, password);
        if (result.success) {
          toast({ title: 'Account created!', description: 'Welcome to GlobeTrotter!' });
          navigate('/dashboard');
        } else {
          toast({ title: 'Signup failed', description: result.error, variant: 'destructive' });
        }
      } else {
        // Forgot password (mock)
        await new Promise(r => setTimeout(r, 1000));
        toast({ title: 'Email sent!', description: 'Check your inbox for reset instructions.' });
        setMode('login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-sunset animate-gradient" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
        
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Logo size="lg" />
          
          <div className="space-y-8">
            <h1 className="text-5xl font-display font-bold text-white leading-tight" style={{ textShadow: '3px 3px 12px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)' }}>
              Your Journey,<br />Your Story
            </h1>
            <p className="text-xl text-white max-w-md font-medium" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5), 0 0 15px rgba(0,0,0,0.3)' }}>
              Plan unforgettable adventures with personalized itineraries, budget tracking, and seamless sharing.
            </p>

            <div className="flex gap-6">
              {[
                { icon: Plane, label: 'Smart Planning' },
                { icon: MapPin, label: 'City Guides' },
                { icon: Calendar, label: 'Day-by-Day' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white">
                  <div className="p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg">
                    <item.icon className="h-5 w-5 drop-shadow-md" />
                  </div>
                  <span className="text-sm font-semibold" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.4)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-3 border-white/60 bg-white/40 backdrop-blur-sm shadow-lg animate-float"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
            <p className="text-white text-sm font-medium" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}>
              <span className="font-bold">10,000+</span> travelers planning their dreams
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <Card variant="featured" className="overflow-hidden">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold mb-2">
                  {mode === 'login' && 'Welcome Back'}
                  {mode === 'signup' && 'Join GlobeTrotter'}
                  {mode === 'forgot' && 'Reset Password'}
                </h2>
                <p className="text-muted-foreground">
                  {mode === 'login' && 'Sign in to continue your adventures'}
                  {mode === 'signup' && 'Start planning your dream trips'}
                  {mode === 'forgot' && 'We\'ll send you a reset link'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Alex Wanderer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-11"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11"
                      required
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                {mode === 'login' && (
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                )}
                {mode === 'signup' && (
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
                {mode === 'forgot' && (
                  <button
                    onClick={() => setMode('login')}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Back to login
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
