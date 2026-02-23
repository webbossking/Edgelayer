import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Radio, CheckCircle2, XCircle, AlertCircle, Activity } from 'lucide-react';
import { Bet } from '../../utils/api';
import { cn } from './ui/utils';
import { formatDistanceToNow } from 'date-fns';
import { BrandButton } from './BrandButton';

interface GameData {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'pre-game' | 'live' | 'finished';
  minute?: number;
  period?: string;
}

interface LiveBetCardProps {
  bet: Bet;
  onSettle?: (betId: string, status: 'won' | 'lost' | 'void') => void;
}

export function LiveBetCard({ bet, onSettle }: LiveBetCardProps) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [autoSettling, setAutoSettling] = useState(false);

  // Mock live game data fetching (in production, this would be a real API)
  useEffect(() => {
    if (bet.status !== 'pending') return;

    // Simulate fetching game data
    const fetchGameData = () => {
      // Mock game data based on bet event
      const teams = bet.event.split(' vs ');
      const mockData: GameData = {
        homeTeam: teams[0] || 'Home',
        awayTeam: teams[1] || 'Away',
        homeScore: Math.floor(Math.random() * 3),
        awayScore: Math.floor(Math.random() * 3),
        status: Math.random() > 0.7 ? 'live' : Math.random() > 0.5 ? 'pre-game' : 'finished',
        minute: Math.floor(Math.random() * 90),
        period: '2nd Half'
      };

      setGameData(mockData);

      // Auto-settle if game is finished
      if (mockData.status === 'finished' && !autoSettling) {
        setAutoSettling(true);
        setTimeout(() => {
          // Simulate determining bet outcome
          const won = Math.random() > 0.5;
          onSettle?.(bet.id, won ? 'won' : 'lost');
        }, 2000);
      }
    };

    fetchGameData();

    // Update every 30 seconds for live games
    const interval = setInterval(fetchGameData, 30000);

    return () => clearInterval(interval);
  }, [bet, onSettle, autoSettling]);

  const getStatusIcon = () => {
    switch (bet.status) {
      case 'won':
        return <CheckCircle2 className="size-5 text-[#10b981]" />;
      case 'lost':
        return <XCircle className="size-5 text-[#ef4444]" />;
      case 'void':
        return <AlertCircle className="size-5 text-muted-foreground" />;
      default:
        return gameData?.status === 'live' ? (
          <Radio className="size-5 text-[#ef4444] animate-pulse" />
        ) : (
          <Clock className="size-5 text-muted-foreground" />
        );
    }
  };

  const getStatusBadge = () => {
    if (bet.status !== 'pending') {
      return (
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          bet.status === 'won' && 'bg-[#10b981]/10 text-[#10b981]',
          bet.status === 'lost' && 'bg-[#ef4444]/10 text-[#ef4444]',
          bet.status === 'void' && 'bg-muted text-muted-foreground'
        )}>
          {bet.status.toUpperCase()}
        </span>
      );
    }

    if (!gameData) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          LOADING...
        </span>
      );
    }

    switch (gameData.status) {
      case 'live':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#ef4444]/10 text-[#ef4444] flex items-center gap-1">
            <span className="size-2 bg-[#ef4444] rounded-full animate-pulse" />
            LIVE
          </span>
        );
      case 'finished':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            FINISHED
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#6366f1]/10 text-[#6366f1]">
            SCHEDULED
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-card border rounded-xl p-4 hover:shadow-lg transition-shadow',
        bet.status === 'won' && 'border-[#10b981]/30',
        bet.status === 'lost' && 'border-[#ef4444]/30',
        gameData?.status === 'live' && bet.status === 'pending' && 'border-[#ef4444]/30 shadow-lg'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-sm">{bet.sport}</p>
            <p className="text-xs text-muted-foreground">{bet.league}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Live Score Display */}
      {gameData && bet.status === 'pending' && (
        <div className="bg-muted/30 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm font-medium">{gameData.homeTeam}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{gameData.homeScore}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-2xl font-bold">{gameData.awayScore}</span>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium">{gameData.awayTeam}</p>
            </div>
          </div>
          {gameData.status === 'live' && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Activity className="size-3" />
              <span>{gameData.minute}'</span>
              <span>•</span>
              <span>{gameData.period}</span>
            </div>
          )}
          {gameData.status === 'pre-game' && (
            <p className="text-xs text-center text-muted-foreground">
              Starts {formatDistanceToNow(new Date(bet.date), { addSuffix: true })}
            </p>
          )}
        </div>
      )}

      {/* Bet Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Event</span>
          <span className="text-sm font-medium">{bet.event}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Market</span>
          <span className="text-sm font-medium">{bet.market}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Odds</span>
          <span className="text-sm font-medium">{bet.odds.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stake</span>
          <span className="text-sm font-medium">₦{bet.stake.toLocaleString()}</span>
        </div>
        {bet.status !== 'pending' && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm font-medium">Result</span>
            <span className={cn(
              'text-sm font-bold',
              bet.profit > 0 && 'text-[#10b981]',
              bet.profit < 0 && 'text-[#ef4444]'
            )}>
              {bet.profit > 0 ? '+' : ''}₦{bet.profit.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Auto-settling indicator */}
      {autoSettling && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-border"
        >
          <div className="flex items-center gap-2 text-sm text-[#6366f1]">
            <div className="size-4 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
            <span>Auto-settling bet...</span>
          </div>
        </motion.div>
      )}

      {/* Manual Settlement Buttons */}
      {bet.status === 'pending' && gameData?.status === 'finished' && !autoSettling && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-border flex gap-2"
        >
          <BrandButton
            variant="ghost"
            size="sm"
            className="flex-1 text-[#10b981] hover:bg-[#10b981]/10"
            onClick={() => onSettle?.(bet.id, 'won')}
          >
            <CheckCircle2 className="size-4 mr-1" />
            Won
          </BrandButton>
          <BrandButton
            variant="ghost"
            size="sm"
            className="flex-1 text-[#ef4444] hover:bg-[#ef4444]/10"
            onClick={() => onSettle?.(bet.id, 'lost')}
          >
            <XCircle className="size-4 mr-1" />
            Lost
          </BrandButton>
        </motion.div>
      )}
    </motion.div>
  );
}
