import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface VhsModelProps {
  onClick: () => void;
}

export default function VhsModel({ onClick }: VhsModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0008) * 0.05;
    }
  });

  const bodyColor = hovered ? '#2a2a3e' : '#1a1a2e';
  const accentColor = hovered ? '#818cf8' : '#4f46e5';

  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={2}
    >
      {/* Main VHS body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.9, 1.15, 0.28]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Front label area */}
      <mesh position={[0, 0.1, 0.141]}>
        <boxGeometry args={[1.6, 0.7, 0.005]} />
        <meshStandardMaterial
          color="#111122"
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Label accent stripe */}
      <mesh position={[0, 0.25, 0.145]}>
        <boxGeometry args={[1.55, 0.08, 0.005]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Label stripe 2 */}
      <mesh position={[0, -0.05, 0.145]}>
        <boxGeometry args={[1.55, 0.03, 0.005]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.1}
          roughness={0.3}
        />
      </mesh>

      {/* Tape window - left reel */}
      <mesh position={[-0.4, -0.3, 0.141]}>
        <cylinderGeometry args={[0.15, 0.15, 0.01, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Tape window - right reel */}
      <mesh position={[0.4, -0.3, 0.141]}>
        <cylinderGeometry args={[0.15, 0.15, 0.01, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Left reel hub */}
      <mesh position={[-0.4, -0.3, 0.145]}>
        <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Right reel hub */}
      <mesh position={[0.4, -0.3, 0.145]}>
        <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Tape visible between reels */}
      <mesh position={[0, -0.3, 0.142]}>
        <boxGeometry args={[0.4, 0.02, 0.005]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
      </mesh>

      {/* Bottom edge guard */}
      <mesh position={[0, -0.575, 0]}>
        <boxGeometry args={[1.9, 0.02, 0.29]} />
        <meshStandardMaterial color="#222233" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Top edge */}
      <mesh position={[0, 0.575, 0]}>
        <boxGeometry args={[1.9, 0.02, 0.29]} />
        <meshStandardMaterial color="#222233" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Side grip lines - left */}
      {[-0.2, -0.1, 0, 0.1, 0.2].map((y, i) => (
        <mesh key={`grip-l-${i}`} position={[-0.951, y, 0]}>
          <boxGeometry args={[0.005, 0.04, 0.25]} />
          <meshStandardMaterial color="#333344" roughness={0.5} />
        </mesh>
      ))}

      {/* Click label */}
      <Html center position={[0, -1, 0]}>
        <span
          style={{
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            fontFamily:
              "'Alliance No.2', Helvetica Neue, Helvetica, Arial, sans-serif",
          }}
        >
          Click to explore
        </span>
      </Html>
    </group>
  );
}

export function FallbackVhs({ onClick }: { onClick: () => void }) {
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
      <mesh>
        <boxGeometry args={[1.9, 1.15, 0.28]} />
        <meshStandardMaterial
          color={hovered ? '#818cf8' : '#4f46e5'}
          emissive={hovered ? '#4f46e5' : '#000'}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>
      <Html center position={[0, -1, 0]}>
        <span
          style={{
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            fontFamily:
              "'Alliance No.2', Helvetica Neue, Helvetica, Arial, sans-serif",
          }}
        >
          Click to explore
        </span>
      </Html>
    </group>
  );
}
