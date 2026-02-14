import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface EightKeyPianoModelProps {
  onClick: () => void;
}

// 7 white keys: C D E F G A B (one octave, no repeat C)
const NUM_WHITE_KEYS = 7;
// Black keys sit between: C#(0-1), D#(1-2), skip(2-3), F#(3-4), G#(4-5), A#(5-6)
const BLACK_KEY_POSITIONS = [0, 1, 3, 4, 5]; // relative to white key gaps

const WHITE_KEY_WIDTH = 0.22;
const WHITE_KEY_DEPTH = 1.0;
const WHITE_KEY_HEIGHT = 0.08;
const BLACK_KEY_WIDTH = 0.13;
const BLACK_KEY_DEPTH = 0.6;
const BLACK_KEY_HEIGHT = 0.08;
const GAP = 0.025;

export default function EightKeyPianoModel({ onClick }: EightKeyPianoModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0008) * 0.05;
    }
  });

  const totalWidth = NUM_WHITE_KEYS * (WHITE_KEY_WIDTH + GAP);
  const offsetX = -totalWidth / 2;

  const whiteKeyColor = hovered ? '#f8f8f8' : '#f0f0f0';
  const blackKeyColor = hovered ? '#2a2a2a' : '#1a1a1a';
  const bodyColor = hovered ? '#1a1a2e' : '#111111';

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      scale={2.2}
    >
      {/* Piano body */}
      <mesh position={[0, -0.04, -0.05]}>
        <boxGeometry args={[totalWidth + 0.15, 0.08, WHITE_KEY_DEPTH + 0.15]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.2}
          metalness={0.6}
          emissive={hovered ? '#4338ca' : '#000000'}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>

      {/* White keys */}
      {Array.from({ length: NUM_WHITE_KEYS }).map((_, i) => {
        const x = offsetX + i * (WHITE_KEY_WIDTH + GAP) + WHITE_KEY_WIDTH / 2;
        return (
          <mesh key={`white-${i}`} position={[x, WHITE_KEY_HEIGHT / 2, 0]}>
            <boxGeometry args={[WHITE_KEY_WIDTH, WHITE_KEY_HEIGHT, WHITE_KEY_DEPTH]} />
            <meshStandardMaterial
              color={whiteKeyColor}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Black keys */}
      {BLACK_KEY_POSITIONS.map((bk, i) => {
        const x =
          offsetX +
          (bk + 0.5) * (WHITE_KEY_WIDTH + GAP) +
          WHITE_KEY_WIDTH / 2;
        return (
          <mesh
            key={`black-${i}`}
            position={[
              x,
              WHITE_KEY_HEIGHT + BLACK_KEY_HEIGHT / 2,
              -(WHITE_KEY_DEPTH - BLACK_KEY_DEPTH) / 2,
            ]}
          >
            <boxGeometry args={[BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT, BLACK_KEY_DEPTH]} />
            <meshStandardMaterial
              color={blackKeyColor}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
        );
      })}

      {/* Subtle accent line on front edge */}
      <mesh position={[0, 0.0, WHITE_KEY_DEPTH / 2 + 0.01]}>
        <boxGeometry args={[totalWidth + 0.1, 0.02, 0.005]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Click label */}
      <Html center position={[0, -0.5, 0]}>
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
          Click to enter studio
        </span>
      </Html>
    </group>
  );
}
