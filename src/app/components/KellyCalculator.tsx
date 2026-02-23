import { useState } from 'react';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { BrandButton } from './BrandButton';
import { calculateKelly, calculateEV } from '../../utils/analytics';
import { useData } from '../contexts/DataContext';

interface KellyCalculatorProps {
  open: boolean;
  onClose: () => void;
}

export function KellyCalculator({ open, onClose }: KellyCalculatorProps) {
  const { settings } = useData();
  const [odds, setOdds] = useState<number>(2.0);
  const [winProbability, setWinProbability] = useState<number>(55);
  const [kellyFraction, setKellyFraction] = useState<number>(0.25);
  const [stake, setStake] = useState<number>(100);

  const bankroll = settings?.currentBankroll || 1000;

  // Calculate Kelly
  const kellyResult = calculateKelly(odds, winProbability / 100, bankroll, kellyFraction);

  // Calculate EV
  const evResult = calculateEV(odds, winProbability / 100, stake);

  const getKellyColor = () => {
    if (kellyResult.kellyPercentage === 0) return 'text-muted-foreground';
    if (kellyResult.kellyPercentage < 0) return 'text-[#ef4444]';
    if (kellyResult.kellyPercentage > 10) return 'text-[#f59e0b]';
    return 'text-[#10b981]';
  };

  const getEVColor = () => {
    if (evResult.expectedValue === 0) return 'text-muted-foreground';
    return evResult.isPositiveEV ? 'text-[#10b981]' : 'text-[#ef4444]';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="size-6 text-[#6366f1]" />
            Kelly Criterion & EV Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Bankroll Display */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Current Bankroll</p>
            <p className="text-2xl font-bold">${bankroll.toLocaleString()}</p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odds">Decimal Odds</Label>
                <Input
                  id="odds"
                  type="number"
                  step="0.01"
                  min="1.01"
                  value={odds}
                  onChange={(e) => setOdds(parseFloat(e.target.value) || 1.01)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stake">Stake ($)</Label>
                <Input
                  id="stake"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={stake}
                  onChange={(e) => setStake(parseFloat(e.target.value) || 0.01)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="winProb">Win Probability (%)</Label>
                <span className="text-sm font-medium">{winProbability}%</span>
              </div>
              <Slider
                id="winProb"
                min={0}
                max={100}
                step={0.5}
                value={[winProbability]}
                onValueChange={(value) => setWinProbability(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Your estimated probability of winning this bet
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="kellyFrac">Kelly Fraction</Label>
                <span className="text-sm font-medium">{kellyFraction * 100}%</span>
              </div>
              <Slider
                id="kellyFrac"
                min={0.1}
                max={1}
                step={0.05}
                value={[kellyFraction]}
                onValueChange={(value) => setKellyFraction(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Fraction of Kelly to use (25% = Quarter Kelly, recommended for safety)
              </p>
            </div>
          </div>

          {/* Kelly Results */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="size-5 text-[#6366f1]" />
              Kelly Criterion Results
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Kelly Percentage:</span>
                <span className={`text-2xl font-bold ${getKellyColor()}`}>
                  {kellyResult.kellyPercentage}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Recommended Stake:</span>
                <span className="text-xl font-bold">
                  ${kellyResult.recommendedStake.toLocaleString()}
                </span>
              </div>

              {kellyResult.warning && (
                <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <AlertTriangle className="size-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-900 dark:text-orange-200">
                    {kellyResult.warning}
                  </p>
                </div>
              )}

              {kellyResult.isSafe && !kellyResult.warning && (
                <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <CheckCircle2 className="size-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-900 dark:text-green-200">
                    This stake size is within recommended Kelly limits
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* EV Results */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="size-5 text-[#6366f1]" />
              Expected Value (EV) Analysis
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expected Value:</span>
                <span className={`text-2xl font-bold ${getEVColor()}`}>
                  {evResult.expectedValue >= 0 ? '+' : ''}${evResult.expectedValue}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">EV Percentage:</span>
                <span className={`text-xl font-bold ${getEVColor()}`}>
                  {evResult.expectedValuePercentage >= 0 ? '+' : ''}
                  {evResult.expectedValuePercentage}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Break-even Probability:</span>
                <span className="text-lg font-semibold">
                  {evResult.breakEvenProbability}%
                </span>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm">
                  {evResult.isPositiveEV ? (
                    <span className="text-[#10b981] dark:text-[#34d399]">
                      ✓ Positive EV - This is a mathematically profitable bet over the long term
                    </span>
                  ) : (
                    <span className="text-[#ef4444] dark:text-[#f87171]">
                      ✗ Negative EV - This bet has a negative expected return
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              How to Use These Calculations
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <li>
                <strong>Kelly Criterion:</strong> Calculates optimal bet size to maximize long-term growth while minimizing risk of ruin
              </li>
              <li>
                <strong>Expected Value:</strong> Shows the average amount you expect to win/lose per bet over time
              </li>
              <li>
                <strong>Quarter Kelly:</strong> Using 25% of full Kelly is recommended to reduce variance and protect against estimation errors
              </li>
              <li>
                <strong>Break-even:</strong> The win probability at which your EV becomes zero (no profit or loss)
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <BrandButton variant="ghost" onClick={onClose}>
              Close
            </BrandButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
