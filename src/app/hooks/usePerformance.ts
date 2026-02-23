import { useEffect, useRef, useCallback, useState } from 'react';

// Debounce hook for performance
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for performance
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

// Performance monitoring
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static mark(name: string) {
    this.marks.set(name, performance.now());
  }

  static measure(name: string, startMark: string): number | null {
    const start = this.marks.get(startMark);
    if (!start) return null;

    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  static clear(name?: string) {
    if (name) {
      this.marks.delete(name);
    } else {
      this.marks.clear();
    }
  }
}

// Local storage with performance optimization
export class OptimizedStorage {
  private static cache: Map<string, any> = new Map();

  static get<T>(key: string, defaultValue?: T): T | null {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue ?? null;

      const parsed = JSON.parse(item);
      this.cache.set(key, parsed);
      return parsed;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue ?? null;
    }
  }

  static set(key: string, value: any): boolean {
    try {
      const stringified = JSON.stringify(value);
      localStorage.setItem(key, stringified);
      this.cache.set(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  static remove(key: string) {
    localStorage.removeItem(key);
    this.cache.delete(key);
  }

  static clear() {
    localStorage.clear();
    this.cache.clear();
  }

  static clearCache() {
    this.cache.clear();
  }
}

// Memoization helper
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Image preloader
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        })
    )
  );
}

// Batch operations for better performance
export class BatchProcessor<T> {
  private queue: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  private batchSize: number;
  private delay: number;
  private processor: (items: T[]) => void;

  constructor(processor: (items: T[]) => void, batchSize: number = 10, delay: number = 100) {
    this.processor = processor;
    this.batchSize = batchSize;
    this.delay = delay;
  }

  add(item: T) {
    this.queue.push(item);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  private scheduleFlush() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length > 0) {
      const items = [...this.queue];
      this.queue = [];
      this.processor(items);
    }
  }
}

// Virtual scrolling helper for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
): {
  visibleItems: T[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
} {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight)
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
  };
}