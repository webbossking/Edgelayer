import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const handlePreset = (days: number) => {
    const to = new Date();
    const from = subDays(to, days - 1);
    onChange({ from, to });
    setOpen(false);
  };

  const handleThisWeek = () => {
    const from = startOfWeek(new Date());
    const to = new Date();
    onChange({ from, to });
    setOpen(false);
  };

  const handleThisMonth = () => {
    const from = startOfMonth(new Date());
    const to = new Date();
    onChange({ from, to });
    setOpen(false);
  };

  const handleThisYear = () => {
    const from = startOfYear(new Date());
    const to = new Date();
    onChange({ from, to });
    setOpen(false);
  };

  const handleAllTime = () => {
    onChange(undefined);
    setOpen(false);
  };

  const displayText = value?.from
    ? value.to
      ? `${format(value.from, 'MMM dd, yyyy')} - ${format(value.to, 'MMM dd, yyyy')}`
      : format(value.from, 'MMM dd, yyyy')
    : 'All time';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-start text-left font-normal ${className}`}
        >
          <CalendarIcon className="mr-2 size-4" />
          <span>{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets */}
          <div className="border-r border-border p-3 space-y-1">
            <div className="text-sm font-semibold mb-2 px-2">Quick Select</div>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset.days)}
                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={handleThisWeek}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
            >
              This week
            </button>
            <button
              onClick={handleThisMonth}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
            >
              This month
            </button>
            <button
              onClick={handleThisYear}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
            >
              This year
            </button>
            <button
              onClick={handleAllTime}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
            >
              All time
            </button>
          </div>

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              selected={value}
              onSelect={onChange}
              numberOfMonths={2}
              initialFocus
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
