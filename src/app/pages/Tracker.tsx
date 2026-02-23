import { useState, useMemo } from 'react';
import { Search, Filter, Plus, Download, FileX, Edit2, Trash2, Check, Radio } from 'lucide-react';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { BrandButton } from '../components/BrandButton';
import { Input } from '../components/ui/input';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { AddBetModal } from '../components/AddBetModal';
import { EditBetModal } from '../components/EditBetModal';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { Checkbox } from '../components/ui/checkbox';
import { LiveBetCard } from '../components/LiveBetCard';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Bet } from '../../utils/api';
import { toast } from 'sonner';

export function Tracker() {
  const { bets, betsLoading, deleteBet, bulkDeleteBets, updateBet } = useData();
  const { isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedBookmaker, setSelectedBookmaker] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBet, setEditingBet] = useState<Bet | null>(null);
  const [deletingBetId, setDeletingBetId] = useState<string | null>(null);
  const [selectedBetIds, setSelectedBetIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Filter bets
  const filteredBets = useMemo(() => {
    return bets.filter((bet) => {
      const matchesSearch =
        !searchQuery ||
        bet.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bet.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bet.league.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport = !selectedSport || bet.sport === selectedSport;
      const matchesStatus = !selectedStatus || bet.status === selectedStatus;
      const matchesBookmaker = !selectedBookmaker || bet.bookmaker === selectedBookmaker;
      return matchesSearch && matchesSport && matchesStatus && matchesBookmaker;
    });
  }, [bets, searchQuery, selectedSport, selectedStatus, selectedBookmaker]);

  // Separate pending bets (for live tracking)
  const pendingBets = useMemo(() => {
    return filteredBets.filter(bet => bet.status === 'pending').slice(0, 6); // Show max 6 live bets
  }, [filteredBets]);

  // Get unique filter values
  const sports = useMemo(() => Array.from(new Set(bets.map((b) => b.sport))), [bets]);
  const bookmakers = useMemo(() => Array.from(new Set(bets.map((b) => b.bookmaker))), [bets]);
  const statuses = ['pending', 'won', 'lost', 'void', 'cashout'];

  const handleAddBet = () => {
    setShowAddModal(true);
  };

  const handleEditBet = (bet: Bet) => {
    setEditingBet(bet);
  };

  const handleDeleteBet = async (betId: string) => {
    setDeletingBetId(betId);
  };

  const confirmDelete = async () => {
    if (deletingBetId) {
      try {
        await deleteBet(deletingBetId);
        setDeletingBetId(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedBetIds.size > 0) {
      setShowBulkDeleteDialog(true);
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteBets(Array.from(selectedBetIds));
      setSelectedBetIds(new Set());
      setShowBulkDeleteDialog(false);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  const toggleSelectBet = (betId: string) => {
    const newSelected = new Set(selectedBetIds);
    if (newSelected.has(betId)) {
      newSelected.delete(betId);
    } else {
      newSelected.add(betId);
    }
    setSelectedBetIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedBetIds.size === filteredBets.length) {
      setSelectedBetIds(new Set());
    } else {
      setSelectedBetIds(new Set(filteredBets.map(b => b.id)));
    }
  };

  const exportToCSV = () => {
    if (filteredBets.length === 0) {
      toast.error('No bets to export');
      return;
    }

    const headers = ['Date', 'Event', 'Sport', 'League', 'Market', 'Odds', 'Stake', 'Bookmaker', 'Status', 'Profit'];
    const rows = filteredBets.map(bet => [
      bet.date,
      bet.event,
      bet.sport,
      bet.league,
      bet.market,
      bet.odds.toString(),
      bet.stake.toString(),
      bet.bookmaker,
      bet.status,
      bet.profit.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `edgeledger-bets-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredBets.length} bets to CSV`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSport(null);
    setSelectedStatus(null);
    setSelectedBookmaker(null);
  };

  const hasActiveFilters = searchQuery || selectedSport || selectedStatus || selectedBookmaker;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={FileX}
            title="Please sign in"
            description="Sign in to start tracking your bets"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bet Tracker</h1>
            <p className="text-muted-foreground">
              Complete ledger of all your bets {filteredBets.length > 0 && `(${filteredBets.length} ${filteredBets.length === 1 ? 'bet' : 'bets'})`}
            </p>
          </div>
          <div className="flex gap-2">
            {selectedBetIds.size > 0 && (
              <BrandButton variant="danger" size="md" onClick={handleBulkDelete}>
                <Trash2 className="size-4" />
                Delete ({selectedBetIds.size})
              </BrandButton>
            )}
            <BrandButton variant="secondary" size="md" onClick={exportToCSV} disabled={betsLoading || filteredBets.length === 0}>
              <Download className="size-4" />
              Export
            </BrandButton>
            <BrandButton variant="primary" size="md" onClick={handleAddBet}>
              <Plus className="size-4" />
              Add Bet
            </BrandButton>
          </div>
        </div>

        {/* Live Bets Section */}
        {pendingBets.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="size-5 text-[#ef4444]" />
              <h2 className="text-xl font-bold">Live & Pending Bets</h2>
              <span className="px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] rounded-full text-xs font-medium">
                {pendingBets.length}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingBets.map((bet) => (
                <LiveBetCard
                  key={bet.id}
                  bet={bet}
                  onSettle={async (betId, status) => {
                    // Handle bet settlement via updateBet from DataContext
                    await updateBet(betId, { status });
                    toast.success(`Bet ${status}!`);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events, markets, leagues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {hasActiveFilters && (
              <BrandButton variant="ghost" size="md" onClick={clearFilters}>
                Clear Filters
              </BrandButton>
            )}
          </div>

          {/* Filter Chips */}
          {(sports.length > 0 || bookmakers.length > 0) && (
            <div className="space-y-3">
              {/* Sport Filter */}
              {sports.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground mb-2 block">Sport</span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedSport(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedSport === null
                          ? 'bg-[#6366f1] text-white'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All
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
              )}

              {/* Status Filter */}
              <div>
                <span className="text-xs text-muted-foreground mb-2 block">Status</span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedStatus(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedStatus === null
                        ? 'bg-[#6366f1] text-white'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All
                  </button>
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-[#6366f1] text-white'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookmaker Filter */}
              {bookmakers.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground mb-2 block">Bookmaker</span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedBookmaker(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedBookmaker === null
                          ? 'bg-[#6366f1] text-white'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All
                    </button>
                    {bookmakers.map((bookmaker) => (
                      <button
                        key={bookmaker}
                        onClick={() => setSelectedBookmaker(bookmaker)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedBookmaker === bookmaker
                            ? 'bg-[#6366f1] text-white'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {bookmaker}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bets Table/List */}
        {betsLoading ? (
          <LoadingState />
        ) : filteredBets.length > 0 ? (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <Checkbox
                        checked={selectedBetIds.size === filteredBets.length && filteredBets.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                      Event
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                      Market
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                      Odds
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                      Stake
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                      Book
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">
                      Profit
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBets.map((bet) => (
                    <tr
                      key={bet.id}
                      className="hover:bg-muted/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <Checkbox
                          checked={selectedBetIds.has(bet.id)}
                          onCheckedChange={() => toggleSelectBet(bet.id)}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {bet.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div>{bet.event}</div>
                        <div className="text-xs text-muted-foreground">{bet.league}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {bet.market}
                      </td>
                      <td className="px-6 py-4 text-sm">{bet.odds.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">${bet.stake.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {bet.bookmaker}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={bet.status} />
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium text-right ${
                          bet.profit > 0
                            ? 'text-[#10b981] dark:text-[#34d399]'
                            : bet.profit < 0
                            ? 'text-[#ef4444] dark:text-[#f87171]'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {bet.profit > 0 ? '+' : ''}${bet.profit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditBet(bet)}
                            className="p-1.5 rounded hover:bg-muted transition-colors"
                            title="Edit bet"
                          >
                            <Edit2 className="size-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteBet(bet.id)}
                            className="p-1.5 rounded hover:bg-muted transition-colors"
                            title="Delete bet"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-border">
              {filteredBets.map((bet) => (
                <div key={bet.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedBetIds.has(bet.id)}
                      onCheckedChange={() => toggleSelectBet(bet.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium mb-1">{bet.event}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {bet.market}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={bet.status} />
                        <span className="text-xs text-muted-foreground">
                          {bet.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs mb-1">
                        Odds
                      </span>
                      <span className="font-medium">{bet.odds.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs mb-1">
                        Stake
                      </span>
                      <span className="font-medium">${bet.stake.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs mb-1">
                        Profit
                      </span>
                      <span
                        className={`font-medium ${
                          bet.profit > 0
                            ? 'text-[#10b981] dark:text-[#34d399]'
                            : bet.profit < 0
                            ? 'text-[#ef4444] dark:text-[#f87171]'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {bet.profit > 0 ? '+' : ''}${bet.profit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <BrandButton
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditBet(bet)}
                    >
                      <Edit2 className="size-4" />
                      Edit
                    </BrandButton>
                    <BrandButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBet(bet.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </BrandButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={FileX}
            title={hasActiveFilters ? "No bets match your filters" : "No bets yet"}
            description={hasActiveFilters ? "Try adjusting your filters or add a new bet" : "Start tracking your bets to see them here"}
            action={{
              label: 'Add Bet',
              onClick: handleAddBet
            }}
          />
        )}
      </main>

      {/* Modals */}
      <AddBetModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      <EditBetModal
        open={!!editingBet}
        onClose={() => setEditingBet(null)}
        bet={editingBet}
      />
      <DeleteConfirmDialog
        open={!!deletingBetId}
        onClose={() => setDeletingBetId(null)}
        onConfirm={confirmDelete}
        title="Delete Bet?"
        description="This action cannot be undone. This bet will be permanently deleted."
      />
      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        onConfirm={confirmBulkDelete}
        title={`Delete ${selectedBetIds.size} bets?`}
        description="This action cannot be undone. These bets will be permanently deleted."
      />
    </div>
  );
}