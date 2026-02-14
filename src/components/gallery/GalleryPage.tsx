import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import VhsModel, { FallbackVhs } from './VhsModel';
import VideoCarousel from './VideoCarousel';
import { ModelErrorBoundary } from '../ModelErrorBoundary';
import GridBackground from '../GridBackground';
import type { VideoItem } from '../../types';

const VIDEOS: VideoItem[] = [
  { src: 'https://www.youtube.com/embed/m25fHW8T_Xg', title: 'Music Video 1', type: 'youtube' },
  { src: 'https://www.youtube.com/embed/F9rYDgfECxA', title: 'Music Video 2', type: 'youtube' },
  { src: 'https://www.youtube.com/embed/5nAU2YZQn8I', title: 'Music Video 3', type: 'youtube' },
  { src: 'https://www.youtube.com/embed/Ue9InrCvprk', title: 'Music Video 4', type: 'youtube' },
];

export default function GalleryPage() {
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOpenGallery = useCallback(() => {
    setIsAnimating(true);
    // Small delay for fade-out animation
    setTimeout(() => {
      setShowGallery(true);
      setIsAnimating(false);
    }, 300);
  }, []);

  const handleCloseGallery = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowGallery(false);
      setIsAnimating(false);
    }, 300);
  }, []);

  // Fade-in effect when gallery content mounts
  useEffect(() => {
    if (showGallery && contentRef.current) {
      contentRef.current.style.opacity = '0';
      contentRef.current.style.transform = 'scale(0.95)';
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          contentRef.current.style.opacity = '1';
          contentRef.current.style.transform = 'scale(1)';
        }
      });
    }
  }, [showGallery]);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Grid background */}
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
              textDecoration: item.path === '/gallery' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              textDecorationStyle: item.path === '/gallery' ? 'dotted' : undefined,
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Page title - centered (static) */}
      <div className="absolute top-6 left-0 right-0 z-10 pointer-events-none select-none flex justify-center">
        <h1
          className="font-bold lowercase leading-[0.85] tracking-[-0.06em]"
          style={{ color: '#ffffff', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
        >
          gallery
        </h1>
      </div>

      {!showGallery ? (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
            <spotLight position={[0, 5, 0]} intensity={0.4} angle={0.4} />

            <ModelErrorBoundary fallback={<FallbackVhs onClick={handleOpenGallery} />}>
              <Suspense fallback={<FallbackVhs onClick={handleOpenGallery} />}>
                <VhsModel onClick={handleOpenGallery} />
              </Suspense>
            </ModelErrorBoundary>

            <Environment preset="night" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        <div
          ref={contentRef}
          className="absolute inset-0 z-[1] flex items-center justify-center"
          style={{ opacity: isAnimating ? 0 : 1 }}
        >
          <div className="w-full max-w-2xl px-6">
            <VideoCarousel videos={VIDEOS} />
          </div>
        </div>
      )}

      {/* Bottom text (static) */}
      <div className="absolute bottom-8 left-8 z-10">
        {showGallery ? (
          <button
            onClick={handleCloseGallery}
            className="text-sm font-medium tracking-wide cursor-pointer hover:opacity-60 transition"
            style={{ color: '#ffffff', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Back to Model
          </button>
        ) : (
          <p
            className="text-xs uppercase tracking-[0.2em] leading-relaxed font-medium max-w-[200px] pointer-events-none select-none"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            WATCH MY VISUALS
          </p>
        )}
      </div>
    </div>
  );
}
