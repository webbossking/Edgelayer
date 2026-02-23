import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BrandButton } from './BrandButton';
import { useData } from '../contexts/DataContext';
import { Bet } from '../../utils/api';

interface EditBetModalProps {
  open: boolean;
  onClose: () => void;
  bet: Bet | null;
}

interface BetFormData {
  event: string;
  sport: string;
  league: string;
  market: string;
  odds: number;
  stake: number;
  bookmaker: string;
  date: string;
  status: 'pending' | 'won' | 'lost' | 'void' | 'cashout';
  profit: number;
  notes?: string;
}

const SPORTS = ['Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey', 'Tennis', 'MMA', 'Boxing', 'Golf'];
const BOOKMAKERS = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'Bet365', 'PointsBet', 'Barstool', 'Other'];
const STATUSES: Array<'pending' | 'won' | 'lost' | 'void' | 'cashout'> = ['pending', 'won', 'lost', 'void', 'cashout'];

export function EditBetModal({ open, onClose, bet }: EditBetModalProps) {
  const { updateBet } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BetFormData>();

  // Update form when bet changes
  useEffect(() => {
    if (bet) {
      reset({
        event: bet.event,
        sport: bet.sport,
        league: bet.league,
        market: bet.market,
        odds: bet.odds,
        stake: bet.stake,
        bookmaker: bet.bookmaker,
        date: bet.date,
        status: bet.status,
        profit: bet.profit,
        notes: bet.notes || '',
      });
    }
  }, [bet, reset]);

  const onSubmit = async (data: BetFormData) => {
    if (!bet) return;

    setIsSubmitting(true);
    try {
      // Calculate profit based on status
      let profit = 0;
      if (data.status === 'won') {
        profit = data.stake * data.odds - data.stake;
      } else if (data.status === 'lost') {
        profit = -data.stake;
      } else if (data.status === 'cashout') {
        profit = data.profit; // Use manual profit entry
      }

      await updateBet(bet.id, {
        ...data,
        profit,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const status = watch('status');
  const stake = watch('stake');
  const odds = watch('odds');

  // Auto-calculate profit based on status
  useEffect(() => {
    if (status === 'won' && stake && odds) {
      const calculatedProfit = stake * odds - stake;
      setValue('profit', parseFloat(calculatedProfit.toFixed(2)));
    } else if (status === 'lost' && stake) {
      setValue('profit', -stake);
    } else if (status === 'pending' || status === 'void') {
      setValue('profit', 0);
    }
  }, [status, stake, odds, setValue]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Bet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Event & Sport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event">Event *</Label>
              <Input
                id="event"
                placeholder="e.g., Lakers vs Warriors"
                {...register('event', { required: 'Event is required' })}
                className={errors.event ? 'border-red-500' : ''}
              />
              {errors.event && (
                <p className="text-sm text-red-500">{errors.event.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sport">Sport *</Label>
              <Select onValueChange={(value) => setValue('sport', value)} value={watch('sport')}>
                <SelectTrigger id="sport">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* League & Market */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="league">League *</Label>
              <Input
                id="league"
                placeholder="e.g., NBA, EPL"
                {...register('league', { required: 'League is required' })}
                className={errors.league ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market">Market *</Label>
              <Input
                id="market"
                placeholder="e.g., Over 225.5"
                {...register('market', { required: 'Market is required' })}
                className={errors.market ? 'border-red-500' : ''}
              />
            </div>
          </div>

          {/* Odds & Stake */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odds">Odds (Decimal) *</Label>
              <Input
                id="odds"
                type="number"
                step="0.01"
                min="1.01"
                {...register('odds', {
                  required: 'Odds are required',
                  valueAsNumber: true,
                  min: { value: 1.01, message: 'Odds must be at least 1.01' },
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stake">Stake ($) *</Label>
              <Input
                id="stake"
                type="number"
                step="0.01"
                min="0.01"
                {...register('stake', {
                  required: 'Stake is required',
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Stake must be at least 0.01' },
                })}
              />
            </div>
          </div>

          {/* Status & Bookmaker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} value={status}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookmaker">Bookmaker *</Label>
              <Select onValueChange={(value) => setValue('bookmaker', value)} value={watch('bookmaker')}>
                <SelectTrigger id="bookmaker">
                  <SelectValue placeholder="Select bookmaker" />
                </SelectTrigger>
                <SelectContent>
                  {BOOKMAKERS.map((bookmaker) => (
                    <SelectItem key={bookmaker} value={bookmaker}>
                      {bookmaker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Profit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date is required' })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profit">
                Profit ($) {status === 'cashout' ? '*' : '(Auto-calculated)'}
              </Label>
              <Input
                id="profit"
                type="number"
                step="0.01"
                {...register('profit', { valueAsNumber: true })}
                disabled={status !== 'cashout'}
                className={status !== 'cashout' ? 'bg-muted' : ''}
              />
              {status !== 'cashout' && (
                <p className="text-xs text-muted-foreground">
                  Automatically calculated based on status
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add any additional notes..."
              {...register('notes')}
              className="flex w-full rounded-md border border-input bg-input-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <BrandButton
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </BrandButton>
            <BrandButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </BrandButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
