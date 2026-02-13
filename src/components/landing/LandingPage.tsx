import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import RotatableModel from './RotatableModel';
import FloatingIcons from './FloatingIcons';
import type { FloatingIconData, TexturePaths } from '../../types';

const MODEL_PATH = '/models/landing.glb';

// External textures for the landing model (cassette).
// These are applied on top of (or in place of) any textures embedded in the GLB.
// Set to undefined to rely solely on embedded GLB textures.
const LANDING_TEXTURES: TexturePaths | undefined = undefined;
// To enable external textures, replace the line above with:
// const LANDING_TEXTURES: TexturePaths = {
//   baseColor: '/models/landing_textures/lowPolyExploded1_Casette_4K_BaseColor.1001.png',
//   normal: '/models/landing_textures/lowPolyExploded1_Casette_4K_Normal.1001.png',
//   roughness: '/models/landing_textures/lowPolyExploded1_Casette_4K_Roughness.1001.png',
//   metallic: '/models/landing_textures/lowPolyExploded1_Casette_4K_Metallic.1001.png',
//   height: '/models/landing_textures/lowPolyExploded1_Casette_4K_Height.1001.png',
// };

const FLOATING_ICONS: FloatingIconData[] = [
  {
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg',
    linkUrl: 'https://open.spotify.com',
    position: [-2.5, 1, 0],
    label: 'Spotify',
  },
  {
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    linkUrl: 'https://youtube.com',
    position: [2.5, 1, 0],
    label: 'YouTube',
  },
];

function FallbackModel() {
  return (
    <mesh>
      <icosahedronGeometry args={[1.2, 3]} />
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        emissive="#6366f1"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 50 }}
        style={{ width: '100%', height: '100vh' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-3, 2, -3]} intensity={0.5} color="#a78bfa" />

        <Suspense fallback={<FallbackModel />}>
          <RotatableModel modelPath={MODEL_PATH} scale={1.5} textures={LANDING_TEXTURES} />
        </Suspense>

        <FloatingIcons icons={FLOATING_ICONS} />

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
        />
        <Environment preset="city" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      {/* Navigation overlay */}
      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        {[
          { path: '/gallery', label: 'Gallery' },
          { path: '/mp3-stats', label: 'MP3 / Stats' },
          { path: '/studio', label: 'Studio' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
