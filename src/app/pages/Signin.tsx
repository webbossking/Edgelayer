import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { BrandButton } from '../components/BrandButton';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Signin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(message);
      console.error('Signin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/landing" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">EdgeLedger</span>
            </Link>
            <Link to="/signup">
              <BrandButton variant="primary">Get Started</BrandButton>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to continue tracking your bets
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: '' });
                }}
                className={errors.email ? 'border-red-500' : ''}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setErrors({ ...errors, password: '' });
                }}
                className={errors.password ? 'border-red-500' : ''}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <BrandButton
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </BrandButton>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#6366f1] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Responsible Gambling Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            EdgeLedger is a bet tracking tool. Always gamble responsibly. If you have a gambling problem, please seek help at{' '}
            <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              ncpgambling.org
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
