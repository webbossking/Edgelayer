import { Outlet } from 'react-router';
import { GlobalKeyboardShortcuts, SkipToContent, AriaLiveRegion } from '../hooks/useAccessibility';
import { Toaster } from './ui/sonner';

export function RootLayout() {
  return (
    <>
      <SkipToContent />
      <AriaLiveRegion />
      <GlobalKeyboardShortcuts />
      <Outlet />
      <Toaster />
    </>
  );
}
