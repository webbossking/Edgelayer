import { Bet } from './api';

// Kelly Criterion Calculator
export interface KellyResult {
  kellyPercentage: number;
  recommendedStake: number;
  isSafe: boolean;
  warning?: string;
}

export function calculateKelly(
  odds: number,
  winProbability: number,
  bankroll: number,
  fraction: number = 0.25 // Quarter Kelly by default for safety
): KellyResult {
  // Kelly formula: f = (bp - q) / b
  // where:
  // f = fraction of bankroll to bet
  // b = decimal odds - 1
  // p = probability of winning
  // q = probability of losing (1 - p)

  const b = odds - 1;
  const p = winProbability;
  const q = 1 - p;

  const kellyFraction = (b * p - q) / b;
  const fractionalKelly = kellyFraction * fraction;

  // Apply fraction for safety (quarter Kelly)
  const kellyPercentage = Math.max(0, Math.min(fractionalKelly * 100, 100));
  const recommendedStake = (bankroll * kellyPercentage) / 100;

  // Safety checks
  const isSafe = kellyPercentage > 0 && kellyPercentage <= 10; // Max 10% recommended
  let warning: string | undefined;

  if (kellyPercentage === 0) {
    warning = 'No edge detected - Kelly suggests not betting';
  } else if (kellyPercentage > 10) {
    warning = 'Kelly stake very high - consider reducing bet size';
  } else if (kellyPercentage < 0) {
    warning = 'Negative edge - avoid this bet';
  }

  return {
    kellyPercentage: Math.round(kellyPercentage * 100) / 100,
    recommendedStake: Math.round(recommendedStake * 100) / 100,
    isSafe,
    warning,
  };
}

// Expected Value (EV) Calculator
export interface EVResult {
  expectedValue: number;
  expectedValuePercentage: number;
  isPositiveEV: boolean;
  breakEvenProbability: number;
}

export function calculateEV(
  odds: number,
  winProbability: number,
  stake: number
): EVResult {
  // EV = (Win Probability × Profit if Win) - (Loss Probability × Stake)
  const profitIfWin = stake * (odds - 1);
  const lossProbability = 1 - winProbability;

  const expectedValue = winProbability * profitIfWin - lossProbability * stake;
  const expectedValuePercentage = (expectedValue / stake) * 100;

  // Break-even probability (where EV = 0)
  const breakEvenProbability = 1 / odds;

  return {
    expectedValue: Math.round(expectedValue * 100) / 100,
    expectedValuePercentage: Math.round(expectedValuePercentage * 100) / 100,
    isPositiveEV: expectedValue > 0,
    breakEvenProbability: Math.round(breakEvenProbability * 10000) / 100,
  };
}

// Closing Line Value (CLV) Calculator
export interface CLVResult {
  clvPercentage: number;
  isBeatingClosing: boolean;
  oddsImprovement: number;
}

export function calculateCLV(
  openingOdds: number,
  closingOdds: number
): CLVResult {
  // CLV measures if you got better odds than closing
  // Positive CLV means you beat the closing line
  const clvPercentage = ((closingOdds - openingOdds) / openingOdds) * 100;
  const isBeatingClosing = clvPercentage > 0;
  const oddsImprovement = closingOdds - openingOdds;

  return {
    clvPercentage: Math.round(clvPercentage * 100) / 100,
    isBeatingClosing,
    oddsImprovement: Math.round(oddsImprovement * 100) / 100,
  };
}

// Calculate win streak
export function calculateStreaks(bets: Bet[]): {
  currentStreak: { type: 'win' | 'loss' | 'none'; count: number };
  longestWinStreak: number;
  longestLossStreak: number;
} {
  if (bets.length === 0) {
    return {
      currentStreak: { type: 'none', count: 0 },
      longestWinStreak: 0,
      longestLossStreak: 0,
    };
  }

  // Sort by date descending (most recent first)
  const sortedBets = [...bets]
    .filter((b) => b.status === 'won' || b.status === 'lost')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let currentStreak = { type: 'none' as 'win' | 'loss' | 'none', count: 0 };
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;

  sortedBets.forEach((bet, index) => {
    if (index === 0) {
      currentStreak = {
        type: bet.status === 'won' ? 'win' : 'loss',
        count: 1,
      };
      if (bet.status === 'won') currentWinStreak = 1;
      else currentLossStreak = 1;
    } else {
      const prevStreak = currentStreak.type;
      const currentType = bet.status === 'won' ? 'win' : 'loss';

      if (prevStreak === currentType) {
        currentStreak.count++;
        if (currentType === 'win') currentWinStreak++;
        else currentLossStreak++;
      } else {
        // Streak broken, update longest and reset
        if (prevStreak === 'win') {
          longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
          currentWinStreak = 0;
          currentLossStreak = 1;
        } else {
          longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
          currentLossStreak = 0;
          currentWinStreak = 1;
        }
      }
    }
  });

  // Final check for longest streaks
  longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
  longestLossStreak = Math.max(longestLossStreak, currentLossStreak);

  return {
    currentStreak,
    longestWinStreak,
    longestLossStreak,
  };
}

// Calculate maximum drawdown
export function calculateMaxDrawdown(bets: Bet[]): {
  maxDrawdown: number;
  maxDrawdownPercentage: number;
  peakBankroll: number;
  troughBankroll: number;
} {
  if (bets.length === 0) {
    return {
      maxDrawdown: 0,
      maxDrawdownPercentage: 0,
      peakBankroll: 0,
      troughBankroll: 0,
    };
  }

  // Sort by date ascending
  const sortedBets = [...bets]
    .filter((b) => b.status === 'won' || b.status === 'lost')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningBankroll = 0;
  let peakBankroll = 0;
  let maxDrawdown = 0;
  let troughBankroll = 0;

  sortedBets.forEach((bet) => {
    runningBankroll += bet.profit;

    if (runningBankroll > peakBankroll) {
      peakBankroll = runningBankroll;
    }

    const currentDrawdown = peakBankroll - runningBankroll;
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
      troughBankroll = runningBankroll;
    }
  });

  const maxDrawdownPercentage =
    peakBankroll > 0 ? (maxDrawdown / peakBankroll) * 100 : 0;

  return {
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    maxDrawdownPercentage: Math.round(maxDrawdownPercentage * 100) / 100,
    peakBankroll: Math.round(peakBankroll * 100) / 100,
    troughBankroll: Math.round(troughBankroll * 100) / 100,
  };
}

// Calculate variance and standard deviation
export function calculateVariance(bets: Bet[]): {
  variance: number;
  standardDeviation: number;
  sharpeRatio: number;
} {
  const settledBets = bets.filter((b) => b.status === 'won' || b.status === 'lost');

  if (settledBets.length === 0) {
    return { variance: 0, standardDeviation: 0, sharpeRatio: 0 };
  }

  const mean = settledBets.reduce((sum, bet) => sum + bet.profit, 0) / settledBets.length;

  const squaredDiffs = settledBets.map((bet) => Math.pow(bet.profit - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / settledBets.length;
  const standardDeviation = Math.sqrt(variance);

  // Sharpe ratio (simplified): mean return / standard deviation
  const sharpeRatio = standardDeviation > 0 ? mean / standardDeviation : 0;

  return {
    variance: Math.round(variance * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
  };
}

// Profit factor calculation
export function calculateProfitFactor(bets: Bet[]): number {
  const wins = bets.filter((b) => b.status === 'won');
  const losses = bets.filter((b) => b.status === 'lost');

  const totalWins = wins.reduce((sum, bet) => sum + Math.abs(bet.profit), 0);
  const totalLosses = losses.reduce((sum, bet) => sum + Math.abs(bet.profit), 0);

  if (totalLosses === 0) return totalWins > 0 ? Infinity : 0;

  return Math.round((totalWins / totalLosses) * 100) / 100;
}

// Calculate average hold time (days from bet to settlement)
export function calculateAvgHoldTime(bets: Bet[]): number {
  const settledBets = bets.filter(
    (b) => (b.status === 'won' || b.status === 'lost') && b.createdAt
  );

  if (settledBets.length === 0) return 0;

  const holdTimes = settledBets.map((bet) => {
    const betDate = new Date(bet.createdAt!);
    const settleDate = new Date(bet.updatedAt || bet.createdAt!);
    return Math.abs(settleDate.getTime() - betDate.getTime()) / (1000 * 60 * 60 * 24);
  });

  const avgHoldTime = holdTimes.reduce((sum, time) => sum + time, 0) / holdTimes.length;
  return Math.round(avgHoldTime * 10) / 10;
}
