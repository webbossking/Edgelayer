import { useState, useEffect } from 'react';
import { User, Bell, Moon, Sun } from 'lucide-react';
import { Header } from '../components/Header';
import { BrandButton } from '../components/BrandButton';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LoadingState } from '../components/LoadingState';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { settings, settingsLoading, updateSettings } = useData();
  
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    betResults: true,
    recommendations: true,
    budgetAlerts: true,
    weeklyReport: false
  });

  // Load settings when available
  useEffect(() => {
    if (settings?.notifications) {
      setNotifications(settings.notifications);
    }
  }, [settings]);

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await updateSettings({ notifications });
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
            <p className="text-muted-foreground">Sign in to access settings</p>
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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
              <h3 className="font-semibold mb-6">Profile Information</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user?.user_metadata?.name || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to update your name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to update your email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Account ID</Label>
                  <Input
                    value={user?.id || ''}
                    disabled
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your unique account identifier
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
              <h3 className="font-semibold mb-6">Appearance Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <Label className="cursor-pointer">Theme</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose between light and dark mode
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {theme === 'light' ? 'Light' : 'Dark'}
                    </span>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors"
                    >
                      {theme === 'light' ? (
                        <Moon className="size-5" />
                      ) : (
                        <Sun className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    More appearance customization options coming soon, including custom color schemes and layout density.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
              <h3 className="font-semibold mb-6">Notification Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="betResults" className="cursor-pointer">
                      Bet Results
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get notified when bets are settled
                    </p>
                  </div>
                  <Switch
                    id="betResults"
                    checked={notifications.betResults}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, betResults: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="recommendations" className="cursor-pointer">
                      New Recommendations
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Alerts for high-confidence recommendations
                    </p>
                  </div>
                  <Switch
                    id="recommendations"
                    checked={notifications.recommendations}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, recommendations: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="budgetAlerts" className="cursor-pointer">
                      Budget Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Warnings when approaching betting limits
                    </p>
                  </div>
                  <Switch
                    id="budgetAlerts"
                    checked={notifications.budgetAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, budgetAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="weeklyReport" className="cursor-pointer">
                      Weekly Report
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Performance summary every Monday
                    </p>
                  </div>
                  <Switch
                    id="weeklyReport"
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyReport: checked })
                    }
                  />
                </div>

                <div className="pt-4">
                  <BrandButton
                    variant="primary"
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                    loading={isSaving}
                  >
                    Save Preferences
                  </BrandButton>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
              <h3 className="font-semibold mb-6">Display Preferences</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input value={settings?.currency || 'NGN (₦)'} disabled />
                  <p className="text-xs text-muted-foreground">
                    Currently showing: {settings?.currency || 'NGN (₦)'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Odds Format</Label>
                  <Input value={settings?.oddsFormat || 'decimal'} disabled className="capitalize" />
                  <p className="text-xs text-muted-foreground">
                    Odds are displayed in {settings?.oddsFormat || 'decimal'} format
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input value={settings?.timezone || 'America/New_York'} disabled />
                  <p className="text-xs text-muted-foreground">
                    All times shown in your timezone
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    Currency, odds format, and timezone customization will be available in a future update.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <div className="mt-12 bg-card border border-destructive/50 rounded-lg p-6 max-w-2xl">
          <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <BrandButton variant="danger" disabled>
                Delete Account
              </BrandButton>
            </div>
            <p className="text-xs text-muted-foreground">
              Account deletion is currently unavailable. Contact support for assistance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}