import { Link, useLocation, useNavigate } from 'react-router';
import { Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { NotificationPanel } from './NotificationPanel';
import { cn } from './ui/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Recommendations', path: '/recommendations' },
  { name: 'Tracker', path: '/tracker' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Insights', path: '/insights' },
  { name: 'Bankroll', path: '/bankroll' },
  { name: 'Settings', path: '/settings' }
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/landing');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">EdgeLedger</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm transition-colors',
                  location.pathname === link.path
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="size-5 text-muted-foreground" />
              ) : (
                <Sun className="size-5 text-muted-foreground" />
              )}
            </button>

            {/* Notifications */}
            {user && <NotificationPanel />}

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="size-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                      <UserIcon className="size-4 text-white" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.user_metadata?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <UserIcon className="size-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="size-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors',
                location.pathname === link.path
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}