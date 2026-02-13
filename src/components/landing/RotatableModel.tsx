import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { TexturePaths } from '../../types';
import { useApplyTextures } from '../../hooks/useApplyTextures';

interface RotatableModelProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  textures?: TexturePaths;
}

export default function RotatableModel({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  textures,
}: RotatableModelProps) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  useApplyTextures(scene, textures);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={scale}
      position={position}
    />
  );
}
