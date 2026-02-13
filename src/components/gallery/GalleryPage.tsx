import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import BookModel, { FallbackBook } from './BookModel';
import FilmStillCarousel from './FilmStillCarousel';
import LightboxViewer from './LightboxViewer';
import { ModelErrorBoundary } from '../ModelErrorBoundary';
import type { FilmStill } from '../../types';

const BOOK_MODEL_PATH = '/models/headphones.glb';

// Placeholder film stills - replace with actual content
const FILM_STILLS: FilmStill[] = [
  { src: 'https://picsum.photos/seed/mv1/800/450', title: 'Music Video 1', description: 'Opening scene' },
  { src: 'https://picsum.photos/seed/mv2/800/450', title: 'Music Video 2', description: 'Performance shot' },
  { src: 'https://picsum.photos/seed/mv3/800/450', title: 'Music Video 3', description: 'Cinematic sequence' },
  { src: 'https://picsum.photos/seed/mv4/800/450', title: 'Music Video 4', description: 'Behind the scenes' },
  { src: 'https://picsum.photos/seed/mv5/800/450', title: 'Music Video 5', description: 'Final cut' },
  { src: 'https://picsum.photos/seed/mv6/800/450', title: 'Music Video 6', description: 'Album visual' },
];

export default function GalleryPage() {
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
              textDecoration: item.path === '/gallery' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              textDecorationStyle: item.path === '/gallery' ? 'dotted' : undefined,
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
          GALLERY
        </h1>
      </div>

      {!showGallery ? (
        <div className="flex-1">
          <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 3]} intensity={1} />
            <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.4} />

            <ModelErrorBoundary fallback={<FallbackBook onOpen={() => setShowGallery(true)} />}>
              <Suspense fallback={<FallbackBook onOpen={() => setShowGallery(true)} />}>
                <BookModel
                  modelPath={BOOK_MODEL_PATH}
                  onOpen={() => setShowGallery(true)}
                />
              </Suspense>
            </ModelErrorBoundary>

            <Environment preset="apartment" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 pt-24">
          <FilmStillCarousel
            stills={FILM_STILLS}
            onSelect={(index) => setLightboxIndex(index)}
          />
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxIndex !== null && (
        <LightboxViewer
          stills={FILM_STILLS}
          selectedIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex(
              (lightboxIndex - 1 + FILM_STILLS.length) % FILM_STILLS.length,
            )
          }
          onNext={() =>
            setLightboxIndex((lightboxIndex + 1) % FILM_STILLS.length)
          }
        />
      )}

      {/* Bottom action */}
      {showGallery && (
        <div className="absolute bottom-8 left-8 z-10">
          <button
            onClick={() => setShowGallery(false)}
            className="text-sm font-medium tracking-wide cursor-pointer hover:opacity-60 transition"
            style={{ color: '#2d1810', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Back to Model
          </button>
        </div>
      )}
    </div>
  );
}
