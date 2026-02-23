import { useMemo } from 'react';
import { TrendingUp, DollarSign, Target, BarChart3, Wallet } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Header } from '../components/Header';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { format, subDays, parseISO } from 'date-fns';

export function Dashboard() {
  const { bets, betsLoading, stats, statsLoading, settings } = useData();
  const { isAuthenticated } = useAuth();

  // Calculate profit over time data
  const profitOverTimeData = useMemo(() => {
    if (!bets || bets.length === 0) return [];

    // Sort bets by date
    const sortedBets = [...bets].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by week
    const weeklyData: Record<string, { date: string; profit: number; totalProfit: number }> = {};
    let cumulativeProfit = 0;

    sortedBets.forEach(bet => {
      if (bet.status !== 'pending') {
        const weekStart = format(parseISO(bet.date), 'MMM dd');
        if (!weeklyData[weekStart]) {
          weeklyData[weekStart] = { date: weekStart, profit: 0, totalProfit: 0 };
        }
        weeklyData[weekStart].profit += bet.profit;
        cumulativeProfit += bet.profit;
        weeklyData[weekStart].totalProfit = cumulativeProfit;
      }
    });

    return Object.values(weeklyData).slice(-12); // Last 12 weeks
  }, [bets]);

  // Calculate ROI by sport
  const roiBySportData = useMemo(() => {
    if (!bets || bets.length === 0) return [];

    const sportStats: Record<string, { sport: string; roi: number; totalStake: number; totalProfit: number }> = {};

    bets.forEach(bet => {
      if (bet.status !== 'pending') {
        if (!sportStats[bet.sport]) {
          sportStats[bet.sport] = { sport: bet.sport, roi: 0, totalStake: 0, totalProfit: 0 };
        }
        sportStats[bet.sport].totalStake += bet.stake;
        sportStats[bet.sport].totalProfit += bet.profit;
      }
    });

    return Object.values(sportStats).map(stat => ({
      sport: stat.sport,
      roi: stat.totalStake > 0 ? (stat.totalProfit / stat.totalStake) * 100 : 0,
    })).sort((a, b) => b.roi - a.roi);
  }, [bets]);

  // Calculate stake distribution
  const stakeDistributionData = useMemo(() => {
    if (!bets || bets.length === 0) return [];

    const statusGroups: Record<string, number> = {
      won: 0,
      lost: 0,
      pending: 0,
      void: 0,
      cashout: 0,
    };

    bets.forEach(bet => {
      statusGroups[bet.status] += bet.stake;
    });

    return Object.entries(statusGroups)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [bets]);

  const recentBets = useMemo(() => bets.slice(0, 5), [bets]);

  const COLORS = {
    won: '#10b981',
    lost: '#ef4444',
    pending: '#f59e0b',
    void: '#6b7280',
    cashout: '#3b82f6',
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
            <p className="text-muted-foreground">Sign in to view your dashboard</p>
          </div>
        </main>
      </div>
    );
  }

  if (statsLoading || betsLoading) {
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
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Your betting performance at a glance
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <KPICard
            title="Net Profit"
            value={(stats?.netProfit || 0).toFixed(2)}
            prefix="₦"
            icon={DollarSign}
            trend={stats && stats.netProfit > 0 ? 'up' : stats && stats.netProfit < 0 ? 'down' : undefined}
          />
          <KPICard
            title="ROI"
            value={(stats?.roi || 0).toFixed(1)}
            suffix="%"
            icon={TrendingUp}
            trend={stats && stats.roi > 0 ? 'up' : stats && stats.roi < 0 ? 'down' : undefined}
          />
          <KPICard
            title="Win Rate"
            value={(stats?.winRate || 0).toFixed(1)}
            suffix="%"
            icon={Target}
          />
          <KPICard
            title="Avg Odds"
            value={(stats?.avgOdds || 0).toFixed(2)}
            icon={BarChart3}
          />
          <KPICard
            title="Current Bankroll"
            value={(settings?.currentBankroll || 0).toLocaleString()}
            prefix="₦"
            icon={Wallet}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Profit Over Time */}
          <ChartCard title="Profit Over Time" description="Cumulative profit">
            {profitOverTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitOverTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalProfit"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data yet. Start adding bets to see your profit over time.
              </div>
            )}
          </ChartCard>

          {/* ROI by Sport */}
          <ChartCard title="ROI by Sport" description="Return on investment">
            {roiBySportData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiBySportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="sport"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => `${value.toFixed(1)}%`}
                  />
                  <Bar dataKey="roi" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data yet. Add bets from different sports to see ROI comparison.
              </div>
            )}
          </ChartCard>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stake Distribution */}
          <div className="lg:col-span-1">
            <ChartCard title="Stake Distribution" description="By status">
              {stakeDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stakeDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ₦${entry.value.toFixed(0)}`}
                    >
                      {stakeDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name as keyof typeof COLORS] || '#6366f1'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data yet.
                </div>
              )}
            </ChartCard>
          </div>

          {/* Recent Bets */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Recent Bets</h3>
              {recentBets.length > 0 ? (
                <div className="space-y-3">
                  {recentBets.map((bet) => (
                    <div
                      key={bet.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{bet.event}</p>
                        <p className="text-xs text-muted-foreground">
                          {bet.market} • {bet.sport}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{bet.odds.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            ₦{bet.stake.toFixed(0)}
                          </p>
                        </div>
                        <StatusBadge status={bet.status} />
                        <div
                          className={`text-sm font-medium w-20 text-right ${
                            bet.profit > 0
                              ? 'text-[#10b981] dark:text-[#34d399]'
                              : bet.profit < 0
                              ? 'text-[#ef4444] dark:text-[#f87171]'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {bet.profit > 0 ? '+' : ''}₦{bet.profit.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No bets yet. Start tracking your first bet!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}