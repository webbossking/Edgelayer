import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d1e0db95`;

// Initialize Supabase client
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Get auth token
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || '';
};

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

// ==================== AUTH API ====================

export const authAPI = {
  async signup(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};

// ==================== BETS API ====================

export interface Bet {
  id: string;
  userId?: string;
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
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const betsAPI = {
  async getAll(): Promise<Bet[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    
    // Map database columns to interface
    return (data || []).map(bet => ({
      id: bet.id,
      userId: bet.user_id,
      date: bet.date,
      event: bet.event,
      market: bet.market,
      odds: bet.odds,
      stake: bet.stake,
      bookmaker: bet.bookmaker,
      status: bet.status,
      profit: bet.profit,
      sport: bet.sport,
      league: bet.league,
      notes: bet.notes,
      createdAt: bet.created_at,
      updatedAt: bet.updated_at,
    }));
  },

  async getById(id: string): Promise<Bet> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Bet not found');

    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      event: data.event,
      market: data.market,
      odds: data.odds,
      stake: data.stake,
      bookmaker: data.bookmaker,
      status: data.status,
      profit: data.profit,
      sport: data.sport,
      league: data.league,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async create(bet: Omit<Bet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Bet> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bets')
      .insert({
        user_id: user.id,
        date: bet.date,
        event: bet.event,
        market: bet.market,
        odds: bet.odds,
        stake: bet.stake,
        bookmaker: bet.bookmaker,
        status: bet.status,
        profit: bet.profit,
        sport: bet.sport,
        league: bet.league,
        notes: bet.notes,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create bet');

    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      event: data.event,
      market: data.market,
      odds: data.odds,
      stake: data.stake,
      bookmaker: data.bookmaker,
      status: data.status,
      profit: data.profit,
      sport: data.sport,
      league: data.league,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async update(id: string, updates: Partial<Bet>): Promise<Bet> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updateData: any = {};
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.event !== undefined) updateData.event = updates.event;
    if (updates.market !== undefined) updateData.market = updates.market;
    if (updates.odds !== undefined) updateData.odds = updates.odds;
    if (updates.stake !== undefined) updateData.stake = updates.stake;
    if (updates.bookmaker !== undefined) updateData.bookmaker = updates.bookmaker;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.profit !== undefined) updateData.profit = updates.profit;
    if (updates.sport !== undefined) updateData.sport = updates.sport;
    if (updates.league !== undefined) updateData.league = updates.league;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { data, error } = await supabase
      .from('bets')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update bet');

    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      event: data.event,
      market: data.market,
      odds: data.odds,
      stake: data.stake,
      bookmaker: data.bookmaker,
      status: data.status,
      profit: data.profit,
      sport: data.sport,
      league: data.league,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('bets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async bulkDelete(betIds: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('bets')
      .delete()
      .in('id', betIds)
      .eq('user_id', user.id);

    if (error) throw error;
  },
};

// ==================== SETTINGS API ====================

export interface Settings {
  startingBankroll: number;
  currentBankroll: number;
  weeklyBudget: number;
  monthlyBudget: number;
  unitSize: number;
  stopLoss: number;
  stopLossEnabled: boolean;
  coolOffEnabled: boolean;
  currency: string;
  oddsFormat: string;
  timezone: string;
  notifications: {
    betResults: boolean;
    recommendations: boolean;
    budgetAlerts: boolean;
    weeklyReport: boolean;
  };
}

export const settingsAPI = {
  async get(): Promise<Settings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        const defaultSettings = {
          user_id: user.id,
          starting_bankroll: 10000,
          current_bankroll: 10000,
          weekly_budget: 1000,
          monthly_budget: 4000,
          unit_size: 1,
          stop_loss: 1000,
          stop_loss_enabled: true,
          cool_off_enabled: false,
          currency: 'NGN',
          odds_format: 'decimal',
          timezone: 'Africa/Lagos',
          notifications: {
            betResults: true,
            recommendations: true,
            budgetAlerts: true,
            weeklyReport: false,
          },
        };

        const { data: newData, error: createError } = await supabase
          .from('settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) throw createError;
        data = newData;
      } else {
        throw error;
      }
    }

    if (!data) throw new Error('Failed to load settings');

    return {
      startingBankroll: data.starting_bankroll,
      currentBankroll: data.current_bankroll,
      weeklyBudget: data.weekly_budget,
      monthlyBudget: data.monthly_budget,
      unitSize: data.unit_size,
      stopLoss: data.stop_loss,
      stopLossEnabled: data.stop_loss_enabled,
      coolOffEnabled: data.cool_off_enabled,
      currency: data.currency,
      oddsFormat: data.odds_format,
      timezone: data.timezone,
      notifications: data.notifications,
    };
  },

  async update(updates: Partial<Settings>): Promise<Settings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updateData: any = {};
    if (updates.startingBankroll !== undefined) updateData.starting_bankroll = updates.startingBankroll;
    if (updates.currentBankroll !== undefined) updateData.current_bankroll = updates.currentBankroll;
    if (updates.weeklyBudget !== undefined) updateData.weekly_budget = updates.weeklyBudget;
    if (updates.monthlyBudget !== undefined) updateData.monthly_budget = updates.monthlyBudget;
    if (updates.unitSize !== undefined) updateData.unit_size = updates.unitSize;
    if (updates.stopLoss !== undefined) updateData.stop_loss = updates.stopLoss;
    if (updates.stopLossEnabled !== undefined) updateData.stop_loss_enabled = updates.stopLossEnabled;
    if (updates.coolOffEnabled !== undefined) updateData.cool_off_enabled = updates.coolOffEnabled;
    if (updates.currency !== undefined) updateData.currency = updates.currency;
    if (updates.oddsFormat !== undefined) updateData.odds_format = updates.oddsFormat;
    if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
    if (updates.notifications !== undefined) updateData.notifications = updates.notifications;

    const { data, error } = await supabase
      .from('settings')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update settings');

    return {
      startingBankroll: data.starting_bankroll,
      currentBankroll: data.current_bankroll,
      weeklyBudget: data.weekly_budget,
      monthlyBudget: data.monthly_budget,
      unitSize: data.unit_size,
      stopLoss: data.stop_loss,
      stopLossEnabled: data.stop_loss_enabled,
      coolOffEnabled: data.cool_off_enabled,
      currency: data.currency,
      oddsFormat: data.odds_format,
      timezone: data.timezone,
      notifications: data.notifications,
    };
  },
};

// ==================== ANALYTICS API ====================

export interface Stats {
  netProfit: number;
  roi: number;
  winRate: number;
  avgOdds: number;
  totalBets: number;
  winningBets: number;
  losingBets: number;
  pendingBets: number;
  yield: number;
  maxDrawdown: number;
}

export const analyticsAPI = {
  async getStats(): Promise<Stats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get all bets for the user
    const { data: bets, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    // Calculate stats from bets
    const allBets = bets || [];
    const settledBets = allBets.filter(bet => bet.status !== 'pending');
    const wonBets = allBets.filter(bet => bet.status === 'won');
    const lostBets = allBets.filter(bet => bet.status === 'lost');
    const pendingBets = allBets.filter(bet => bet.status === 'pending');

    const totalStaked = settledBets.reduce((sum, bet) => sum + bet.stake, 0);
    const netProfit = settledBets.reduce((sum, bet) => sum + bet.profit, 0);
    const avgOdds = settledBets.length > 0
      ? settledBets.reduce((sum, bet) => sum + bet.odds, 0) / settledBets.length
      : 0;
    const roi = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0;
    const winRate = settledBets.length > 0
      ? (wonBets.length / settledBets.length) * 100
      : 0;
    const yieldValue = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0;

    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = 0;
    let runningProfit = 0;
    
    const sortedBets = [...settledBets].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    sortedBets.forEach(bet => {
      runningProfit += bet.profit;
      if (runningProfit > peak) {
        peak = runningProfit;
      }
      const drawdown = peak - runningProfit;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    return {
      netProfit,
      roi,
      winRate,
      avgOdds,
      totalBets: allBets.length,
      winningBets: wonBets.length,
      losingBets: lostBets.length,
      pendingBets: pendingBets.length,
      yield: yieldValue,
      maxDrawdown,
    };
  },
};