import { useState } from 'react';
import { Shield, Search, Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { RiskPill } from '../components/RiskPill';
import { StatusBadge } from '../components/StatusBadge';
import { BrandButton } from '../components/BrandButton';
import { Input } from '../components/ui/input';
import { mockRecommendations } from '../data/mockData';
import { toast } from 'sonner';

export function Recommendations() {
  const [selectedTab, setSelectedTab] = useState<'today' | 'tomorrow'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const filteredRecommendations = mockRecommendations.filter((rec) => {
    const matchesTab =
      (selectedTab === 'today' && rec.date === '2026-02-23') ||
      (selectedTab === 'tomorrow' && rec.date === '2026-02-24');
    const matchesSearch =
      !searchQuery ||
      rec.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.league.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !selectedSport || rec.sport === selectedSport;
    return matchesTab && matchesSearch && matchesSport;
  });

  const sports = Array.from(new Set(mockRecommendations.map((r) => r.sport)));

  const handleAddToTracker = (recId: string) => {
    toast.success('Bet added to tracker');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recommendations</h1>
          <p className="text-muted-foreground">
            AI-powered betting recommendations based on data analysis
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Tab Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTab('today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === 'today'
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedTab('tomorrow')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === 'tomorrow'
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                Tomorrow
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events, leagues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Sport Filter Chips */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setSelectedSport(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedSport === null
                  ? 'bg-[#6366f1] text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              All Sports
            </button>
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedSport === sport
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {rec.sport} · {rec.league}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{rec.event}</h3>
                  <p className="text-sm text-muted-foreground">{rec.market}</p>
                </div>
                <RiskPill risk={rec.confidence} />
              </div>

              {rec.analysis && (
                <p className="text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                  {rec.analysis}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">
                    Odds
                  </span>
                  <span className="text-2xl font-bold">{rec.odds}</span>
                </div>
                <BrandButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToTracker(rec.id)}
                >
                  <Plus className="size-4" />
                  Add to Tracker
                </BrandButton>
              </div>
            </div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">
              No recommendations found for the selected filters
            </p>
          </div>
        )}

        {/* Responsible Gambling Message */}
        <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
          <Shield className="size-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Bet Responsibly</p>
            <p className="text-sm text-muted-foreground">
              These recommendations are based on data analysis and should not be considered financial advice. Never risk money you cannot afford to lose. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
