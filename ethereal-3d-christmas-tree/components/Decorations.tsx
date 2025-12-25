
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Star: React.FC = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.8;
  });

  return (
    <group ref={ref} position={[0, 2.3, 0]}>
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color="#ffd700" 
          emissive="#ffaa00" 
          emissiveIntensity={6} 
        />
      </mesh>
      <pointLight color="#ffcc00" intensity={15} distance={10} />
    </group>
  );
};

const Ornaments: React.FC = () => {
  const count = 70;
  const ornaments = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const y = Math.random() * 6 - 3.8;
      const normalizedY = (y + 4) / 6.5;
      const radius = (1 - normalizedY) * 2.8 + 0.2;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const colors = ['#ff2222', '#22ffcc', '#ffdd00', '#ffffff', '#ff00ff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return { position: [x, y, z], color };
    });
  }, [count]);

  return (
    <group>
      {ornaments.map((o, i) => (
        <group key={i} position={o.position as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial 
              color={o.color} 
              emissive={o.color} 
              emissiveIntensity={1.2} 
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <pointLight color={o.color} intensity={0.2} distance={1} />
        </group>
      ))}
    </group>
  );
};

export const Decorations: React.FC = () => (
  <group position={[0, 0, 0]}>
    <Star />
    <Ornaments />
  </group>
);
