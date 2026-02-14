import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import CdModel from './CdModel';
import GridBackground from '../GridBackground';

function FallbackModel() {
  return (
    <mesh>
      <icosahedronGeometry args={[1.2, 3]} />
      <meshStandardMaterial
        color="#ffffff"
        wireframe
        emissive="#ffffff"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Grid background */}
      <GridBackground />

      {/* Large title - top left */}
      <div className="absolute top-6 left-8 z-10 pointer-events-none select-none">
        <h1
          className="font-bold lowercase leading-[0.85] tracking-[-0.06em]"
          style={{ color: '#ffffff', fontSize: 'clamp(4rem, 12vw, 12rem)' }}
        >
          hsoh
        </h1>
      </div>

      {/* Navigation - top right */}
      <nav className="absolute top-8 right-10 z-10 flex flex-col items-end gap-1">
        {[
          { path: '/landing', label: 'home' },
          { path: '/gallery', label: 'gallery' },
          { path: '/mp3-stats', label: 'stats' },
          { path: '/studio', label: 'studio' },
        ].map((item, i) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-sm font-medium tracking-[-0.02em] transition-all cursor-pointer hover:opacity-60"
            style={{
              color: '#ffffff',
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
          href="https://open.spotify.com/user/ogkatb96r6pdery0jcaeak1fx?si=0e3e8351ea834f83"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium uppercase tracking-widest hover:opacity-60 transition"
          style={{ color: '#ffffff' }}
        >
          Spotify
        </a>
        <a
          href="https://www.youtube.com/@hoshsoh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium uppercase tracking-widest hover:opacity-60 transition"
          style={{ color: '#ffffff' }}
        >
          YouTube
        </a>
        <a
          href="https://www.tiktok.com/@hsoh.wav"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium uppercase tracking-widest hover:opacity-60 transition"
          style={{ color: '#ffffff' }}
        >
          TikTok
        </a>
      </div>

      {/* 3D Canvas - centered, only the model moves */}
      <div className="absolute inset-0 z-[1]">
        <Canvas
          camera={{ position: [0, 1, 4], fov: 50 }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.3} color="#6366f1" />

          <Suspense fallback={<FallbackModel />}>
            <CdModel scale={2.2} position={[0, 0.2, 0]} />
          </Suspense>

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.2}
            scale={12}
            blur={2.5}
            color="#000000"
          />
          <Environment preset="night" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </div>
    </div>
  );
}
