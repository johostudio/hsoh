import { useCallback } from 'react';
import { useAudioContext } from '../../hooks/useAudioContext';
import type { PadConfig } from '../../types';

const PADS: PadConfig[] = [
  { id: 0, label: 'C4', frequency: 261.63, type: 'sine', color: '#ef4444' },
  { id: 1, label: 'D4', frequency: 293.66, type: 'sine', color: '#f97316' },
  { id: 2, label: 'E4', frequency: 329.63, type: 'sine', color: '#eab308' },
  { id: 3, label: 'F4', frequency: 349.23, type: 'sine', color: '#22c55e' },
  { id: 4, label: 'G4', frequency: 392.0, type: 'sine', color: '#06b6d4' },
  { id: 5, label: 'A4', frequency: 440.0, type: 'sine', color: '#3b82f6' },
  { id: 6, label: 'B4', frequency: 493.88, type: 'sine', color: '#8b5cf6' },
  { id: 7, label: 'C5', frequency: 523.25, type: 'sine', color: '#ec4899' },
  { id: 8, label: 'Sq C4', frequency: 261.63, type: 'square', color: '#dc2626' },
  { id: 9, label: 'Sq D4', frequency: 293.66, type: 'square', color: '#ea580c' },
  { id: 10, label: 'Sq E4', frequency: 329.63, type: 'square', color: '#ca8a04' },
  { id: 11, label: 'Sq F4', frequency: 349.23, type: 'square', color: '#16a34a' },
  { id: 12, label: 'Sw C4', frequency: 261.63, type: 'sawtooth', color: '#0891b2' },
  { id: 13, label: 'Sw D4', frequency: 293.66, type: 'sawtooth', color: '#2563eb' },
  { id: 14, label: 'Sw E4', frequency: 329.63, type: 'sawtooth', color: '#7c3aed' },
  { id: 15, label: 'Sw F4', frequency: 349.23, type: 'sawtooth', color: '#db2777' },
];

interface MidiPadInterfaceProps {
  dest: MediaStreamAudioDestinationNode | null;
}

export default function MidiPadInterface({ dest }: MidiPadInterfaceProps) {
  const { ensureResumed, getContext } = useAudioContext();

  const playNote = useCallback(
    async (pad: PadConfig) => {
      const ctx = await ensureResumed();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = pad.type;
      osc.frequency.setValueAtTime(pad.frequency, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      if (dest) gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.4);
    },
    [ensureResumed, dest, getContext],
  );

  return (
    <div>
      <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">
        MIDI Pads
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            onPointerDown={() => playNote(pad)}
            className="aspect-square rounded-xl font-bold text-xs text-white/90 shadow-lg active:scale-95 transition-transform duration-75 cursor-pointer hover:brightness-110"
            style={{
              backgroundColor: pad.color,
              boxShadow: `0 4px 15px ${pad.color}40`,
            }}
          >
            {pad.label}
          </button>
        ))}
      </div>
    </div>
  );
}
