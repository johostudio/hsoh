import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import type * as THREE from 'three';
import type { TexturePaths } from '../../types';
import { useApplyTextures } from '../../hooks/useApplyTextures';

interface Mp3PlayerModelProps {
  modelPath: string;
  onClick: () => void;
  textures?: TexturePaths;
}

function FallbackPlayer({ onClick }: { onClick: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });

  return (
    <group
      ref={ref}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.6, 0.3]} />
        <meshStandardMaterial
          color={hovered ? '#a78bfa' : '#7c3aed'}
          emissive={hovered ? '#7c3aed' : '#000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.3, 0.16]}>
        <boxGeometry args={[0.7, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#4338ca"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, -0.3, 0.16]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 32]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.2} />
      </mesh>
      <Html center position={[0, -1.2, 0]}>
        <span style={{ color: '#c4b5fd', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Click for stats
        </span>
      </Html>
    </group>
  );
}

export default function Mp3PlayerModel({ modelPath, onClick, textures }: Mp3PlayerModelProps) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
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
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.05 : 1}
        />
        <Html center position={[0, -1.5, 0]}>
          <span style={{ color: '#c4b5fd', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Click for stats
          </span>
        </Html>
      </group>
    );
  } catch {
    return <FallbackPlayer onClick={onClick} />;
  }
}
