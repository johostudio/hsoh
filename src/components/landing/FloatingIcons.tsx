import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { FloatingIconData } from '../../types';

interface FloatingIconsProps {
  icons: FloatingIconData[];
}

function FloatingIcon({ iconUrl, linkUrl, position, label }: FloatingIconData) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Html center distanceFactor={8} style={{ pointerEvents: 'auto' }}>
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            transition: 'transform 0.3s ease, filter 0.3s ease',
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
            filter: hovered
              ? 'drop-shadow(0 0 12px rgba(100, 200, 255, 0.8))'
              : 'none',
            cursor: 'pointer',
          }}
        >
          <img
            src={iconUrl}
            alt={label}
            style={{ width: '48px', height: '48px', borderRadius: '8px' }}
          />
          <span
            style={{
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {label}
          </span>
        </a>
      </Html>
    </group>
  );
}

export default function FloatingIcons({ icons }: FloatingIconsProps) {
  return (
    <>
      {icons.map((icon) => (
        <FloatingIcon key={icon.label} {...icon} />
      ))}
    </>
  );
}
