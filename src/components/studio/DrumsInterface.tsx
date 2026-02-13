import { useCallback } from 'react';
import { useAudioContext } from '../../hooks/useAudioContext';

interface DrumSoundDef {
  id: string;
  label: string;
  color: string;
}

const DRUMS: DrumSoundDef[] = [
  { id: 'kick', label: 'KICK', color: '#dc2626' },
  { id: 'snare', label: 'SNARE', color: '#f59e0b' },
  { id: 'hihat-closed', label: 'HH (C)', color: '#10b981' },
  { id: 'hihat-open', label: 'HH (O)', color: '#06b6d4' },
  { id: 'crash', label: 'CRASH', color: '#8b5cf6' },
  { id: 'tom', label: 'TOM', color: '#ec4899' },
];

interface DrumsInterfaceProps {
  dest: MediaStreamAudioDestinationNode | null;
}

export default function DrumsInterface({ dest }: DrumsInterfaceProps) {
  const { ensureResumed } = useAudioContext();

  const playKick = useCallback(
    async (ctx: AudioContext) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (dest) gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.5);
    },
    [dest],
  );

  const playSnare = useCallback(
    async (ctx: AudioContext) => {
      const now = ctx.currentTime;

      // Noise component
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 1000;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      if (dest) noiseGain.connect(dest);
      noise.start(now);
      noise.stop(now + 0.15);

      // Tone body
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      oscGain.gain.setValueAtTime(0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      if (dest) oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.1);
    },
    [dest],
  );

  const playHiHat = useCallback(
    async (ctx: AudioContext, open: boolean) => {
      const now = ctx.currentTime;
      const duration = open ? 0.3 : 0.08;

      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      if (dest) gain.connect(dest);
      source.start(now);
      source.stop(now + duration);
    },
    [dest],
  );

  const playCrash = useCallback(
    async (ctx: AudioContext) => {
      const now = ctx.currentTime;
      const duration = 1.0;

      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 5000;
      filter.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      if (dest) gain.connect(dest);
      source.start(now);
      source.stop(now + duration);
    },
    [dest],
  );

  const playTom = useCallback(
    async (ctx: AudioContext) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (dest) gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.3);
    },
    [dest],
  );

  const handleDrum = useCallback(
    async (drumId: string) => {
      const ctx = await ensureResumed();
      switch (drumId) {
        case 'kick':
          playKick(ctx);
          break;
        case 'snare':
          playSnare(ctx);
          break;
        case 'hihat-closed':
          playHiHat(ctx, false);
          break;
        case 'hihat-open':
          playHiHat(ctx, true);
          break;
        case 'crash':
          playCrash(ctx);
          break;
        case 'tom':
          playTom(ctx);
          break;
      }
    },
    [ensureResumed, playKick, playSnare, playHiHat, playCrash, playTom],
  );

  return (
    <div>
      <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">
        Drum Kit
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {DRUMS.map((drum) => (
          <button
            key={drum.id}
            onPointerDown={() => handleDrum(drum.id)}
            className="py-6 rounded-xl font-bold text-sm text-white shadow-lg active:scale-90 transition-transform duration-75 cursor-pointer hover:brightness-110"
            style={{
              backgroundColor: drum.color,
              boxShadow: `0 4px 15px ${drum.color}40`,
            }}
          >
            {drum.label}
          </button>
        ))}
      </div>
    </div>
  );
}
