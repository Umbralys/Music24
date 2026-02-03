'use client';

import { useState, FormEvent } from 'react';

interface CreateForumModalProps {
  onClose: () => void;
  onSubmit: (name: string, description: string, icon: string, era: '80s' | '90s' | '00s' | 'all') => void;
}

const ERA_OPTIONS = [
  { value: '90s', label: "90's", color: 'bg-blue-600' },
  { value: '80s', label: "80's", color: 'bg-amber-600' },
  { value: '00s', label: "00's", color: 'bg-slate-600' },
  { value: 'all', label: 'All Eras', color: 'bg-gray-600' },
] as const;

const ICON_OPTIONS = ['🎤', '🎵', '📻', '🔥', '💎', '🎧', '🎹', '🥁', '🎸', '💿'];

export function CreateForumModal({ onClose, onSubmit }: CreateForumModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎤');
  const [era, setEra] = useState<'80s' | '90s' | '00s' | 'all'>('90s');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(name.trim(), description.trim(), icon, era);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl max-w-lg w-full p-6 border border-zinc-800">
        <h2 className="text-xl font-bold mb-4 gradient-text">Create New Forum</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Forum Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 90s Rap"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this forum about?"
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIcon(opt)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                    icon === opt
                      ? 'bg-blue-600 ring-2 ring-blue-400'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Era
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ERA_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEra(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    era === opt.value
                      ? `${opt.color} ring-2 ring-offset-2 ring-offset-zinc-900`
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !description.trim() || submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-gray-500 rounded-lg font-semibold text-sm transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Forum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
