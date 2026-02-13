import { useRef, useState } from 'react';
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

function FallbackBook({ onOpen }: { onOpen: () => void }) {
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
            color: '#a5b4fc',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
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

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { scene } = useGLTF(modelPath);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useApplyTextures(scene, textures);

    return (
      <group>
        <primitive
          ref={ref}
          object={scene}
          onClick={onOpen}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.05 : 1}
        />
        <Html center position={[0, -1.8, 0]}>
          <span
            style={{
              color: '#a5b4fc',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Click to explore
          </span>
        </Html>
      </group>
    );
  } catch {
    return <FallbackBook onOpen={onOpen} />;
  }
}
