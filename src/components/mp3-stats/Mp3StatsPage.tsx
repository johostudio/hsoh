import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Mp3PlayerModel, { FallbackPlayer } from './Mp3PlayerModel';
import LastFmDashboard from './LastFmDashboard';
import CdMockupGenerator from './CdMockupGenerator';
import { ModelErrorBoundary } from '../ModelErrorBoundary';
import { useLastFmData } from './hooks/useLastFmData';

const MP3_MODEL_PATH = '/models/mp3player.glb';

export default function Mp3StatsPage() {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);
  const { topArtists, topTracks, userInfo, period } = useLastFmData();

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
              textDecoration: item.path === '/mp3-stats' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              textDecorationStyle: item.path === '/mp3-stats' ? 'dotted' : undefined,
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Page title */}
      <div className="absolute top-6 left-8 z-10 pointer-events-none select-none">
        <h1
          className="font-bold uppercase leading-[0.85] tracking-[-0.04em]"
          style={{ color: '#2d1810', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
        >
          STATS
        </h1>
      </div>

      {!showDashboard ? (
        <div className="flex-1">
          <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 3]} intensity={1} />
            <pointLight position={[-2, 3, -2]} intensity={0.4} color="#c4a882" />

            <ModelErrorBoundary fallback={<FallbackPlayer onClick={() => setShowDashboard(true)} />}>
              <Suspense fallback={<FallbackPlayer onClick={() => setShowDashboard(true)} />}>
                <Mp3PlayerModel
                  modelPath={MP3_MODEL_PATH}
                  onClick={() => setShowDashboard(true)}
                />
              </Suspense>
            </ModelErrorBoundary>

            <Environment preset="studio" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        <div className="flex-1 overflow-auto py-8 pt-24">
          <LastFmDashboard />

          <div className="mt-8">
            <CdMockupGenerator
              artists={topArtists}
              tracks={topTracks}
              username={userInfo?.user.name ?? ''}
              period={period}
            />
          </div>
        </div>
      )}

      {/* Bottom action */}
      {showDashboard && (
        <div className="absolute bottom-8 left-8 z-10">
          <button
            onClick={() => setShowDashboard(false)}
            className="text-sm font-medium tracking-wide cursor-pointer hover:opacity-60 transition"
            style={{ color: '#2d1810', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Back to Player
          </button>
        </div>
      )}
    </div>
  );
}
