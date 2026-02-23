import { Skeleton } from './ui/skeleton';

export function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function KPILoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

export function ChartLoadingState() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <Skeleton className="h-6 w-48 mb-6" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
