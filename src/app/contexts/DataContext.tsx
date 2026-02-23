import React, { createContext, useContext, useEffect, useState } from 'react';
import { Bet, betsAPI, Settings, settingsAPI, Stats, analyticsAPI } from '../../utils/api';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { toast } from 'sonner';

interface DataContextType {
  // Bets
  bets: Bet[];
  betsLoading: boolean;
  betsError: string | null;
  refreshBets: () => Promise<void>;
  createBet: (bet: Omit<Bet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBet: (id: string, updates: Partial<Bet>) => Promise<void>;
  deleteBet: (id: string) => Promise<void>;
  bulkDeleteBets: (ids: string[]) => Promise<void>;

  // Settings
  settings: Settings | null;
  settingsLoading: boolean;
  settingsError: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;

  // Stats
  stats: Stats | null;
  statsLoading: boolean;
  statsError: string | null;
  refreshStats: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();

  // Bets state
  const [bets, setBets] = useState<Bet[]>([]);
  const [betsLoading, setBetsLoading] = useState(false);
  const [betsError, setBetsError] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState<Settings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch bets
  const refreshBets = async () => {
    if (!isAuthenticated) return;
    
    setBetsLoading(true);
    setBetsError(null);
    try {
      const fetchedBets = await betsAPI.getAll();
      setBets(fetchedBets);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load bets';
      setBetsError(message);
      console.error('Failed to fetch bets:', error);
    } finally {
      setBetsLoading(false);
    }
  };

  // Create bet
  const createBet = async (bet: Omit<Bet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBet = await betsAPI.create(bet);
      setBets(prev => [newBet, ...prev]);
      await refreshStats(); // Update stats after creating bet
      
      // Send notification
      if (settings?.notifications?.betResults) {
        addNotification({
          type: 'success',
          title: 'Bet Added',
          message: `${bet.event} - ${bet.market} added to tracker`,
        });
      }
      
      toast.success('Bet created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create bet';
      toast.error(message);
      throw error;
    }
  };

  // Update bet
  const updateBet = async (id: string, updates: Partial<Bet>) => {
    try {
      const updatedBet = await betsAPI.update(id, updates);
      setBets(prev => prev.map(b => b.id === id ? updatedBet : b));
      await refreshStats(); // Update stats after updating bet
      
      // Send notification if status changed
      if (updates.status && settings?.notifications?.betResults) {
        const statusMessages = {
          won: { type: 'success' as const, emoji: '🎉' },
          lost: { type: 'error' as const, emoji: '😔' },
          void: { type: 'info' as const, emoji: '↩️' },
          cashout: { type: 'info' as const, emoji: '💰' },
        };
        
        const statusInfo = statusMessages[updates.status as keyof typeof statusMessages];
        if (statusInfo) {
          addNotification({
            type: statusInfo.type,
            title: `Bet ${updates.status.charAt(0).toUpperCase() + updates.status.slice(1)}`,
            message: `${statusInfo.emoji} ${updatedBet.event}: ${updates.profit && updates.profit > 0 ? '+' : ''}$${updates.profit?.toFixed(2) || 0}`,
          });
        }
      }
      
      toast.success('Bet updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update bet';
      toast.error(message);
      throw error;
    }
  };

  // Delete bet
  const deleteBet = async (id: string) => {
    try {
      await betsAPI.delete(id);
      setBets(prev => prev.filter(b => b.id !== id));
      await refreshStats(); // Update stats after deleting bet
      toast.success('Bet deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete bet';
      toast.error(message);
      throw error;
    }
  };

  // Bulk delete bets
  const bulkDeleteBets = async (ids: string[]) => {
    try {
      await betsAPI.bulkDelete(ids);
      setBets(prev => prev.filter(b => !ids.includes(b.id)));
      await refreshStats(); // Update stats after bulk delete
      toast.success(`${ids.length} bets deleted successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete bets';
      toast.error(message);
      throw error;
    }
  };

  // Fetch settings
  const refreshSettings = async () => {
    if (!isAuthenticated) return;
    
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const fetchedSettings = await settingsAPI.get();
      setSettings(fetchedSettings);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load settings';
      setSettingsError(message);
      console.error('Failed to fetch settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Update settings
  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const updatedSettings = await settingsAPI.update(updates);
      setSettings(updatedSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update settings';
      toast.error(message);
      throw error;
    }
  };

  // Fetch stats
  const refreshStats = async () => {
    if (!isAuthenticated) return;
    
    setStatsLoading(true);
    setStatsError(null);
    try {
      const fetchedStats = await analyticsAPI.getStats();
      setStats(fetchedStats);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load statistics';
      setStatsError(message);
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshBets();
      refreshSettings();
      refreshStats();
    } else {
      // Clear data when user logs out
      setBets([]);
      setSettings(null);
      setStats(null);
    }
  }, [isAuthenticated, user]);

  return (
    <DataContext.Provider
      value={{
        bets,
        betsLoading,
        betsError,
        refreshBets,
        createBet,
        updateBet,
        deleteBet,
        bulkDeleteBets,
        settings,
        settingsLoading,
        settingsError,
        refreshSettings,
        updateSettings,
        stats,
        statsLoading,
        statsError,
        refreshStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}