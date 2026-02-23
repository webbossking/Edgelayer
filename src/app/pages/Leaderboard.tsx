import { useState, useMemo, useRef } from 'react';
import { Trophy, Medal, TrendingUp, Share2, Download, ArrowUpDown, Calendar, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { BrandButton } from '../components/BrandButton';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

type TimeFrame = 'today' | 'week' | 'month' | 'alltime';
type MetricType = 'roi' | 'profit' | 'winrate';

interface LeaderboardEntry {
  id: string;
  name: string;
  rank: number;
  roi: number;
  profit: number;
  winRate: number;
  totalBets: number;
  isCurrentUser?: boolean;
}

export function Leaderboard() {
  const { bets, stats } = useData();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<TimeFrame>('week');
  const [metric, setMetric] = useState<MetricType>('roi');
  const [showShareModal, setShowShareModal] = useState(false);
  const statsCardRef = useRef<HTMLDivElement>(null);

  // Generate mock leaderboard data (in production, this would come from backend)
  const leaderboardData = useMemo((): LeaderboardEntry[] => {
    // Mock data for demonstration
    const mockUsers: LeaderboardEntry[] = [
      { id: '1', name: 'Bettor #1234', rank: 1, roi: 24.5, profit: 145800, winRate: 62.3, totalBets: 247 },
      { id: '2', name: 'Bettor #5678', rank: 2, roi: 21.2, profit: 132500, winRate: 59.1, totalBets: 189 },
      { id: '3', name: 'Bettor #9012', rank: 3, roi: 18.9, profit: 98400, winRate: 57.8, totalBets: 156 },
      { id: '4', name: 'Bettor #3456', rank: 4, roi: 16.7, profit: 87200, winRate: 56.4, totalBets: 203 },
      { id: '5', name: 'Bettor #7890', rank: 5, roi: 15.3, profit: 76900, winRate: 55.2, totalBets: 178 },
      { id: '6', name: 'Bettor #2345', rank: 6, roi: 14.1, profit: 65300, winRate: 54.1, totalBets: 145 },
      { id: '7', name: 'Bettor #6789', rank: 7, roi: 12.8, profit: 58700, winRate: 53.3, totalBets: 167 },
      { id: '8', name: 'Bettor #0123', rank: 8, roi: 11.5, profit: 52100, winRate: 52.6, totalBets: 134 },
      { id: '9', name: 'Bettor #4567', rank: 9, roi: 10.2, profit: 47500, winRate: 51.8, totalBets: 198 },
      { id: '10', name: 'Bettor #8901', rank: 10, roi: 9.4, profit: 42300, winRate: 51.2, totalBets: 156 },
    ];

    // Add current user if they have stats
    if (stats && bets.length > 0) {
      const userEntry: LeaderboardEntry = {
        id: user?.id || 'current',
        name: 'You',
        rank: 15, // Mock rank
        roi: stats.roi || 0,
        profit: stats.totalProfit || 0,
        winRate: stats.winRate || 0,
        totalBets: stats.totalBets || 0,
        isCurrentUser: true,
      };

      // Insert user at appropriate rank
      mockUsers.push(userEntry);
    }

    // Sort by selected metric
    const sorted = [...mockUsers].sort((a, b) => {
      switch (metric) {
        case 'roi':
          return b.roi - a.roi;
        case 'profit':
          return b.profit - a.profit;
        case 'winrate':
          return b.winRate - a.winRate;
        default:
          return 0;
      }
    });

    // Update ranks
    return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [stats, bets, user, metric]);

  // Get medal for top 3
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-6 text-[#FFD700]" />;
    if (rank === 2) return <Medal className="size-6 text-[#C0C0C0]" />;
    if (rank === 3) return <Medal className="size-6 text-[#CD7F32]" />;
    return null;
  };

  // Get metric value for display
  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (metric) {
      case 'roi':
        return `${entry.roi.toFixed(1)}%`;
      case 'profit':
        return `₦${entry.profit.toLocaleString()}`;
      case 'winrate':
        return `${entry.winRate.toFixed(1)}%`;
      default:
        return '';
    }
  };

  // Download stats card as image
  const handleDownloadStats = async () => {
    if (!statsCardRef.current) return;

    try {
      const canvas = await html2canvas(statsCardRef.current, {
        backgroundColor: '#09090b',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = 'edgeledger-stats.png';
      link.href = canvas.toDataURL();
      link.click();

      toast.success('Stats card downloaded!');
    } catch (error) {
      console.error('Failed to download stats:', error);
      toast.error('Failed to download stats card');
    }
  };

  // Share to social media
  const handleShare = (platform: 'twitter' | 'whatsapp' | 'copy') => {
    const text = `🎯 My EdgeLedger Stats:\n\n📊 ROI: ${stats?.roi.toFixed(1)}%\n💰 Profit: ₦${stats?.totalProfit.toLocaleString()}\n🎲 Win Rate: ${stats?.winRate.toFixed(1)}%\n🔥 Total Bets: ${stats?.totalBets}\n\nTrack your bets like a pro! 🚀`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(text);
        toast.success('Stats copied to clipboard!');
        break;
    }

    setShowShareModal(false);
  };

  const currentUser = leaderboardData.find(entry => entry.isCurrentUser);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="size-8 text-[#6366f1]" />
              Leaderboard
            </h1>
            {currentUser && (
              <BrandButton
                variant="secondary"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="size-4 mr-2" />
                Share Stats
              </BrandButton>
            )}
          </div>
          <p className="text-muted-foreground">
            See how you stack up against other bettors
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Timeframe Filter */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="size-4" />
                Timeframe
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                  { value: 'alltime', label: 'All Time' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeframe(option.value as TimeFrame)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      timeframe === option.value
                        ? 'bg-[#6366f1] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Filter */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <ArrowUpDown className="size-4" />
                Sort By
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'roi', label: 'ROI' },
                  { value: 'profit', label: 'Profit' },
                  { value: 'winrate', label: 'Win Rate' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setMetric(option.value as MetricType)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      metric === option.value
                        ? 'bg-[#6366f1] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Leaderboard List */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-muted/30 px-6 py-4 border-b border-border">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-4">Bettor</div>
                  <div className="col-span-2 text-right">
                    {metric === 'roi' && 'ROI'}
                    {metric === 'profit' && 'Profit'}
                    {metric === 'winrate' && 'Win Rate'}
                  </div>
                  <div className="col-span-2 text-right">Win Rate</div>
                  <div className="col-span-3 text-right">Total Bets</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {leaderboardData.slice(0, 20).map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'px-6 py-4 hover:bg-muted/50 transition-colors',
                      entry.isCurrentUser && 'bg-[#6366f1]/5 border-l-4 border-l-[#6366f1]'
                    )}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1">
                        {getMedalIcon(entry.rank) || (
                          <span className="text-lg font-bold text-muted-foreground">
                            {entry.rank}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <div className="col-span-4">
                        <span className={cn(
                          'font-medium',
                          entry.isCurrentUser && 'text-[#6366f1]'
                        )}>
                          {entry.name}
                        </span>
                      </div>

                      {/* Main Metric */}
                      <div className="col-span-2 text-right">
                        <span className="font-bold text-lg">
                          {getMetricValue(entry)}
                        </span>
                      </div>

                      {/* Win Rate */}
                      <div className="col-span-2 text-right">
                        <span className="text-muted-foreground">
                          {entry.winRate.toFixed(1)}%
                        </span>
                      </div>

                      {/* Total Bets */}
                      <div className="col-span-3 text-right">
                        <span className="text-muted-foreground">
                          {entry.totalBets} bets
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Stats Sidebar */}
          <div className="space-y-6">
            {currentUser && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Your Rank</h3>
                  <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">#{currentUser.rank}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">ROI</span>
                    <span className="font-bold">{currentUser.roi.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Total Profit</span>
                    <span className="font-bold">₦{currentUser.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Win Rate</span>
                    <span className="font-bold">{currentUser.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Total Bets</span>
                    <span className="font-bold">{currentUser.totalBets}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tips Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="size-5 text-[#6366f1]" />
                <h3 className="font-semibold">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Climb the ranks by maintaining consistent positive ROI</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Quality over quantity - focus on value bets</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Track your bets daily for better insights</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Share your success to inspire others!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && currentUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Share Your Stats</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stats Card Preview */}
            <div
              ref={statsCardRef}
              className="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl p-8 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <p className="text-white/80 text-sm">EdgeLedger</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">Rank</p>
                  <p className="text-3xl font-bold text-white">#{currentUser.rank}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-white/70 text-xs mb-1">ROI</p>
                  <p className="text-2xl font-bold text-white">{currentUser.roi.toFixed(1)}%</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-white/70 text-xs mb-1">Profit</p>
                  <p className="text-xl font-bold text-white">₦{(currentUser.profit / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-white/70 text-xs mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-white">{currentUser.winRate.toFixed(1)}%</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-white/70 text-xs mb-1">Bets</p>
                  <p className="text-2xl font-bold text-white">{currentUser.totalBets}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 text-center">
                <p className="text-white/60 text-xs">Track your bets like a pro 🚀</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
              <BrandButton
                variant="primary"
                className="w-full"
                onClick={() => handleShare('twitter')}
              >
                <Share2 className="size-4 mr-2" />
                Share to Twitter
              </BrandButton>
              <BrandButton
                variant="secondary"
                className="w-full"
                onClick={() => handleShare('whatsapp')}
              >
                <Share2 className="size-4 mr-2" />
                Share to WhatsApp
              </BrandButton>
              <BrandButton
                variant="ghost"
                className="w-full"
                onClick={handleDownloadStats}
              >
                <Download className="size-4 mr-2" />
                Download Image
              </BrandButton>
              <BrandButton
                variant="ghost"
                className="w-full"
                onClick={() => handleShare('copy')}
              >
                Copy Stats Text
              </BrandButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
