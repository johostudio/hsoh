import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface Mp3PlayerModelProps {
  onClick: () => void;
}

export function FallbackPlayer({ onClick }: { onClick: () => void }) {
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
        <boxGeometry args={[0.6, 1.8, 0.15]} />
        <meshStandardMaterial
          color={hovered ? '#f0f0f4' : '#e0e0e4'}
          emissive={hovered ? '#6366f1' : '#000'}
          emissiveIntensity={hovered ? 0.15 : 0}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <Html center position={[0, -1.4, 0]}>
        <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: "'Alliance No.2', Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Click for stats
        </span>
      </Html>
    </group>
  );
}

export default function Mp3PlayerModel({ onClick }: Mp3PlayerModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0006) * 0.03;
    }
  });

  // iPod Nano proportions -- tall, slim, minimal
  const bodyW = 0.9;
  const bodyH = 2.2;
  const bodyD = 0.1;

  // Screen -- takes up most of the face
  const screenW = 0.72;
  const screenH = 1.35;
  const screenY = 0.25;

  // Small click wheel at bottom
  const wheelRadius = 0.22;
  const wheelY = -0.72;
  const centerBtnRadius = 0.07;

  const bodyColor = hovered ? '#f0f0f2' : '#e8e8ec';
  const screenColor = hovered ? '#111120' : '#0a0a14';
  const accentEmissive = hovered ? 0.15 : 0;

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      scale={hovered ? 1.55 : 1.5}
    >
      {/* Main body -- slim rectangle */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[bodyW, bodyH, bodyD]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.12}
          metalness={0.85}
          emissive={hovered ? '#6366f1' : '#000000'}
          emissiveIntensity={accentEmissive}
        />
      </mesh>

      {/* Rounded top and bottom edges */}
      <mesh position={[0, bodyH / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[bodyD / 2, bodyD / 2, bodyW, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.12} metalness={0.85} emissive={hovered ? '#6366f1' : '#000000'} emissiveIntensity={accentEmissive} />
      </mesh>
      <mesh position={[0, -bodyH / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[bodyD / 2, bodyD / 2, bodyW, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.12} metalness={0.85} emissive={hovered ? '#6366f1' : '#000000'} emissiveIntensity={accentEmissive} />
      </mesh>

      {/* Front face -- slightly lighter inset */}
      <mesh position={[0, 0, bodyD / 2 + 0.001]}>
        <planeGeometry args={[bodyW - 0.06, bodyH - 0.06]} />
        <meshStandardMaterial
          color={hovered ? '#e4e4e8' : '#dcdce0'}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>

      {/* Screen */}
      <mesh position={[0, screenY, bodyD / 2 + 0.006]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshStandardMaterial
          color={screenColor}
          roughness={0.05}
          metalness={0.2}
          emissive="#4338ca"
          emissiveIntensity={hovered ? 0.12 : 0.04}
        />
      </mesh>

      {/* Screen border -- thin line */}
      <mesh position={[0, screenY, bodyD / 2 + 0.004]}>
        <planeGeometry args={[screenW + 0.02, screenH + 0.02]} />
        <meshStandardMaterial
          color="#c8c8cc"
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Screen content -- a few subtle lines */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`line-${i}`} position={[0, screenY + 0.45 - i * 0.22, bodyD / 2 + 0.008]}>
          <planeGeometry args={[screenW * 0.7, 0.006]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={0.25}
            transparent
            opacity={0.35 - i * 0.06}
          />
        </mesh>
      ))}

      {/* Click wheel -- small, at bottom */}
      <mesh position={[0, wheelY, bodyD / 2 + 0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[centerBtnRadius + 0.015, wheelRadius, 36]} />
        <meshStandardMaterial
          color="#d0d0d4"
          roughness={0.2}
          metalness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center button */}
      <mesh position={[0, wheelY, bodyD / 2 + 0.007]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[centerBtnRadius, 24]} />
        <meshStandardMaterial
          color="#e0e0e4"
          roughness={0.15}
          metalness={0.5}
        />
      </mesh>

      {/* Back plate -- brushed aluminum look */}
      <mesh position={[0, 0, -bodyD / 2 - 0.001]}>
        <planeGeometry args={[bodyW - 0.06, bodyH - 0.06]} />
        <meshStandardMaterial
          color="#c0c0c4"
          roughness={0.08}
          metalness={0.9}
        />
      </mesh>

      {/* Click label */}
      <Html center position={[0, -1.6, 0]}>
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
          Click for stats
        </span>
      </Html>
    </group>
  );
}
