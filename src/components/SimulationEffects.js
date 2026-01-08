import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Arc Reactor Blast Effect
export const ArcReactorBlast = ({ position, active }) => {
  const meshRef = useRef();
  const particlesRef = useRef();

  useFrame((state) => {
    if (!active || !meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Pulsing energy sphere
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(time * 5) * 0.3);
      meshRef.current.material.emissiveIntensity = 3 + Math.sin(time * 8) * 2;
    }
    
    // Energy particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.02;
      const particles = particlesRef.current.children;
      particles.forEach((particle, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const radius = 0.5 + Math.sin(time * 2 + i) * 0.2;
        particle.position.x = Math.cos(angle + time) * radius;
        particle.position.z = Math.sin(angle + time) * radius;
        particle.position.y = Math.sin(time * 3 + i) * 0.3;
      });
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      {/* Main energy sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Energy particles */}
      <group ref={particlesRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={2}
            />
          </mesh>
        ))}
      </group>
      
      {/* Energy beam */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.3, 3, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

// Hover Animation
export const HoverAnimation = ({ objectRef, active, speed = 1 }) => {
  useFrame((state) => {
    if (!active || !objectRef.current) return;
    const time = state.clock.getElapsedTime();
    objectRef.current.position.y += Math.sin(time * speed * 2) * 0.001;
  });
  return null;
};

// Rotation Animation
export const RotationAnimation = ({ objectRef, active, speed = 1 }) => {
  useFrame(() => {
    if (!active || !objectRef.current) return;
    objectRef.current.rotation.y += 0.01 * speed;
  });
  return null;
};

// Simulation Manager Component
export const SimulationManager = ({ objectId, simulation, objectPosition, objectRef }) => {
  const effects = useMemo(() => {
    if (!simulation || !simulation.active) return null;

    switch (simulation.type) {
      case 'arc_reactor_blast':
        return <ArcReactorBlast position={objectPosition} active={simulation.active} />;
      case 'hover':
        return <HoverAnimation objectRef={objectRef} active={simulation.active} />;
      case 'rotate':
        return <RotationAnimation objectRef={objectRef} active={simulation.active} />;
      default:
        return null;
    }
  }, [simulation, objectPosition, objectRef]);

  return effects;
};

