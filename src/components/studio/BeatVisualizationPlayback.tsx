import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface BeatVisualizationPlaybackProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
}

function VisualizerBars({ analyser }: { analyser: AnalyserNode }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const barCount = 64;
  const dataArray = useMemo(
    () => new Uint8Array(analyser.frequencyBinCount),
    [analyser],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    analyser.getByteFrequencyData(dataArray);

    const step = Math.floor(dataArray.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step] / 255;
      const height = Math.max(0.05, value * 3);

      const angle = (i / barCount) * Math.PI * 2;
      const radius = 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      dummy.position.set(x, height / 2, z);
      dummy.scale.set(0.12, height, 0.12);
      dummy.lookAt(0, height / 2, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color based on frequency range
      const hue = (i / barCount) * 0.8;
      colorObj.setHSL(hue, 0.8, 0.3 + value * 0.4);
      meshRef.current.setColorAt(i, colorObj);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, barCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function InactiveVisualizer() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial
        color="#4f46e5"
        wireframe
        emissive="#4338ca"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function BeatVisualizationPlayback({
  analyser,
  isActive,
}: BeatVisualizationPlaybackProps) {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#818cf8" />
        <pointLight position={[3, 2, 3]} intensity={0.5} color="#c084fc" />

        {isActive && analyser ? (
          <VisualizerBars analyser={analyser} />
        ) : (
          <InactiveVisualizer />
        )}

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
