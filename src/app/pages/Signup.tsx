import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { BrandButton } from '../components/BrandButton';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner';

export function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { updateSettings } = useData();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    initialBankroll: '1000'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    const bankroll = parseFloat(formData.initialBankroll);

    if (!formData.initialBankroll || isNaN(bankroll)) {
      newErrors.initialBankroll = 'Initial bankroll is required';
    } else if (bankroll <= 0) {
      newErrors.initialBankroll = 'Bankroll must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    try {
      // Sign up the user
      await signUp(formData.email, formData.password, formData.name);
      
      // Update initial bankroll settings
      const bankroll = parseFloat(formData.initialBankroll);
      await updateSettings({
        startingBankroll: bankroll,
        currentBankroll: bankroll,
        weeklyBudget: Math.round(bankroll * 0.1), // 10% of bankroll
        monthlyBudget: Math.round(bankroll * 0.4), // 40% of bankroll
        unitSize: 1, // 1% of bankroll
        stopLoss: Math.round(bankroll * 0.1), // 10% of bankroll
      });

      toast.success('Account created successfully!');
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
      console.error('Signup error:', error);
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
            <Link to="/landing">
              <BrandButton variant="ghost">Already have an account?</BrandButton>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {step === 1 ? 'Create your account' : 'Set up your bankroll'}
            </h1>
            <p className="text-muted-foreground">
              {step === 1
                ? 'Start tracking your bets professionally'
                : 'Configure your starting bankroll and betting limits'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 mb-8">
            <div
              className={`h-1 flex-1 rounded-full transition-colors ${
                step >= 1 ? 'bg-[#6366f1]' : 'bg-muted'
              }`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-colors ${
                step >= 2 ? 'bg-[#6366f1]' : 'bg-muted'
              }`}
            />
          </div>

          {/* Step 1: Account Details */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: '' });
                  }}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

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
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: '' });
                  }}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <BrandButton type="submit" variant="primary" className="w-full" size="lg">
                Continue
              </BrandButton>

              <p className="text-sm text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}

          {/* Step 2: Bankroll Setup */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4 mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-[#10b981]" />
                  Why set a bankroll?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Track your betting budget and enforce discipline</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Get alerts when approaching loss limits</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Calculate optimal bet sizing based on bankroll</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>You can update this anytime in Settings</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBankroll">Initial Bankroll (₦)</Label>
                <Input
                  id="initialBankroll"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="e.g., 100000"
                  value={formData.initialBankroll}
                  onChange={(e) => {
                    setFormData({ ...formData, initialBankroll: e.target.value });
                    setErrors({ ...errors, initialBankroll: '' });
                  }}
                  className={errors.initialBankroll ? 'border-red-500' : ''}
                />
                {errors.initialBankroll && (
                  <p className="text-sm text-red-500">{errors.initialBankroll}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Recommended: ₦50,000 - ₦500,000 for optimal betting strategy
                </p>
              </div>

              {/* Preview of recommended settings */}
              {formData.initialBankroll && !isNaN(parseFloat(formData.initialBankroll)) && parseFloat(formData.initialBankroll) > 0 && (
                <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold mb-3">Recommended Settings</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs">Weekly Budget</span>
                      <span className="font-medium">₦{Math.round(parseFloat(formData.initialBankroll) * 0.1).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Monthly Budget</span>
                      <span className="font-medium">₦{Math.round(parseFloat(formData.initialBankroll) * 0.4).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Unit Size</span>
                      <span className="font-medium">1% (₦{(parseFloat(formData.initialBankroll) * 0.01).toLocaleString()})</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Stop Loss</span>
                      <span className="font-medium">₦{Math.round(parseFloat(formData.initialBankroll) * 0.1).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    These can be customized later in Settings
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <BrandButton
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </BrandButton>
                <BrandButton
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  size="lg"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </BrandButton>
              </div>
            </form>
          )}
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