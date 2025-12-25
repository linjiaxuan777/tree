import React, { useMemo } from 'react';
import * as THREE from 'three';

// Define R3F intrinsic elements as components to resolve JSX type errors
const Group = 'group' as any;
const Points = 'points' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;
const PointsMaterial = 'pointsMaterial' as any;
const Mesh = 'mesh' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const TubeGeometry = 'tubeGeometry' as any;

const TreeParticles: React.FC = () => {
  const treeCount = 30000;
  const baseSnowCount = 8000;

  // Tree Foliage Logic
  const particles = useMemo(() => {
    const positions = new Float32Array(treeCount * 3);
    const colors = new Float32Array(treeCount * 3);
    for (let i = 0; i < treeCount; i++) {
      const tierCount = 5;
      const tier = Math.floor(Math.random() * tierCount);
      const tierHeight = 1.2;
      const vFactor = Math.random();
      const y = -4 + (tier * tierHeight) + (vFactor * tierHeight);
      const totalNormalizedY = (y + 4) / (tierCount * tierHeight);
      const baseRadius = (1 - (tier / tierCount)) * 3;
      const tierRadius = baseRadius * (1 - (vFactor * 0.45)); 
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.6) * tierRadius;
      positions[i * 3] = Math.cos(angle) * dist;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * dist;
      const colorVar = Math.random() * 0.15;
      colors[i * 3] = 0.01 + colorVar * 0.05;
      colors[i * 3 + 1] = 0.12 + (1 - totalNormalizedY) * 0.25 + colorVar;
      colors[i * 3 + 2] = 0.03 + colorVar * 0.05;
    }
    return { positions, colors };
  }, [treeCount]);

  // Base Snow Particles Logic
  const baseSnow = useMemo(() => {
    const pos = new Float32Array(baseSnowCount * 3);
    for (let i = 0; i < baseSnowCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.7) * 5;
      pos[i * 3] = Math.cos(angle) * dist;
      pos[i * 3 + 1] = -4.7 + Math.random() * 0.15; 
      pos[i * 3 + 2] = Math.sin(angle) * dist;
    }
    return pos;
  }, [baseSnowCount]);

  // Golden Spiral Path - Limited to the foliage region (above the trunk)
  const ribbonPath = useMemo(() => {
    const pts = [];
    const segments = 150;
    const loops = 6; 
    const startY = -3.4; // Slightly higher to strictly avoid the trunk area
    const endY = 2.1; 
    const height = endY - startY;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = startY + t * height;
      const radius = (1 - t) * 2.8 + 0.15;
      const angle = t * Math.PI * 2 * loops;
      const wobble = Math.sin(t * 20) * 0.04;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * (radius + wobble), 
        y, 
        Math.sin(angle) * (radius + wobble)
      ));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  return (
    <Group>
      {/* Base Snow Pool */}
      <Points>
        <BufferGeometry>
          <BufferAttribute
            attach="attributes-position"
            count={baseSnowCount}
            array={baseSnow}
            itemSize={3}
          />
        </BufferGeometry>
        <PointsMaterial
          size={0.045}
          color="#ffffff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Trunk */}
      <Mesh position={[0, -4.1, 0]}>
        <CylinderGeometry args={[0.2, 0.3, 1.2, 12]} />
        <MeshStandardMaterial color="#1a0f08" roughness={1} />
      </Mesh>

      {/* Golden Ribbon Spiral */}
      <Mesh>
        <TubeGeometry args={[ribbonPath, 150, 0.012, 8, false]} />
        <MeshStandardMaterial 
          color="#ffd700" 
          emissive="#ffaa00" 
          emissiveIntensity={1.5} 
          metalness={0.9} 
          roughness={0.1} 
        />
      </Mesh>

      {/* Particle Foliage */}
      <Points>
        <BufferGeometry>
          <BufferAttribute
            attach="attributes-position"
            count={treeCount}
            array={particles.positions}
            itemSize={3}
          />
          <BufferAttribute
            attach="attributes-color"
            count={treeCount}
            array={particles.colors}
            itemSize={3}
          />
        </BufferGeometry>
        <PointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </Group>
  );
};

export default TreeParticles;