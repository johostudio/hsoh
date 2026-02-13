import { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import GuitarModel, { FallbackGuitar } from './GuitarModel';
import MidiPadInterface from './MidiPadInterface';
import DrumsInterface from './DrumsInterface';
import TempoControl from './TempoControl';
import BeatVisualizationPlayback from './BeatVisualizationPlayback';
import { ModelErrorBoundary } from '../ModelErrorBoundary';
import { useAudioContext } from '../../hooks/useAudioContext';

const GUITAR_MODEL_PATH = '/models/guitar.glb';

export default function StudioPage() {
  const navigate = useNavigate();
  const { ensureResumed, getDest, getContext } = useAudioContext();
  const [showStudio, setShowStudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dest, setDest] = useState<MediaStreamAudioDestinationNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

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
    await initAudio();
    setShowStudio(true);
  }, [initAudio]);

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
    <div className="relative w-full h-screen flex flex-col" style={{ background: '#f5f0eb' }}>
      {/* Navigation - top right */}
      <nav className="absolute top-8 right-10 z-10 flex flex-col items-end gap-1">
        {[
          { path: '/landing', label: 'Home' },
          { path: '/gallery', label: 'Gallery' },
          { path: '/mp3-stats', label: 'Stats' },
          { path: '/studio', label: 'Studio' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-sm font-medium tracking-wide transition-all cursor-pointer hover:opacity-60"
            style={{
              color: '#2d1810',
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
          className="font-bold uppercase leading-[0.85] tracking-[-0.04em]"
          style={{ color: '#2d1810', fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          STUDIO
        </h1>
      </div>

      {!showStudio ? (
        <div className="flex-1">
          <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 3]} intensity={1} />
            <spotLight
              position={[-3, 5, 0]}
              intensity={0.5}
              angle={0.4}
              color="#c4a882"
            />

            <ModelErrorBoundary fallback={<FallbackGuitar onClick={handleEnterStudio} />}>
              <Suspense fallback={<FallbackGuitar onClick={handleEnterStudio} />}>
                <GuitarModel
                  modelPath={GUITAR_MODEL_PATH}
                  onClick={handleEnterStudio}
                />
              </Suspense>
            </ModelErrorBoundary>

            <Environment preset="sunset" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6 pt-24">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Recording controls */}
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(45,24,16,0.05)', border: '1px solid rgba(45,24,16,0.1)' }}>
              <h2 className="font-bold text-lg flex-1" style={{ color: '#2d1810' }}>Studio</h2>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                    : 'bg-red-700 hover:bg-red-600 text-white'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Record'}
              </button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="beat.webm"
                  className="px-5 py-2 text-white rounded-lg font-bold text-sm transition"
                  style={{ background: '#2d1810' }}
                >
                  Download
                </a>
              )}
            </div>

            {/* Visualization */}
            <BeatVisualizationPlayback
              analyser={analyser}
              isActive={isRecording || showStudio}
            />

            {/* Instruments grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl p-5" style={{ background: 'rgba(45,24,16,0.05)', border: '1px solid rgba(45,24,16,0.1)' }}>
                <MidiPadInterface dest={dest} />
              </div>
              <div className="rounded-xl p-5" style={{ background: 'rgba(45,24,16,0.05)', border: '1px solid rgba(45,24,16,0.1)' }}>
                <DrumsInterface dest={dest} />
              </div>
            </div>

            {/* Step sequencer */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(45,24,16,0.05)', border: '1px solid rgba(45,24,16,0.1)' }}>
              <TempoControl dest={dest} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom action */}
      {showStudio && (
        <div className="absolute bottom-8 left-8 z-10">
          <button
            onClick={() => setShowStudio(false)}
            className="text-sm font-medium tracking-wide cursor-pointer hover:opacity-60 transition"
            style={{ color: '#2d1810', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Back to Guitar
          </button>
        </div>
      )}
    </div>
  );
}
