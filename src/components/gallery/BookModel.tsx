import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import type * as THREE from 'three';
import type { TexturePaths } from '../../types';
import { useApplyTextures } from '../../hooks/useApplyTextures';

interface BookModelProps {
  modelPath: string;
  onOpen: () => void;
  textures?: TexturePaths;
}

export function FallbackBook({ onOpen }: { onOpen: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group
      ref={ref}
      onClick={onOpen}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.8, 0.2]} />
        <meshStandardMaterial
          color={hovered ? '#818cf8' : '#4f46e5'}
          emissive={hovered ? '#4f46e5' : '#000'}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>
      <mesh position={[-0.75, 0, 0]}>
        <boxGeometry args={[0.1, 1.8, 0.22]} />
        <meshStandardMaterial color="#312e81" />
      </mesh>
      <mesh position={[0.05, 0, 0]}>
        <boxGeometry args={[1.2, 1.7, 0.15]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>
      <Html center position={[0, -1.4, 0]}>
        <span
          style={{
            color: '#2d1810',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          }}
        >
          Click to explore
        </span>
      </Html>
    </group>
  );
}

export default function BookModel({ modelPath, onOpen, textures }: BookModelProps) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useApplyTextures(clonedScene, textures);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <primitive
        ref={ref}
        object={clonedScene}
        onClick={onOpen}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.6 : 1.5}
      />
      <Html center position={[0, -2.2, 0]}>
        <span
          style={{
            color: '#2d1810',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          }}
        >
          Click to explore
        </span>
      </Html>
    </group>
  );
}
