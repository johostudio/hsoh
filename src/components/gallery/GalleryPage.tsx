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
    <div className="relative w-full h-screen flex flex-col">
      {!showGallery ? (
        /* Book model view */
        <div className="flex-1">
          <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
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
        /* Film stills gallery */
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-gray-950 to-gray-900">
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

      {/* Navigation */}
      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        <button
          onClick={() =>
            showGallery ? setShowGallery(false) : navigate('/landing')
          }
          className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all cursor-pointer"
        >
          {showGallery ? 'Back to Book' : 'Home'}
        </button>
        {[
          { path: '/mp3-stats', label: 'MP3 / Stats' },
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
