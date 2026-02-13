import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import RotatableModel from './RotatableModel';
import { ModelErrorBoundary } from '../ModelErrorBoundary';
import type { TexturePaths } from '../../types';

const MODEL_PATH = '/models/landing.glb';

const LANDING_TEXTURES: TexturePaths | undefined = undefined;

function FallbackModel() {
  return (
    <mesh>
      <icosahedronGeometry args={[1.2, 3]} />
      <meshStandardMaterial
        color="#2d1810"
        wireframe
        emissive="#2d1810"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#f5f0eb' }}>
      {/* Large title - top left */}
      <div className="absolute top-6 left-8 z-10 pointer-events-none select-none">
        <h1
          className="font-bold uppercase leading-[0.85] tracking-[-0.04em]"
          style={{ color: '#2d1810', fontSize: 'clamp(4rem, 12vw, 12rem)' }}
        >
          HSOH
        </h1>
      </div>

      {/* Navigation - top right */}
      <nav className="absolute top-8 right-10 z-10 flex flex-col items-end gap-1">
        {[
          { path: '/landing', label: 'Home' },
          { path: '/gallery', label: 'Gallery' },
          { path: '/mp3-stats', label: 'Stats' },
          { path: '/studio', label: 'Studio' },
        ].map((item, i) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-sm font-medium tracking-wide transition-all cursor-pointer hover:opacity-60"
            style={{
              color: '#2d1810',
              background: 'none',
              border: 'none',
              padding: '2px 0',
              textDecoration: i === 0 ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              textDecorationStyle: i === 0 ? 'dotted' : undefined,
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Social links - right side middle */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col items-end gap-0.5">
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium uppercase tracking-widest hover:opacity-60 transition"
          style={{ color: '#2d1810' }}
        >
          Spotify
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium uppercase tracking-widest hover:opacity-60 transition"
          style={{ color: '#2d1810' }}
        >
          YouTube
        </a>
      </div>

      {/* 3D Canvas - centered */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 1, 4], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.4} color="#c4a882" />

          <ModelErrorBoundary fallback={<FallbackModel />}>
            <Suspense fallback={<FallbackModel />}>
              <RotatableModel modelPath={MODEL_PATH} scale={4.5} textures={LANDING_TEXTURES} />
            </Suspense>
          </ModelErrorBoundary>

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.3}
            scale={12}
            blur={2.5}
          />
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </div>

      {/* Description - bottom left */}
      <div className="absolute bottom-24 left-8 z-10 pointer-events-none select-none">
        <p
          className="text-xs uppercase tracking-[0.2em] leading-relaxed font-medium max-w-[200px]"
          style={{ color: '#2d1810' }}
        >
          I MAKE THINGS (SOMETIMES)
        </p>
      </div>


    </div>
  );
}
