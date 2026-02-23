export interface Bet {
  id: string;
  date: string;
  event: string;
  market: string;
  odds: number;
  stake: number;
  bookmaker: string;
  status: 'pending' | 'won' | 'lost' | 'void' | 'cashout';
  profit: number;
  sport: string;
  league: string;
}

export interface Recommendation {
  id: string;
  sport: string;
  league: string;
  event: string;
  market: string;
  odds: number;
  confidence: 'low' | 'medium' | 'high';
  status: 'pending' | 'won' | 'lost' | 'void' | 'cashout';
  date: string;
  analysis?: string;
}

export interface KPIData {
  netProfit: number;
  roi: number;
  winRate: number;
  avgOdds: number;
  currentBankroll: number;
  totalBets: number;
  winningBets: number;
  losingBets: number;
  yield: number;
  maxDrawdown: number;
}

// Mock KPI Data
export const kpiData: KPIData = {
  netProfit: 2845.50,
  roi: 18.2,
  winRate: 56.8,
  avgOdds: 2.15,
  currentBankroll: 12845.50,
  totalBets: 147,
  winningBets: 84,
  losingBets: 58,
  yield: 16.4,
  maxDrawdown: -425.00
};

// Mock Bets Data
export const mockBets: Bet[] = [
  {
    id: '1',
    date: '2026-02-22',
    event: 'Lakers vs Warriors',
    market: 'Over 225.5',
    odds: 1.91,
    stake: 100,
    bookmaker: 'DraftKings',
    status: 'won',
    profit: 91,
    sport: 'Basketball',
    league: 'NBA'
  },
  {
    id: '2',
    date: '2026-02-22',
    event: 'Man City vs Arsenal',
    market: 'Man City -1.5',
    odds: 2.10,
    stake: 150,
    bookmaker: 'Bet365',
    status: 'pending',
    profit: 0,
    sport: 'Soccer',
    league: 'Premier League'
  },
  {
    id: '3',
    date: '2026-02-21',
    event: 'Celtics vs 76ers',
    market: 'Celtics ML',
    odds: 1.75,
    stake: 200,
    bookmaker: 'FanDuel',
    status: 'won',
    profit: 150,
    sport: 'Basketball',
    league: 'NBA'
  },
  {
    id: '4',
    date: '2026-02-21',
    event: 'Real Madrid vs Barcelona',
    market: 'BTTS Yes',
    odds: 1.83,
    stake: 120,
    bookmaker: 'DraftKings',
    status: 'lost',
    profit: -120,
    sport: 'Soccer',
    league: 'La Liga'
  },
  {
    id: '5',
    date: '2026-02-20',
    event: 'Bucks vs Nuggets',
    market: 'Under 232.5',
    odds: 1.95,
    stake: 100,
    bookmaker: 'Bet365',
    status: 'won',
    profit: 95,
    sport: 'Basketball',
    league: 'NBA'
  },
  {
    id: '6',
    date: '2026-02-20',
    event: 'PSG vs Lyon',
    market: 'PSG -2',
    odds: 2.25,
    stake: 80,
    bookmaker: 'FanDuel',
    status: 'lost',
    profit: -80,
    sport: 'Soccer',
    league: 'Ligue 1'
  },
  {
    id: '7',
    date: '2026-02-19',
    event: 'Suns vs Clippers',
    market: 'Over 218.5',
    odds: 1.88,
    stake: 150,
    bookmaker: 'DraftKings',
    status: 'won',
    profit: 132,
    sport: 'Basketball',
    league: 'NBA'
  },
  {
    id: '8',
    date: '2026-02-19',
    event: 'Liverpool vs Chelsea',
    market: 'Liverpool ML',
    odds: 1.65,
    stake: 200,
    bookmaker: 'Bet365',
    status: 'won',
    profit: 130,
    sport: 'Soccer',
    league: 'Premier League'
  },
  {
    id: '9',
    date: '2026-02-18',
    event: 'Heat vs Knicks',
    market: 'Knicks +4.5',
    odds: 1.91,
    stake: 100,
    bookmaker: 'FanDuel',
    status: 'cashout',
    profit: 45,
    sport: 'Basketball',
    league: 'NBA'
  },
  {
    id: '10',
    date: '2026-02-18',
    event: 'Bayern vs Dortmund',
    market: 'Over 3.5 Goals',
    odds: 2.10,
    stake: 120,
    bookmaker: 'DraftKings',
    status: 'void',
    profit: 0,
    sport: 'Soccer',
    league: 'Bundesliga'
  }
];

// Mock Recommendations
export const mockRecommendations: Recommendation[] = [
  {
    id: 'r1',
    sport: 'Basketball',
    league: 'NBA',
    event: 'Mavericks vs Thunder',
    market: 'Over 228.5',
    odds: 1.92,
    confidence: 'high',
    status: 'pending',
    date: '2026-02-23',
    analysis: 'Both teams averaging high scoring in recent matchups'
  },
  {
    id: 'r2',
    sport: 'Soccer',
    league: 'Premier League',
    event: 'Tottenham vs Newcastle',
    market: 'BTTS Yes',
    odds: 1.85,
    confidence: 'medium',
    status: 'pending',
    date: '2026-02-23',
    analysis: 'Strong attacking records for both teams'
  },
  {
    id: 'r3',
    sport: 'Basketball',
    league: 'NBA',
    event: 'Nets vs Hawks',
    market: 'Nets -3.5',
    odds: 2.05,
    confidence: 'medium',
    status: 'pending',
    date: '2026-02-23'
  },
  {
    id: 'r4',
    sport: 'Soccer',
    league: 'La Liga',
    event: 'Atletico vs Sevilla',
    market: 'Under 2.5 Goals',
    odds: 1.95,
    confidence: 'low',
    status: 'pending',
    date: '2026-02-24'
  },
  {
    id: 'r5',
    sport: 'Basketball',
    league: 'NBA',
    event: 'Jazz vs Spurs',
    market: 'Jazz ML',
    odds: 1.78,
    confidence: 'high',
    status: 'pending',
    date: '2026-02-24'
  }
];

// Chart Data - Profit Over Time
export const profitOverTimeData = [
  { date: 'Week 1', profit: 0 },
  { date: 'Week 2', profit: 245 },
  { date: 'Week 3', profit: 180 },
  { date: 'Week 4', profit: 520 },
  { date: 'Week 5', profit: 890 },
  { date: 'Week 6', profit: 1120 },
  { date: 'Week 7', profit: 985 },
  { date: 'Week 8', profit: 1340 },
  { date: 'Week 9', profit: 1680 },
  { date: 'Week 10', profit: 2050 },
  { date: 'Week 11', profit: 2320 },
  { date: 'Week 12', profit: 2845 }
];

// ROI by Sport
export const roiBySportData = [
  { sport: 'Basketball', roi: 22.5 },
  { sport: 'Soccer', roi: 15.8 },
  { sport: 'Baseball', roi: 18.2 },
  { sport: 'Hockey', roi: 12.4 },
  { sport: 'Tennis', roi: 16.7 }
];

// Performance by Odds Band
export const performanceByOddsData = [
  { range: '1.5-1.8', roi: 14.2, bets: 32 },
  { range: '1.8-2.1', roi: 18.5, bets: 45 },
  { range: '2.1-2.5', roi: 22.1, bets: 38 },
  { range: '2.5-3.0', roi: 15.8, bets: 22 },
  { range: '3.0+', roi: 8.3, bets: 10 }
];

// Bookmaker Comparison
export const bookmakerComparisonData = [
  { bookmaker: 'DraftKings', roi: 19.5, volume: 4520 },
  { bookmaker: 'FanDuel', roi: 17.2, volume: 3890 },
  { bookmaker: 'Bet365', roi: 21.3, volume: 3240 },
  { bookmaker: 'BetMGM', roi: 15.8, volume: 2150 }
];

// Stake Distribution
export const stakeDistributionData = [
  { range: '$50-100', count: 45 },
  { range: '$100-150', count: 62 },
  { range: '$150-200', count: 28 },
  { range: '$200+', count: 12 }
];
