import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Middleware to verify user authentication
const authMiddleware = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }

  c.set('userId', user.id);
  c.set('user', user);
  await next();
};

// Health check endpoint
app.get("/make-server-d1e0db95/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up
app.post("/make-server-d1e0db95/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      email_confirm: true, // Auto-confirm since no email server configured
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Initialize default settings for new user
    await kv.set(`settings:${data.user.id}`, {
      startingBankroll: 1000,
      currentBankroll: 1000,
      weeklyBudget: 100,
      monthlyBudget: 400,
      unitSize: 1,
      stopLoss: 100,
      stopLossEnabled: true,
      coolOffEnabled: false,
      currency: 'USD',
      oddsFormat: 'decimal',
      timezone: 'America/New_York',
      notifications: {
        betResults: true,
        recommendations: true,
        budgetAlerts: true,
        weeklyReport: false,
      }
    });

    return c.json({ data, message: 'User created successfully' });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Sign in (handled by Supabase client on frontend, but we can add a route for consistency)
app.post("/make-server-d1e0db95/auth/signin", async (c) => {
  return c.json({ message: 'Please use Supabase client on frontend for signin' });
});

// ==================== BETS ROUTES ====================

// Get all bets for user
app.get("/make-server-d1e0db95/bets", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const bets = await kv.getByPrefix(`bet:${userId}:`);
    return c.json({ bets: bets || [] });
  } catch (error) {
    console.log('Get bets error:', error);
    return c.json({ error: 'Failed to fetch bets' }, 500);
  }
});

// Get single bet
app.get("/make-server-d1e0db95/bets/:id", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const betId = c.req.param('id');
    const bet = await kv.get(`bet:${userId}:${betId}`);
    
    if (!bet) {
      return c.json({ error: 'Bet not found' }, 404);
    }
    
    return c.json({ bet });
  } catch (error) {
    console.log('Get bet error:', error);
    return c.json({ error: 'Failed to fetch bet' }, 500);
  }
});

// Create bet
app.post("/make-server-d1e0db95/bets", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const betData = await c.req.json();

    // Validate required fields
    if (!betData.event || !betData.market || !betData.odds || !betData.stake) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check bankroll limits
    const settings = await kv.get(`settings:${userId}`) as any;
    if (settings?.stopLossEnabled) {
      // Get all bets to calculate current status
      const allBets = await kv.getByPrefix(`bet:${userId}:`);
      const totalStaked = allBets?.reduce((sum: number, bet: any) => sum + (bet.stake || 0), 0) || 0;
      
      if (totalStaked + betData.stake > settings.currentBankroll) {
        return c.json({ 
          error: 'Insufficient bankroll',
          message: 'This bet exceeds your available bankroll' 
        }, 400);
      }
    }

    const betId = crypto.randomUUID();
    const bet = {
      id: betId,
      userId,
      ...betData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`bet:${userId}:${betId}`, bet);
    return c.json({ bet, message: 'Bet created successfully' }, 201);
  } catch (error) {
    console.log('Create bet error:', error);
    return c.json({ error: 'Failed to create bet' }, 500);
  }
});

// Update bet
app.put("/make-server-d1e0db95/bets/:id", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const betId = c.req.param('id');
    const updates = await c.req.json();

    const existingBet = await kv.get(`bet:${userId}:${betId}`);
    if (!existingBet) {
      return c.json({ error: 'Bet not found' }, 404);
    }

    const updatedBet = {
      ...existingBet,
      ...updates,
      id: betId,
      userId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`bet:${userId}:${betId}`, updatedBet);
    return c.json({ bet: updatedBet, message: 'Bet updated successfully' });
  } catch (error) {
    console.log('Update bet error:', error);
    return c.json({ error: 'Failed to update bet' }, 500);
  }
});

// Delete bet
app.delete("/make-server-d1e0db95/bets/:id", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const betId = c.req.param('id');

    const existingBet = await kv.get(`bet:${userId}:${betId}`);
    if (!existingBet) {
      return c.json({ error: 'Bet not found' }, 404);
    }

    await kv.del(`bet:${userId}:${betId}`);
    return c.json({ message: 'Bet deleted successfully' });
  } catch (error) {
    console.log('Delete bet error:', error);
    return c.json({ error: 'Failed to delete bet' }, 500);
  }
});

// Bulk delete bets
app.post("/make-server-d1e0db95/bets/bulk-delete", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { betIds } = await c.req.json();

    if (!Array.isArray(betIds) || betIds.length === 0) {
      return c.json({ error: 'Invalid bet IDs' }, 400);
    }

    const keys = betIds.map(id => `bet:${userId}:${id}`);
    await kv.mdel(...keys);
    
    return c.json({ message: `${betIds.length} bets deleted successfully` });
  } catch (error) {
    console.log('Bulk delete error:', error);
    return c.json({ error: 'Failed to delete bets' }, 500);
  }
});

// ==================== SETTINGS ROUTES ====================

// Get user settings
app.get("/make-server-d1e0db95/settings", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const settings = await kv.get(`settings:${userId}`);
    
    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = {
        startingBankroll: 1000,
        currentBankroll: 1000,
        weeklyBudget: 100,
        monthlyBudget: 400,
        unitSize: 1,
        stopLoss: 100,
        stopLossEnabled: true,
        coolOffEnabled: false,
        currency: 'USD',
        oddsFormat: 'decimal',
        timezone: 'America/New_York',
        notifications: {
          betResults: true,
          recommendations: true,
          budgetAlerts: true,
          weeklyReport: false,
        }
      };
      await kv.set(`settings:${userId}`, defaultSettings);
      return c.json({ settings: defaultSettings });
    }
    
    return c.json({ settings });
  } catch (error) {
    console.log('Get settings error:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Update user settings
app.put("/make-server-d1e0db95/settings", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const updates = await c.req.json();

    const existingSettings = await kv.get(`settings:${userId}`) || {};
    const updatedSettings = {
      ...existingSettings,
      ...updates,
    };

    await kv.set(`settings:${userId}`, updatedSettings);
    return c.json({ settings: updatedSettings, message: 'Settings updated successfully' });
  } catch (error) {
    console.log('Update settings error:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// ==================== ANALYTICS ROUTES ====================

// Get user statistics
app.get("/make-server-d1e0db95/analytics/stats", authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const bets = await kv.getByPrefix(`bet:${userId}:`);
    
    if (!bets || bets.length === 0) {
      return c.json({
        stats: {
          netProfit: 0,
          roi: 0,
          winRate: 0,
          avgOdds: 0,
          totalBets: 0,
          winningBets: 0,
          losingBets: 0,
          pendingBets: 0,
          yield: 0,
          maxDrawdown: 0,
        }
      });
    }

    const totalBets = bets.length;
    const winningBets = bets.filter((b: any) => b.status === 'won').length;
    const losingBets = bets.filter((b: any) => b.status === 'lost').length;
    const pendingBets = bets.filter((b: any) => b.status === 'pending').length;
    
    const totalStaked = bets.reduce((sum: number, b: any) => sum + (b.stake || 0), 0);
    const netProfit = bets.reduce((sum: number, b: any) => sum + (b.profit || 0), 0);
    const roi = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0;
    const winRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0;
    const avgOdds = totalBets > 0 ? bets.reduce((sum: number, b: any) => sum + (b.odds || 0), 0) / totalBets : 0;

    return c.json({
      stats: {
        netProfit: Math.round(netProfit * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        winRate: Math.round(winRate * 100) / 100,
        avgOdds: Math.round(avgOdds * 100) / 100,
        totalBets,
        winningBets,
        losingBets,
        pendingBets,
        yield: Math.round(roi * 100) / 100,
        maxDrawdown: 0, // TODO: Calculate actual drawdown
      }
    });
  } catch (error) {
    console.log('Get stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

Deno.serve(app.fetch);