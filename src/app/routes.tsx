import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { LoadingState } from './components/LoadingState';
import { RootLayout } from './components/RootLayout';

// Lazy load routes for code splitting
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Signin = lazy(() => import('./pages/Signin').then(m => ({ default: m.Signin })));
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Recommendations = lazy(() => import('./pages/Recommendations').then(m => ({ default: m.Recommendations })));
const Tracker = lazy(() => import('./pages/Tracker').then(m => ({ default: m.Tracker })));
const Insights = lazy(() => import('./pages/Insights').then(m => ({ default: m.Insights })));
const Bankroll = lazy(() => import('./pages/Bankroll').then(m => ({ default: m.Bankroll })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Leaderboard = lazy(() => import('./pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const ComponentLibrary = lazy(() => import('./pages/ComponentLibrary').then(m => ({ default: m.ComponentLibrary })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Wrapper component for Suspense
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingState />
      </div>
    }>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SuspenseWrapper><Landing /></SuspenseWrapper>
      },
      {
        path: '/landing',
        element: <SuspenseWrapper><Landing /></SuspenseWrapper>
      },
      {
        path: '/signin',
        element: <SuspenseWrapper><Signin /></SuspenseWrapper>
      },
      {
        path: '/signup',
        element: <SuspenseWrapper><Signup /></SuspenseWrapper>
      },
      {
        path: '/dashboard',
        element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>
      },
      {
        path: '/recommendations',
        element: <SuspenseWrapper><Recommendations /></SuspenseWrapper>
      },
      {
        path: '/tracker',
        element: <SuspenseWrapper><Tracker /></SuspenseWrapper>
      },
      {
        path: '/insights',
        element: <SuspenseWrapper><Insights /></SuspenseWrapper>
      },
      {
        path: '/bankroll',
        element: <SuspenseWrapper><Bankroll /></SuspenseWrapper>
      },
      {
        path: '/leaderboard',
        element: <SuspenseWrapper><Leaderboard /></SuspenseWrapper>
      },
      {
        path: '/settings',
        element: <SuspenseWrapper><Settings /></SuspenseWrapper>
      },
      {
        path: '/components',
        element: <SuspenseWrapper><ComponentLibrary /></SuspenseWrapper>
      },
      {
        path: '/404',
        element: <SuspenseWrapper><NotFound /></SuspenseWrapper>
      },
      {
        path: '*',
        element: <SuspenseWrapper><NotFound /></SuspenseWrapper>
      }
    ]
  }
]);