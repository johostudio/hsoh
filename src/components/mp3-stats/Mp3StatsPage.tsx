import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import Mp3PlayerModel, { FallbackPlayer } from './Mp3PlayerModel';
import LastFmDashboard from './LastFmDashboard';
import GridBackground from '../GridBackground';

export default function Mp3StatsPage() {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOpenDashboard = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowDashboard(true);
      setIsAnimating(false);
    }, 300);
  }, []);

  const handleCloseDashboard = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowDashboard(false);
      setIsAnimating(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (showDashboard && contentRef.current) {
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
  }, [showDashboard]);

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
              textDecoration: item.path === '/mp3-stats' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              textDecorationStyle: item.path === '/mp3-stats' ? 'dotted' : undefined,
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
          stats
        </h1>
      </div>

      {!showDashboard ? (
        <div
          className="absolute left-0 right-0 bottom-0 z-[1]"
          style={{
            top: 'clamp(7rem, 14vw, 11rem)',
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
            <pointLight position={[-2, 3, -2]} intensity={0.3} color="#6366f1" />

            <Suspense fallback={<FallbackPlayer onClick={handleOpenDashboard} />}>
              <Mp3PlayerModel onClick={handleOpenDashboard} />
            </Suspense>

            <Environment preset="night" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        <div
          ref={contentRef}
          className="absolute inset-0 z-[1] overflow-auto flex items-start justify-center pt-28 pb-16"
        >
          <div className="w-full max-w-3xl px-6">
            <LastFmDashboard />
          </div>
        </div>
      )}

      {/* Bottom text */}
      <div className="absolute bottom-8 left-8 z-10">
        {showDashboard ? (
          <button
            onClick={handleCloseDashboard}
            className="text-sm font-medium tracking-wide cursor-pointer hover:opacity-60 transition"
            style={{ color: '#ffffff', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Back to Player
          </button>
        ) : (
          <p
            className="text-xs uppercase tracking-[0.2em] leading-relaxed font-medium max-w-[200px] pointer-events-none select-none"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            MY LISTENING STATS
          </p>
        )}
      </div>
    </div>
  );
}
