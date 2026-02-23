import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BrandButton } from './BrandButton';
import { useData } from '../contexts/DataContext';
import { Bet } from '../../utils/api';

interface AddBetModalProps {
  open: boolean;
  onClose: () => void;
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
  notes?: string;
}

const SPORTS = ['Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey', 'Tennis', 'MMA', 'Boxing', 'Golf'];
const BOOKMAKERS = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'Bet365', 'PointsBet', 'Barstool', 'Other'];

export function AddBetModal({ open, onClose }: AddBetModalProps) {
  const { createBet, settings } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BetFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const stake = watch('stake');

  const onSubmit = async (data: BetFormData) => {
    setIsSubmitting(true);
    try {
      // Check bankroll limits
      if (settings?.stopLossEnabled && settings.currentBankroll) {
        if (data.stake > settings.currentBankroll) {
          throw new Error('Stake exceeds available bankroll');
        }
      }

      const bet: Omit<Bet, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        ...data,
        status: 'pending',
        profit: 0,
      };

      await createBet(bet);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Calculate potential profit
  const potentialProfit = stake && watch('odds') 
    ? (stake * watch('odds') - stake).toFixed(2)
    : '0.00';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Bet</DialogTitle>
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
              <Select onValueChange={(value) => setValue('sport', value)} required>
                <SelectTrigger id="sport" className={errors.sport ? 'border-red-500' : ''}>
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
              {errors.sport && (
                <p className="text-sm text-red-500">{errors.sport.message}</p>
              )}
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
              {errors.league && (
                <p className="text-sm text-red-500">{errors.league.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="market">Market *</Label>
              <Input
                id="market"
                placeholder="e.g., Over 225.5, Team to Win"
                {...register('market', { required: 'Market is required' })}
                className={errors.market ? 'border-red-500' : ''}
              />
              {errors.market && (
                <p className="text-sm text-red-500">{errors.market.message}</p>
              )}
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
                placeholder="e.g., 1.91"
                {...register('odds', {
                  required: 'Odds are required',
                  valueAsNumber: true,
                  min: { value: 1.01, message: 'Odds must be at least 1.01' },
                })}
                className={errors.odds ? 'border-red-500' : ''}
              />
              {errors.odds && (
                <p className="text-sm text-red-500">{errors.odds.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stake">Stake ($) *</Label>
              <Input
                id="stake"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g., 100"
                {...register('stake', {
                  required: 'Stake is required',
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Stake must be at least 0.01' },
                })}
                className={errors.stake ? 'border-red-500' : ''}
              />
              {errors.stake && (
                <p className="text-sm text-red-500">{errors.stake.message}</p>
              )}
              {settings?.stopLossEnabled && stake > settings.currentBankroll && (
                <p className="text-sm text-orange-500">
                  Warning: Stake exceeds available bankroll (${settings.currentBankroll.toFixed(2)})
                </p>
              )}
            </div>
          </div>

          {/* Potential Profit Display */}
          {stake && watch('odds') && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Potential Profit:</span>
                <span className="text-lg font-bold text-[#10b981]">+${potentialProfit}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-muted-foreground">Total Return:</span>
                <span className="text-sm font-semibold">${(parseFloat(potentialProfit) + (stake || 0)).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Bookmaker & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookmaker">Bookmaker *</Label>
              <Select onValueChange={(value) => setValue('bookmaker', value)} required>
                <SelectTrigger id="bookmaker" className={errors.bookmaker ? 'border-red-500' : ''}>
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
              {errors.bookmaker && (
                <p className="text-sm text-red-500">{errors.bookmaker.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date is required' })}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add any additional notes about this bet..."
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
                  Adding...
                </>
              ) : (
                'Add Bet'
              )}
            </BrandButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
