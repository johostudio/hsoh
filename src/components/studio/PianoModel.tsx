import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface PianoModelProps {
  onClick: () => void;
}

// White key layout for one octave: C D E F G A B
const WHITE_KEYS = [0, 1, 2, 3, 4, 5, 6]; // 7 white keys per octave
// Black key positions relative to white keys (between: C#, D#, skip, F#, G#, A#)
const BLACK_KEY_OFFSETS = [0, 1, 3, 4, 5]; // indices where black keys sit

const OCTAVES = 3;
const WHITE_KEY_WIDTH = 0.18;
const WHITE_KEY_DEPTH = 0.8;
const WHITE_KEY_HEIGHT = 0.06;
const BLACK_KEY_WIDTH = 0.1;
const BLACK_KEY_DEPTH = 0.5;
const BLACK_KEY_HEIGHT = 0.06;
const GAP = 0.02;

export default function PianoModel({ onClick }: PianoModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const totalWhiteKeys = OCTAVES * 7 + 1; // +1 for final C
  const totalWidth = totalWhiteKeys * (WHITE_KEY_WIDTH + GAP);
  const offsetX = -totalWidth / 2;

  const whiteKeys: React.ReactNode[] = [];
  const blackKeys: React.ReactNode[] = [];

  for (let octave = 0; octave < OCTAVES; octave++) {
    for (const wk of WHITE_KEYS) {
      const index = octave * 7 + wk;
      const x = offsetX + index * (WHITE_KEY_WIDTH + GAP) + WHITE_KEY_WIDTH / 2;

      whiteKeys.push(
        <mesh key={`white-${index}`} position={[x, WHITE_KEY_HEIGHT / 2, 0]}>
          <boxGeometry args={[WHITE_KEY_WIDTH, WHITE_KEY_HEIGHT, WHITE_KEY_DEPTH]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.1} />
        </mesh>
      );
    }

    for (const bk of BLACK_KEY_OFFSETS) {
      const whiteIndex = octave * 7 + bk;
      const x = offsetX + (whiteIndex + 0.5) * (WHITE_KEY_WIDTH + GAP) + WHITE_KEY_WIDTH / 2;

      blackKeys.push(
        <mesh key={`black-${octave}-${bk}`} position={[x, WHITE_KEY_HEIGHT + BLACK_KEY_HEIGHT / 2, -(WHITE_KEY_DEPTH - BLACK_KEY_DEPTH) / 2]}>
          <boxGeometry args={[BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT, BLACK_KEY_DEPTH]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.2} />
        </mesh>
      );
    }
  }

  // Final C white key
  const lastIndex = OCTAVES * 7;
  const lastX = offsetX + lastIndex * (WHITE_KEY_WIDTH + GAP) + WHITE_KEY_WIDTH / 2;
  whiteKeys.push(
    <mesh key={`white-${lastIndex}`} position={[lastX, WHITE_KEY_HEIGHT / 2, 0]}>
      <boxGeometry args={[WHITE_KEY_WIDTH, WHITE_KEY_HEIGHT, WHITE_KEY_DEPTH]} />
      <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.1} />
    </mesh>
  );

  return (
    <group ref={groupRef} onClick={onClick} scale={2.2}>
      {/* Piano body */}
      <mesh position={[0, -0.04, -0.05]}>
        <boxGeometry args={[totalWidth + 0.15, 0.08, WHITE_KEY_DEPTH + 0.15]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Keys */}
      {whiteKeys}
      {blackKeys}

      {/* Label */}
      <Html center position={[0, -0.4, 0]}>
        <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: "'Alliance No.2', Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Click to enter studio
        </span>
      </Html>
    </group>
  );
}
