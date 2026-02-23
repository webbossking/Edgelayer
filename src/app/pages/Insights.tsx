import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Calculator,
  Zap,
  Shield,
  Calendar,
  BarChart3,
  Flame,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { Header } from '../components/Header';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { BrandButton } from '../components/BrandButton';
import { LoadingState } from '../components/LoadingState';
import { KellyCalculator } from '../components/KellyCalculator';
import { DateRangePicker } from '../components/DateRangePicker';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import {
  calculateStreaks,
  calculateMaxDrawdown,
  calculateVariance,
  calculateProfitFactor,
  calculateAvgHoldTime,
} from '../../utils/analytics';
import { format, parseISO, isWithinInterval } from 'date-fns';

export function Insights() {
  const { bets, betsLoading, stats } = useData();
  const { isAuthenticated } = useAuth();
  const [showKellyCalc, setShowKellyCalc] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Filter bets by date range
  const filteredBets = useMemo(() => {
    if (!dateRange?.from) return bets;

    return bets.filter((bet) => {
      const betDate = parseISO(bet.date);
      return isWithinInterval(betDate, {
        start: dateRange.from!,
        end: dateRange.to || dateRange.from!,
      });
    });
  }, [bets, dateRange]);

  // Advanced analytics calculations
  const streaks = useMemo(() => calculateStreaks(filteredBets), [filteredBets]);
  const drawdown = useMemo(() => calculateMaxDrawdown(filteredBets), [filteredBets]);
  const variance = useMemo(() => calculateVariance(filteredBets), [filteredBets]);
  const profitFactor = useMemo(() => calculateProfitFactor(filteredBets), [filteredBets]);
  const avgHoldTime = useMemo(() => calculateAvgHoldTime(filteredBets), [filteredBets]);

  // Cumulative profit by date
  const cumulativeProfitData = useMemo(() => {
    if (filteredBets.length === 0) return [];

    const sortedBets = [...filteredBets]
      .filter((b) => b.status === 'won' || b.status === 'lost')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let cumulative = 0;
    return sortedBets.map((bet) => {
      cumulative += bet.profit;
      return {
        date: format(parseISO(bet.date), 'MMM dd'),
        profit: cumulative,
      };
    });
  }, [filteredBets]);

  // Win/Loss distribution by odds range
  const oddsDistribution = useMemo(() => {
    const ranges = [
      { label: '1.00-1.50', min: 1.0, max: 1.5, wins: 0, losses: 0 },
      { label: '1.51-2.00', min: 1.51, max: 2.0, wins: 0, losses: 0 },
      { label: '2.01-3.00', min: 2.01, max: 3.0, wins: 0, losses: 0 },
      { label: '3.01-5.00', min: 3.01, max: 5.0, wins: 0, losses: 0 },
      { label: '5.00+', min: 5.01, max: Infinity, wins: 0, losses: 0 },
    ];

    filteredBets.forEach((bet) => {
      if (bet.status === 'won' || bet.status === 'lost') {
        const range = ranges.find((r) => bet.odds >= r.min && bet.odds <= r.max);
        if (range) {
          if (bet.status === 'won') range.wins++;
          else range.losses++;
        }
      }
    });

    return ranges.map((r) => ({
      range: r.label,
      wins: r.wins,
      losses: r.losses,
      winRate: r.wins + r.losses > 0 ? (r.wins / (r.wins + r.losses)) * 100 : 0,
    }));
  }, [filteredBets]);

  // ROI over time (rolling 30-bet average)
  const roiOverTime = useMemo(() => {
    if (filteredBets.length === 0) return [];

    const sortedBets = [...filteredBets]
      .filter((b) => b.status === 'won' || b.status === 'lost')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const windowSize = 30;
    const result = [];

    for (let i = windowSize - 1; i < sortedBets.length; i++) {
      const window = sortedBets.slice(Math.max(0, i - windowSize + 1), i + 1);
      const totalStake = window.reduce((sum, bet) => sum + bet.stake, 0);
      const totalProfit = window.reduce((sum, bet) => sum + bet.profit, 0);
      const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;

      result.push({
        date: format(parseISO(sortedBets[i].date), 'MMM dd'),
        roi: Math.round(roi * 100) / 100,
      });
    }

    return result;
  }, [filteredBets]);

  // Profit by day of week
  const profitByDayOfWeek = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats: Record<string, { profit: number; count: number }> = {};

    days.forEach((day) => {
      dayStats[day] = { profit: 0, count: 0 };
    });

    filteredBets
      .filter((b) => b.status === 'won' || b.status === 'lost')
      .forEach((bet) => {
        const dayName = days[new Date(bet.date).getDay()];
        dayStats[dayName].profit += bet.profit;
        dayStats[dayName].count++;
      });

    return days.map((day) => ({
      day: day.slice(0, 3),
      profit: Math.round(dayStats[day].profit * 100) / 100,
      avgProfit:
        dayStats[day].count > 0
          ? Math.round((dayStats[day].profit / dayStats[day].count) * 100) / 100
          : 0,
    }));
  }, [filteredBets]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
            <p className="text-muted-foreground">Sign in to view your insights</p>
          </div>
        </main>
      </div>
    );
  }

  if (betsLoading) {
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
            <p className="text-muted-foreground">
              Deep insights into your betting performance
            </p>
          </div>
          <div className="flex gap-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <BrandButton variant="primary" onClick={() => setShowKellyCalc(true)}>
              <Calculator className="size-4" />
              Kelly Calculator
            </BrandButton>
          </div>
        </div>

        {/* Advanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Profit Factor"
            value={profitFactor.toFixed(2)}
            icon={Activity}
            trend={profitFactor > 1 ? 'up' : profitFactor < 1 ? 'down' : undefined}
            tooltip="Gross profits / Gross losses (>1 is profitable)"
          />
          <KPICard
            title="Sharpe Ratio"
            value={variance.sharpeRatio.toFixed(2)}
            icon={Shield}
            tooltip="Risk-adjusted return (higher is better)"
          />
          <KPICard
            title="Max Drawdown"
            value={drawdown.maxDrawdownPercentage.toFixed(1)}
            suffix="%"
            icon={TrendingDown}
            trend="down"
            tooltip="Largest peak-to-trough decline"
          />
          <KPICard
            title="Avg Hold Time"
            value={avgHoldTime.toFixed(1)}
            suffix=" days"
            icon={Calendar}
            tooltip="Average time from bet to settlement"
          />
        </div>

        {/* Streak Information */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Flame className="size-8 text-[#f59e0b]" />
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  streaks.currentStreak.type === 'win'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : streaks.currentStreak.type === 'loss'
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {streaks.currentStreak.type === 'win'
                  ? 'Win Streak'
                  : streaks.currentStreak.type === 'loss'
                  ? 'Loss Streak'
                  : 'No Active Streak'}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
            <p className="text-3xl font-bold">{streaks.currentStreak.count}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="size-8 text-[#10b981]" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Longest Win Streak</p>
            <p className="text-3xl font-bold">{streaks.longestWinStreak}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="size-8 text-[#ef4444]" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Longest Loss Streak</p>
            <p className="text-3xl font-bold">{streaks.longestLossStreak}</p>
          </div>
        </div>

        {/* Advanced Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Cumulative Profit */}
          <ChartCard title="Cumulative Profit" description="Total profit over time">
            {cumulativeProfitData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cumulativeProfitData}>
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#profitGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data yet
              </div>
            )}
          </ChartCard>

          {/* ROI Over Time */}
          <ChartCard
            title="Rolling ROI"
            description="30-bet moving average"
            tooltip="Shows ROI trend over your last 30 bets"
          >
            {roiOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roiOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => `${value}%`}
                  />
                  <Line
                    type="monotone"
                    dataKey="roi"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Need at least 30 settled bets
              </div>
            )}
          </ChartCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Win Rate by Odds Range */}
          <ChartCard title="Performance by Odds" description="Win rate across odds ranges">
            {oddsDistribution.some((d) => d.wins + d.losses > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={oddsDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="range" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="wins" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="losses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data yet
              </div>
            )}
          </ChartCard>

          {/* Profit by Day of Week */}
          <ChartCard title="Profit by Day" description="Performance by day of week">
            {profitByDayOfWeek.some((d) => d.profit !== 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitByDayOfWeek}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => `₦${value}`}
                  />
                  <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data yet
              </div>
            )}
          </ChartCard>
        </div>

        {/* Drawdown Information */}
        {drawdown.maxDrawdown > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Drawdown Analysis</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Max Drawdown</p>
                <p className="text-2xl font-bold text-[#ef4444]">
                  ₦{drawdown.maxDrawdown.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Peak Bankroll</p>
                <p className="text-2xl font-bold">₦{drawdown.peakBankroll.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trough Bankroll</p>
                <p className="text-2xl font-bold">₦{drawdown.troughBankroll.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Drawdown %</p>
                <p className="text-2xl font-bold text-[#ef4444]">
                  {drawdown.maxDrawdownPercentage}%
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Kelly Calculator Modal */}
      <KellyCalculator open={showKellyCalc} onClose={() => setShowKellyCalc(false)} />
    </div>
  );
}