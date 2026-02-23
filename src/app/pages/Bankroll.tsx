import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Shield, Calculator, AlertCircle, Plus, Minus, TrendingDown, Activity, Target, PieChart } from 'lucide-react';
import { Header } from '../components/Header';
import { BrandButton } from '../components/BrandButton';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { LoadingState } from '../components/LoadingState';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

export function Bankroll() {
  const { settings, settingsLoading, updateSettings, bets } = useData();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    startingBankroll: 1000,
    weeklyBudget: 100,
    monthlyBudget: 400,
    unitSize: 1,
    stopLoss: 100,
    stopLossEnabled: true,
    coolOffEnabled: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'deposit' | 'withdraw'>('deposit');

  // Load settings when available
  useEffect(() => {
    if (settings) {
      setFormData({
        startingBankroll: settings.startingBankroll,
        weeklyBudget: settings.weeklyBudget,
        monthlyBudget: settings.monthlyBudget,
        unitSize: settings.unitSize,
        stopLoss: settings.stopLoss,
        stopLossEnabled: settings.stopLossEnabled,
        coolOffEnabled: settings.coolOffEnabled,
      });
    }
  }, [settings]);

  const calculatedUnit = (formData.startingBankroll * formData.unitSize) / 100;
  const currentBankroll = settings?.currentBankroll || formData.startingBankroll;
  const totalGrowth = currentBankroll - formData.startingBankroll;
  const growthPercentage = formData.startingBankroll > 0 
    ? (totalGrowth / formData.startingBankroll) * 100 
    : 0;

  // Calculate bankroll history from bets
  const bankrollHistory = (() => {
    if (!bets || bets.length === 0) return [];
    
    const sortedBets = [...bets]
      .filter(bet => bet.status !== 'pending')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBankroll = formData.startingBankroll;
    const history = [{ date: 'Start', bankroll: runningBankroll }];
    
    sortedBets.forEach((bet, index) => {
      runningBankroll += bet.profit;
      if (index < 10 || index % 2 === 0) { // Sample for performance
        history.push({
          date: new Date(bet.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          bankroll: runningBankroll,
        });
      }
    });
    
    return history.slice(-20); // Last 20 points
  })();

  // Calculate weekly/monthly spending
  const currentSpending = (() => {
    if (!bets || bets.length === 0) return { weekly: 0, monthly: 0 };
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const weeklySpent = bets
      .filter(bet => new Date(bet.date) >= weekAgo)
      .reduce((sum, bet) => sum + bet.stake, 0);
    
    const monthlySpent = bets
      .filter(bet => new Date(bet.date) >= monthAgo)
      .reduce((sum, bet) => sum + bet.stake, 0);
    
    return { weekly: weeklySpent, monthly: monthlySpent };
  })();

  // Kelly Criterion calculator
  const kellyData = [
    { confidence: '50%', odds: 2.0, kelly: 0, recommended: 0 },
    { confidence: '55%', odds: 2.0, kelly: 5, recommended: calculatedUnit * 0.5 },
    { confidence: '60%', odds: 2.0, kelly: 10, recommended: calculatedUnit * 1 },
    { confidence: '65%', odds: 2.0, kelly: 15, recommended: calculatedUnit * 1.5 },
    { confidence: '70%', odds: 2.0, kelly: 20, recommended: calculatedUnit * 2 },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        startingBankroll: formData.startingBankroll,
        weeklyBudget: formData.weeklyBudget,
        monthlyBudget: formData.monthlyBudget,
        unitSize: formData.unitSize,
        stopLoss: formData.stopLoss,
        stopLossEnabled: formData.stopLossEnabled,
        coolOffEnabled: formData.coolOffEnabled,
      });
    } catch (error) {
      console.error('Failed to save bankroll settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdjustBankroll = async () => {
    const amount = parseFloat(adjustAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const newBankroll = adjustType === 'deposit' 
      ? currentBankroll + amount 
      : currentBankroll - amount;

    if (newBankroll < 0) {
      toast.error('Cannot withdraw more than current bankroll');
      return;
    }

    try {
      await updateSettings({ currentBankroll: newBankroll });
      toast.success(`Bankroll ${adjustType === 'deposit' ? 'increased' : 'decreased'} by ₦${amount.toLocaleString()}`);
      setShowAdjustModal(false);
      setAdjustAmount('');
    } catch (error) {
      toast.error('Failed to adjust bankroll');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
            <p className="text-muted-foreground">Sign in to manage your bankroll</p>
          </div>
        </main>
      </div>
    );
  }

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bankroll Management</h1>
          <p className="text-muted-foreground">
            Manage your betting budget and enforce discipline
          </p>
        </div>

        {/* Current Bankroll Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <Wallet className="size-8 opacity-90" />
            </div>
            <p className="text-sm opacity-90 mb-1">Current Bankroll</p>
            <p className="text-4xl font-bold">
              ₦{currentBankroll.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <TrendingUp className={`size-8 ${totalGrowth >= 0 ? 'text-[#10b981] dark:text-[#34d399]' : 'text-[#ef4444] dark:text-[#f87171]'}`} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Growth</p>
            <p className="text-4xl font-bold">
              {totalGrowth >= 0 ? '+' : ''}₦{totalGrowth.toLocaleString()}
            </p>
            <p className={`text-sm mt-2 ${totalGrowth >= 0 ? 'text-[#10b981] dark:text-[#34d399]' : 'text-[#ef4444] dark:text-[#f87171]'}`}>
              {totalGrowth >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <Shield className="size-8 text-[#6366f1] dark:text-[#818cf8]" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Protection</p>
            <p className="text-lg font-semibold">
              {formData.stopLossEnabled ? 'Enabled' : 'Disabled'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Stop loss: ₦{formData.stopLoss.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bankroll Settings */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Budgets & Limits */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Calculator className="size-5" />
              Budgets & Limits
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="startingBankroll">Starting Bankroll (₦)</Label>
                <Input
                  id="startingBankroll"
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.startingBankroll}
                  onChange={(e) =>
                    setFormData({ ...formData, startingBankroll: parseFloat(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Your initial betting bankroll
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weeklyBudget">Weekly Budget (₦)</Label>
                <Input
                  id="weeklyBudget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weeklyBudget}
                  onChange={(e) =>
                    setFormData({ ...formData, weeklyBudget: parseFloat(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Maximum to bet per week
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyBudget">Monthly Budget (₦)</Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthlyBudget}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyBudget: parseFloat(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Maximum to bet per month
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="unitSize">Unit Size (%)</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.unitSize}% = ₦{calculatedUnit.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="unitSize"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={[formData.unitSize]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, unitSize: value[0] })
                  }
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of bankroll per standard bet
                </p>
              </div>
            </div>
          </div>

          {/* Protection & Safeguards */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Shield className="size-5" />
              Protection & Safeguards
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="stopLossEnabled" className="cursor-pointer">
                    Stop Loss Protection
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Prevent bets when loss limit is reached
                  </p>
                </div>
                <Switch
                  id="stopLossEnabled"
                  checked={formData.stopLossEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, stopLossEnabled: checked })
                  }
                />
              </div>

              {formData.stopLossEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-[#6366f1]">
                  <Label htmlFor="stopLoss">Stop Loss Amount (₦)</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.stopLoss}
                    onChange={(e) =>
                      setFormData({ ...formData, stopLoss: parseFloat(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Stop betting after losing this amount
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="coolOffEnabled" className="cursor-pointer">
                    Cool-Off Period
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mandatory break after big losses
                  </p>
                </div>
                <Switch
                  id="coolOffEnabled"
                  checked={formData.coolOffEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, coolOffEnabled: checked })
                  }
                />
              </div>

              {/* Responsible Gambling Message */}
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="size-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-200 mb-1">
                      Gamble Responsibly
                    </p>
                    <p className="text-xs text-orange-800 dark:text-orange-300">
                      Only bet what you can afford to lose. If gambling becomes a problem, seek help at{' '}
                      <a
                        href="https://www.ncpgambling.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium"
                      >
                        ncpgambling.org
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bankroll History Chart */}
        <div className="bg-card border border-border rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Activity className="size-5" />
            Bankroll History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={bankrollHistory}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bankroll" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Summary */}
        <div className="bg-card border border-border rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Target className="size-5" />
            Spending Summary
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Weekly Spending</p>
              <p className="text-2xl font-bold">
                ₦{currentSpending.weekly.toLocaleString()}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Monthly Spending</p>
              <p className="text-2xl font-bold">
                ₦{currentSpending.monthly.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Kelly Criterion Chart */}
        <div className="bg-card border border-border rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <PieChart className="size-5" />
            Kelly Criterion
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={kellyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="confidence" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="recommended" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Adjust Bankroll Modal */}
        {showAdjustModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 w-96">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Wallet className="size-5" />
                Adjust Bankroll
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <BrandButton
                    variant={adjustType === 'deposit' ? 'primary' : 'ghost'}
                    className="flex-1"
                    onClick={() => setAdjustType('deposit')}
                  >
                    <Plus className="size-4 mr-2" />
                    Deposit
                  </BrandButton>
                  <BrandButton
                    variant={adjustType === 'withdraw' ? 'primary' : 'ghost'}
                    className="flex-1"
                    onClick={() => setAdjustType('withdraw')}
                  >
                    <Minus className="size-4 mr-2" />
                    Withdraw
                  </BrandButton>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adjustAmount">Amount (₦)</Label>
                  <Input
                    id="adjustAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <BrandButton
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowAdjustModal(false)}
                >
                  Cancel
                </BrandButton>
                <BrandButton
                  variant="primary"
                  className="flex-1"
                  onClick={handleAdjustBankroll}
                  disabled={isSaving}
                  loading={isSaving}
                >
                  Confirm
                </BrandButton>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <BrandButton
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            loading={isSaving}
          >
            Save Settings
          </BrandButton>
          <BrandButton
            variant="secondary"
            size="lg"
            onClick={() => setShowAdjustModal(true)}
          >
            Adjust Bankroll
          </BrandButton>
        </div>
      </main>
    </div>
  );
}