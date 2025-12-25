
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Define R3F intrinsic elements as components to resolve JSX type errors
const Points = 'points' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;
const PointsMaterial = 'pointsMaterial' as any;

const Snow: React.FC = () => {
  const count = 6000;
  const meshRef = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 25 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      vel[i] = Math.random() * 0.04 + 0.02;
    }
    return { pos, vel };
  }, [count]);

  useFrame(() => {
    const positions = meshRef.current.geometry.getAttribute('position');
    for (let i = 0; i < count; i++) {
      let y = positions.getY(i);
      y -= particles.vel[i];
      if (y < -6) y = 18;
      positions.setY(i, y);
      
      let x = positions.getX(i);
      x += Math.sin(y * 0.2 + i) * 0.005;
      positions.setX(i, x);
    }
    positions.needsUpdate = true;
  });

  return (
    <Points ref={meshRef}>
      <BufferGeometry>
        <BufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.pos}
          itemSize={3}
        />
      </BufferGeometry>
      <PointsMaterial 
        size={0.1} 
        color="white" 
        transparent 
        opacity={0.6} 
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default Snow;
