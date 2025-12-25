
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Define R3F intrinsic elements as components to resolve JSX type errors
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const OctahedronGeometry = 'octahedronGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const PointLight = 'pointLight' as any;
const SphereGeometry = 'sphereGeometry' as any;

const Star: React.FC = () => {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.8;
  });

  return (
    <Group ref={ref} position={[0, 2.3, 0]}>
      <Mesh>
        <OctahedronGeometry args={[0.5, 0]} />
        <MeshStandardMaterial 
          color="#ffd700" 
          emissive="#ffaa00" 
          emissiveIntensity={6} 
        />
      </Mesh>
      <PointLight color="#ffcc00" intensity={15} distance={10} />
    </Group>
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
    <Group>
      {ornaments.map((o, i) => (
        <Group key={i} position={o.position as [number, number, number]}>
          <Mesh>
            <SphereGeometry args={[0.07, 16, 16]} />
            <MeshStandardMaterial 
              color={o.color} 
              emissive={o.color} 
              emissiveIntensity={1.2} 
              roughness={0.1}
              metalness={0.8}
            />
          </Mesh>
          <PointLight color={o.color} intensity={0.2} distance={1} />
        </Group>
      ))}
    </Group>
  );
};

export const Decorations: React.FC = () => (
  <Group position={[0, 0, 0]}>
    <Star />
    <Ornaments />
  </Group>
);
