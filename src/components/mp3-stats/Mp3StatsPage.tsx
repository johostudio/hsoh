import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Mp3PlayerModel from './Mp3PlayerModel';
import LastFmDashboard from './LastFmDashboard';
import CdMockupGenerator from './CdMockupGenerator';
import { useLastFmData } from './hooks/useLastFmData';

const MP3_MODEL_PATH = '/models/mp3player.glb';

export default function Mp3StatsPage() {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);
  const { topArtists, topTracks, userInfo, period } = useLastFmData();

  return (
    <div className="relative w-full h-screen flex flex-col overflow-auto">
      {!showDashboard ? (
        <div className="flex-1">
          <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
            <pointLight position={[-2, 3, -2]} intensity={0.4} color="#a78bfa" />

            <Suspense fallback={null}>
              <Mp3PlayerModel
                modelPath={MP3_MODEL_PATH}
                onClick={() => setShowDashboard(true)}
              />
            </Suspense>

            <Environment preset="studio" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        <div className="flex-1 overflow-auto py-8 bg-gradient-to-b from-gray-950 to-gray-900">
          <LastFmDashboard />

          {/* CD Mockup */}
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

      {/* Navigation */}
      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        <button
          onClick={() =>
            showDashboard ? setShowDashboard(false) : navigate('/landing')
          }
          className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all cursor-pointer"
        >
          {showDashboard ? 'Back to Player' : 'Home'}
        </button>
        {[
          { path: '/gallery', label: 'Gallery' },
          { path: '/studio', label: 'Studio' },
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
