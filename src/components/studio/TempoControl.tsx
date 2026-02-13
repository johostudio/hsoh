import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioContext } from '../../hooks/useAudioContext';
import type { SequencerStep, TempoSettings } from '../../types';

const INSTRUMENTS = [
  { id: 'kick', label: 'Kick', color: '#dc2626' },
  { id: 'snare', label: 'Snare', color: '#f59e0b' },
  { id: 'hihat', label: 'Hi-Hat', color: '#10b981' },
  { id: 'tom', label: 'Tom', color: '#ec4899' },
];

interface TempoControlProps {
  dest: MediaStreamAudioDestinationNode | null;
}

export default function TempoControl({ dest }: TempoControlProps) {
  const { ensureResumed } = useAudioContext();
  const [settings, setSettings] = useState<TempoSettings>({
    bpm: 120,
    timeSignature: [4, 4],
    steps: 16,
  });
  const [grid, setGrid] = useState<SequencerStep[]>(() =>
    Array.from({ length: 16 }, () =>
      Object.fromEntries(INSTRUMENTS.map((inst) => [inst.id, false])),
    ),
  );
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const timerRef = useRef<number | null>(null);
  const playingRef = useRef(false);

  const toggleStep = (stepIndex: number, instrumentId: string) => {
    setGrid((prev) => {
      const next = [...prev];
      next[stepIndex] = {
        ...next[stepIndex],
        [instrumentId]: !next[stepIndex][instrumentId],
      };
      return next;
    });
  };

  const playDrumSound = useCallback(
    async (ctx: AudioContext, instrumentId: string) => {
      const now = ctx.currentTime;
      switch (instrumentId) {
        case 'kick': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.4);
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          if (dest) gain.connect(dest);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }
        case 'snare': {
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const f = ctx.createBiquadFilter();
          f.type = 'highpass';
          f.frequency.value = 1000;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.6, now);
          g.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          src.connect(f);
          f.connect(g);
          g.connect(ctx.destination);
          if (dest) g.connect(dest);
          src.start(now);
          src.stop(now + 0.1);
          break;
        }
        case 'hihat': {
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const f = ctx.createBiquadFilter();
          f.type = 'highpass';
          f.frequency.value = 7000;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.3, now);
          g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          src.connect(f);
          f.connect(g);
          g.connect(ctx.destination);
          if (dest) g.connect(dest);
          src.start(now);
          src.stop(now + 0.05);
          break;
        }
        case 'tom': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          if (dest) gain.connect(dest);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }
      }
    },
    [dest],
  );

  const startSequencer = useCallback(async () => {
    const ctx = await ensureResumed();
    playingRef.current = true;
    setPlaying(true);
    let step = 0;

    const tick = () => {
      if (!playingRef.current) return;
      setCurrentStep(step);

      const currentGrid = grid;
      for (const inst of INSTRUMENTS) {
        if (currentGrid[step]?.[inst.id]) {
          playDrumSound(ctx, inst.id);
        }
      }

      step = (step + 1) % settings.steps;
      const interval = (60 / settings.bpm / 4) * 1000; // 16th notes
      timerRef.current = window.setTimeout(tick, interval);
    };

    tick();
  }, [ensureResumed, grid, settings.bpm, settings.steps, playDrumSound]);

  const stopSequencer = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    setCurrentStep(-1);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div>
      <h3 className="font-bold mb-3 text-sm uppercase tracking-wider" style={{ color: '#2d1810' }}>
        Step Sequencer
      </h3>

      {/* BPM control */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm" style={{ color: 'rgba(45,24,16,0.5)' }}>BPM</label>
        <input
          type="range"
          min={60}
          max={200}
          value={settings.bpm}
          onChange={(e) =>
            setSettings((s) => ({ ...s, bpm: Number(e.target.value) }))
          }
          className="flex-1"
        />
        <span className="font-mono text-sm w-10 text-right" style={{ color: '#2d1810' }}>
          {settings.bpm}
        </span>

        <button
          onClick={playing ? stopSequencer : startSequencer}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition cursor-pointer ${
            playing
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>

      {/* Grid */}
      <div className="space-y-1 overflow-x-auto">
        {INSTRUMENTS.map((inst) => (
          <div key={inst.id} className="flex items-center gap-1">
            <span className="text-xs w-12 shrink-0 text-right pr-2" style={{ color: 'rgba(45,24,16,0.5)' }}>
              {inst.label}
            </span>
            {grid.map((step, stepIdx) => (
              <button
                key={stepIdx}
                onClick={() => toggleStep(stepIdx, inst.id)}
                className={`w-6 h-6 rounded-sm transition-all duration-75 cursor-pointer shrink-0 ${
                  stepIdx === currentStep ? 'ring-2' : ''
                } ${stepIdx % 4 === 0 ? 'ml-1' : ''}`}
                style={{
                  backgroundColor: step[inst.id]
                    ? inst.color
                    : stepIdx === currentStep
                      ? 'rgba(45,24,16,0.12)'
                      : 'rgba(45,24,16,0.06)',
                  ...(stepIdx === currentStep ? { '--tw-ring-color': 'rgba(45,24,16,0.3)' } as React.CSSProperties : {}),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
