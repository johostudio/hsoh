import { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import GuitarModel from './GuitarModel';
import MidiPadInterface from './MidiPadInterface';
import DrumsInterface from './DrumsInterface';
import TempoControl from './TempoControl';
import BeatVisualizationPlayback from './BeatVisualizationPlayback';
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
    <div className="relative w-full h-screen flex flex-col">
      {!showStudio ? (
        /* Guitar model view */
        <div className="flex-1">
          <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
            <spotLight
              position={[-3, 5, 0]}
              intensity={0.5}
              angle={0.4}
              color="#f97316"
            />

            <Suspense fallback={null}>
              <GuitarModel
                modelPath={GUITAR_MODEL_PATH}
                onClick={handleEnterStudio}
              />
            </Suspense>

            <Environment preset="sunset" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        /* Studio interface */
        <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-950 to-gray-900 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Recording controls */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
              <h2 className="text-white font-bold text-lg flex-1">Studio</h2>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                    : 'bg-red-700 hover:bg-red-600 text-white'
                }`}
              >
                {isRecording ? '⏹ Stop Recording' : '⏺ Record'}
              </button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="beat.webm"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition"
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
              <div className="bg-white/5 rounded-xl p-5">
                <MidiPadInterface dest={dest} />
              </div>
              <div className="bg-white/5 rounded-xl p-5">
                <DrumsInterface dest={dest} />
              </div>
            </div>

            {/* Step sequencer */}
            <div className="bg-white/5 rounded-xl p-5">
              <TempoControl dest={dest} />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        <button
          onClick={() =>
            showStudio ? setShowStudio(false) : navigate('/landing')
          }
          className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all cursor-pointer"
        >
          {showStudio ? 'Back to Guitar' : 'Home'}
        </button>
        {[
          { path: '/gallery', label: 'Gallery' },
          { path: '/mp3-stats', label: 'MP3 / Stats' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
