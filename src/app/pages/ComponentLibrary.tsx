import { Search, Trash2, Download, Edit } from 'lucide-react';
import { Header } from '../components/Header';
import { BrandButton } from '../components/BrandButton';
import { StatusBadge, BetStatus } from '../components/StatusBadge';
import { RiskPill, RiskLevel } from '../components/RiskPill';
import { KPICard } from '../components/KPICard';
import { EmptyState } from '../components/EmptyState';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-border">{title}</h2>
    {children}
  </div>
);

export function ComponentLibrary() {
  const statuses: BetStatus[] = ['pending', 'won', 'lost', 'void', 'cashout'];
  const risks: RiskLevel[] = ['low', 'medium', 'high'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Component Library</h1>
          <p className="text-muted-foreground">
            EdgeLedger design system components and patterns
          </p>
        </div>

        {/* Buttons */}
        <Section title="Buttons">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <BrandButton variant="primary">Primary</BrandButton>
                <BrandButton variant="secondary">Secondary</BrandButton>
                <BrandButton variant="ghost">Ghost</BrandButton>
                <BrandButton variant="danger">Danger</BrandButton>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <BrandButton variant="primary" size="sm">
                  Small
                </BrandButton>
                <BrandButton variant="primary" size="md">
                  Medium
                </BrandButton>
                <BrandButton variant="primary" size="lg">
                  Large
                </BrandButton>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">States</h3>
              <div className="flex flex-wrap gap-3">
                <BrandButton variant="primary">Normal</BrandButton>
                <BrandButton variant="primary" disabled>
                  Disabled
                </BrandButton>
                <BrandButton variant="primary" loading>
                  Loading
                </BrandButton>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">With Icons</h3>
              <div className="flex flex-wrap gap-3">
                <BrandButton variant="primary">
                  <Download className="size-4" />
                  Download
                </BrandButton>
                <BrandButton variant="secondary">
                  <Search className="size-4" />
                  Search
                </BrandButton>
                <BrandButton variant="danger">
                  <Trash2 className="size-4" />
                  Delete
                </BrandButton>
              </div>
            </div>
          </div>
        </Section>

        {/* Badges & Pills */}
        <Section title="Badges & Pills">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Status Badges</h3>
              <div className="flex flex-wrap gap-3">
                {statuses.map((status) => (
                  <StatusBadge key={status} status={status} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Risk Pills</h3>
              <div className="flex flex-wrap gap-3">
                {risks.map((risk) => (
                  <RiskPill key={risk} risk={risk} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Form Controls */}
        <Section title="Form Controls">
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="input-example">Text Input</Label>
              <Input id="input-example" placeholder="Enter text here..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="input-icon">Input with Icon</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="input-icon" placeholder="Search..." className="pl-9" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="switch-example">Toggle Switch</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable feature
                </p>
              </div>
              <Switch id="switch-example" />
            </div>
          </div>
        </Section>

        {/* KPI Cards */}
        <Section title="KPI Cards">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Net Profit"
              value="2,845.50"
              prefix="$"
              change={12.5}
              trend="up"
            />
            <KPICard title="ROI" value="18.2" suffix="%" change={3.2} trend="up" />
            <KPICard title="Win Rate" value="56.8" suffix="%" />
            <KPICard title="Total Bets" value="147" />
          </div>
        </Section>

        {/* Loading States */}
        <Section title="Loading States">
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="font-semibold mb-4">Skeleton Loaders</h3>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-12 w-1/2" />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-4">KPI Skeleton</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            </div>
          </div>
        </Section>

        {/* Empty States */}
        <Section title="Empty States">
          <div className="bg-card border border-border rounded-lg p-8 max-w-2xl">
            <EmptyState
              icon={Search}
              title="No results found"
              description="Try adjusting your search or filter criteria"
              action={{
                label: 'Clear Filters',
                onClick: () => toast.info('Filters cleared')
              }}
            />
          </div>
        </Section>

        {/* Toast Notifications */}
        <Section title="Toast Notifications">
          <div className="flex flex-wrap gap-3">
            <BrandButton
              variant="primary"
              onClick={() => toast.success('Success! Operation completed')}
            >
              Success Toast
            </BrandButton>
            <BrandButton
              variant="secondary"
              onClick={() => toast.error('Error! Something went wrong')}
            >
              Error Toast
            </BrandButton>
            <BrandButton
              variant="ghost"
              onClick={() => toast.info('Info: This is an informational message')}
            >
              Info Toast
            </BrandButton>
          </div>
        </Section>

        {/* Color Palette */}
        <Section title="Color Palette">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Primary Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[#6366f1] border border-border" />
                  <p className="text-sm font-medium">Brand Primary</p>
                  <p className="text-xs text-muted-foreground">#6366f1</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[#8b5cf6] border border-border" />
                  <p className="text-sm font-medium">Brand Accent</p>
                  <p className="text-xs text-muted-foreground">#8b5cf6</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Status Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[#10b981] border border-border" />
                  <p className="text-sm font-medium">Success</p>
                  <p className="text-xs text-muted-foreground">#10b981</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[#f59e0b] border border-border" />
                  <p className="text-sm font-medium">Warning</p>
                  <p className="text-xs text-muted-foreground">#f59e0b</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[#ef4444] border border-border" />
                  <p className="text-sm font-medium">Danger</p>
                  <p className="text-xs text-muted-foreground">#ef4444</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[#3b82f6] border border-border" />
                  <p className="text-sm font-medium">Info</p>
                  <p className="text-xs text-muted-foreground">#3b82f6</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold">Heading 1 - Display</h1>
            <h2 className="text-3xl font-bold">Heading 2 - Page Title</h2>
            <h3 className="text-2xl font-semibold">Heading 3 - Section</h3>
            <h4 className="text-xl font-semibold">Heading 4 - Subsection</h4>
            <p className="text-base">
              Body text - Regular paragraph with normal weight and standard line height
              for comfortable reading.
            </p>
            <p className="text-sm text-muted-foreground">
              Small text - Used for captions, helper text, and secondary information.
            </p>
          </div>
        </Section>
      </main>
    </div>
  );
}
