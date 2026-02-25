'use client';

import { useEffect, useMemo } from 'react';

type ExpiryOption = '10m' | '1h' | '24h' | 'custom';

type ExpirySelectorProps = {
  value: ExpiryOption;
  customDateTime: string;
  onValueChange: (value: ExpiryOption) => void;
  onCustomChange: (value: string) => void;
  onDateResolved: (date: Date) => void;
};

export function ExpirySelector({
  value,
  customDateTime,
  onValueChange,
  onCustomChange,
  onDateResolved
}: ExpirySelectorProps) {
  const resolvedDate = useMemo(() => {
    const now = Date.now();

    if (value === '10m') return new Date(now + 10 * 60 * 1000);
    if (value === '1h') return new Date(now + 60 * 60 * 1000);
    if (value === '24h') return new Date(now + 24 * 60 * 60 * 1000);

    const custom = new Date(customDateTime);
    return Number.isNaN(custom.valueOf()) ? new Date(now + 10 * 60 * 1000) : custom;
  }, [value, customDateTime]);

  useEffect(() => {
    onDateResolved(resolvedDate);
  }, [onDateResolved, resolvedDate]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Expiry Time</label>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {[
          { key: '10m', label: '10 min' },
          { key: '1h', label: '1 hour' },
          { key: '24h', label: '24 hour' },
          { key: 'custom', label: 'Custom' }
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onValueChange(option.key as ExpiryOption)}
            className={`rounded-xl border px-3 py-2 text-sm transition ${
              value === option.key ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {value === 'custom' && (
        <input
          type="datetime-local"
          value={customDateTime}
          onChange={(e) => onCustomChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
