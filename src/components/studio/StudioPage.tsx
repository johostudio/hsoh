import { Suspense, useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import EightKeyPianoModel from './EightKeyPianoModel';
import MidiPadInterface from './MidiPadInterface';
import DrumsInterface from './DrumsInterface';
import TempoControl from './TempoControl';
import BeatVisualizationPlayback from './BeatVisualizationPlayback';
import { useAudioContext } from '../../hooks/useAudioContext';
import GridBackground from '../GridBackground';

export default function StudioPage() {
  const navigate = useNavigate();
  const { ensureResumed, getDest } = useAudioContext();
  const [showStudio, setShowStudio] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dest, setDest] = useState<MediaStreamAudioDestinationNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const initAudio = useCallback(async () => {
    const ctx = await ensureResumed();
    const d = getDest();
    setDest(d);

    const an = ctx.createAnalyser();
    an.fftSize = 256;
    d.connect(an);
    setAnalyser(an);

    return { ctx, dest: d };
  }, [ensureResumed, getDest]);

  const handleEnterStudio = useCallback(async () => {
    setIsAnimating(true);
    try {
      await initAudio();
    } catch (e) {
      console.warn('Audio init failed, entering studio anyway:', e);
    }
    setTimeout(() => {
      setShowStudio(true);
      setIsAnimating(false);
    }, 300);
  }, [initAudio]);

  const handleExitStudio = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowStudio(false);
      setIsAnimating(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (showStudio && contentRef.current) {
      contentRef.current.style.opacity = '0';
      contentRef.current.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          contentRef.current.style.opacity = '1';
          contentRef.current.style.transform = 'translateY(0)';
        }
      });
    }
  }, [showStudio]);

  const startRecording = useCallback(async () => {
    const { dest: d } = await initAudio();
    chunksRef.current = [];

    const recorder = new MediaRecorder(d.stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm',
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setDownloadUrl(null);
  }, [initAudio]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0a0a0a' }}>
      <GridBackground />

      {/* Navigation - top right */}
      <nav className="absolute top-8 right-10 z-10 flex flex-col items-end gap-1">
        {[
          { path: '/landing', label: 'home' },
          { path: '/gallery', label: 'gallery' },
          { path: '/mp3-stats', label: 'stats' },
          { path: '/studio', label: 'studio' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-sm font-medium tracking-[-0.02em] transition-all cursor-pointer hover:opacity-60"
            style={{
              color: '#ffffff',
              background: 'none',
              border: 'none',
              padding: '2px 0',
              textDecoration: item.path === '/studio' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              textDecorationStyle: item.path === '/studio' ? 'dotted' : undefined,
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Page title - centered */}
      <div className="absolute top-6 left-0 right-0 z-10 pointer-events-none select-none flex justify-center">
        <h1
          className="font-bold lowercase leading-[0.85] tracking-[-0.06em]"
          style={{ color: '#ffffff', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
        >
          studio
        </h1>
      </div>

      {!showStudio ? (
        <div
          className="absolute left-0 right-0 bottom-0 z-[1]"
          style={{
            top: 'clamp(7rem, 14vw, 11rem)',
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Canvas
            camera={{ position: [0, 2, 5], fov: 45 }}
            style={{ pointerEvents: 'auto' }}
            events={undefined}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
            <spotLight
              position={[-3, 5, 0]}
              intensity={0.4}
              angle={0.4}
              color="#6366f1"
            />

            <Suspense fallback={null}>
              <EightKeyPianoModel onClick={handleEnterStudio} />
            </Suspense>

            <Environment preset="night" />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={true}
            />
          </Canvas>
        </div>
      ) : (
        <div
          ref={contentRef}
          className="absolute inset-0 z-[1] overflow-auto flex items-start justify-center pb-24 px-6"
          style={{ paddingTop: 'clamp(6rem, 10vw, 9rem)' }}
        >
          <div className="w-full max-w-xl space-y-5">
            {/* Visualization */}
            <BeatVisualizationPlayback
              analyser={analyser}
              isActive={isRecording || showStudio}
            />

            {/* Instruments -- centered, two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <MidiPadInterface dest={dest} />
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <DrumsInterface dest={dest} />
              </div>
            </div>

            {/* Step sequencer */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <TempoControl dest={dest} />
            </div>

            {/* Recording controls -- right below sequencer */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="text-sm font-medium transition cursor-pointer hover:opacity-60"
                style={{
                  color: isRecording ? '#ef4444' : '#ffffff',
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
              >
                {isRecording ? 'stop recording' : 'record'}
              </button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="beat.webm"
                  className="text-sm font-medium transition hover:opacity-60"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                  }}
                >
                  download
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom text */}
      <div className="absolute bottom-8 left-8 z-10">
        {showStudio ? (
          <button
            onClick={handleExitStudio}
            className="text-sm font-medium tracking-wide cursor-pointer hover:opacity-60 transition"
            style={{ color: '#ffffff', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Back to Piano
          </button>
        ) : (
          <p
            className="text-xs uppercase tracking-[0.2em] leading-relaxed font-medium max-w-[200px] pointer-events-none select-none"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            MAKE SOME NOISE
          </p>
        )}
      </div>
    </div>
  );
}
