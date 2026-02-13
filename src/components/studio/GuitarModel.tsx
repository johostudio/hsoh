import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import type * as THREE from 'three';
import type { TexturePaths } from '../../types';
import { useApplyTextures } from '../../hooks/useApplyTextures';

interface GuitarModelProps {
  modelPath: string;
  onClick: () => void;
  textures?: TexturePaths;
}

export function FallbackGuitar({ onClick }: { onClick: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <group
      ref={ref}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.6, 0.4, 8, 16]} />
        <meshStandardMaterial
          color={hovered ? '#f97316' : '#c2410c'}
          emissive={hovered ? '#ea580c' : '#000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.15, 1.8, 0.08]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.06]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>
      {[-0.04, -0.015, 0.015, 0.04].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0.05]}>
          <boxGeometry args={[0.003, 2.4, 0.003]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, -0.2, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.02, 8, 32]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      <Html center position={[0, -1.5, 0]}>
        <span style={{ color: '#2d1810', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          Click to enter studio
        </span>
      </Html>
    </group>
  );
}

export default function GuitarModel({ modelPath, onClick, textures }: GuitarModelProps) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(modelPath, 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useApplyTextures(clonedScene, textures);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <group>
      <primitive
        ref={ref}
        object={clonedScene}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.65 : 1.5}
      />
      <Html center position={[0, -2.5, 0]}>
        <span style={{ color: '#2d1810', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          Click to enter studio
        </span>
      </Html>
    </group>
  );
}
