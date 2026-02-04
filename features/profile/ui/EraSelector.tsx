'use client';

import { EraTag } from '@/types';

interface EraSelectorProps {
  value?: EraTag;
  onChange: (era: EraTag) => void;
}

const ERA_OPTIONS: { value: EraTag; label: string; color: string }[] = [
  { value: '80s', label: "80's", color: 'from-pink-500 to-cyan-400' },
  { value: '90s', label: "90's", color: 'from-yellow-500 to-blue-500' },
  { value: '00s', label: "00's", color: 'from-gray-300 to-gray-500' },
];

export function EraSelector({ value, onChange }: EraSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Favorite Era
      </label>
      <div className="flex gap-3">
        {ERA_OPTIONS.map((era) => {
          const isSelected = value === era.value;
          return (
            <button
              key={era.value}
              type="button"
              onClick={() => onChange(era.value)}
              className={`
                relative px-6 py-3 rounded-lg font-bold text-sm transition-all
                ${isSelected
                  ? `bg-gradient-to-r ${era.color} text-white shadow-lg scale-105`
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
                }
              `}
            >
              {era.label}
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        Choose your favorite hip-hop & R&B era
      </p>
    </div>
  );
}
