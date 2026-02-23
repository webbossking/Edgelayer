import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'sonner';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Global keyboard shortcuts component
export function GlobalKeyboardShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'd',
      ctrl: true,
      description: 'Go to Dashboard',
      action: () => navigate('/dashboard'),
    },
    {
      key: 't',
      ctrl: true,
      description: 'Go to Tracker',
      action: () => navigate('/tracker'),
    },
    {
      key: 'i',
      ctrl: true,
      description: 'Go to Insights',
      action: () => navigate('/insights'),
    },
    {
      key: 'b',
      ctrl: true,
      description: 'Go to Bankroll',
      action: () => navigate('/bankroll'),
    },
    {
      key: 's',
      ctrl: true,
      description: 'Go to Settings',
      action: () => navigate('/settings'),
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show keyboard shortcuts',
      action: () => {
        const shortcutsList = shortcuts
          .map(
            (s) =>
              `${s.ctrl ? 'Ctrl+' : ''}${s.shift ? 'Shift+' : ''}${s.alt ? 'Alt+' : ''}${s.key.toUpperCase()} - ${
                s.description
              }`
          )
          .join('\n');
        toast.info('Keyboard Shortcuts', {
          description: shortcutsList,
          duration: 5000,
        });
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return null;
}

// Focus management utilities
export function useFocusTrap(ref: React.RefObject<HTMLElement>, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, enabled]);
}

// Skip to content link (for accessibility)
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#6366f1] focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}

// Aria live region for screen reader announcements
export function AriaLiveRegion() {
  return (
    <>
      <div
        id="aria-live-polite"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        id="aria-live-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
}

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const regionId = priority === 'polite' ? 'aria-live-polite' : 'aria-live-assertive';
  const region = document.getElementById(regionId);
  
  if (region) {
    region.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      region.textContent = '';
    }, 1000);
  }
}

// Custom hook for reduced motion preference
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}