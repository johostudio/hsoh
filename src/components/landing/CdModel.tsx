import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CdModelProps {
  scale?: number;
  position?: [number, number, number];
}

export default function CdModel({
  scale = 1,
  position = [0, 0, 0],
}: CdModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      // Gentle tilt oscillation
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale} position={position}>
      {/* CD disc - outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 1.2, 64]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.95}
          roughness={0.05}
          side={THREE.DoubleSide}
          emissive="#4338ca"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* CD disc - back face */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[0.15, 1.2, 64]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.8}
          roughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* CD thickness rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.02, 64, 1, true]} />
        <meshStandardMaterial
          color="#aaaaaa"
          metalness={0.9}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center hole ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.02, 16, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Iridescent ring detail 1 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.4, 0.42, 64]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Iridescent ring detail 2 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.7, 0.72, 64]} />
        <meshStandardMaterial
          color="#a78bfa"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Iridescent ring detail 3 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.95, 0.97, 64]} />
        <meshStandardMaterial
          color="#818cf8"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label area (center disc) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[0.17, 0.38, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
