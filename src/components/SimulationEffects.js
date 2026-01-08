import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Arc Reactor Blast Effect
export const ArcReactorBlast = ({ objectRef, active, scale = 1 }) => {
  const coreRef = useRef();
  const particlesRef = useRef();
  const beamRef = useRef();
  const ringRef = useRef();
  const startTimeRef = useRef(Date.now());

  // Reset start time when simulation becomes active
  useEffect(() => {
    if (active) {
      startTimeRef.current = Date.now();
    }
  }, [active]);

  useFrame((state) => {
    if (!active) return;
    
    const time = (Date.now() - startTimeRef.current) / 1000;
    const scaledSize = scale * 0.3;
    
    // Pulsing core energy sphere
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 8) * 0.4;
      coreRef.current.scale.setScalar(pulse * scaledSize);
      if (coreRef.current.material) {
        coreRef.current.material.emissiveIntensity = 5 + Math.sin(time * 10) * 3;
      }
    }
    
    // Rotating energy ring
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
      ringRef.current.rotation.y += 0.01;
    }
    
    // Energy particles orbiting
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.05;
      const particles = particlesRef.current.children;
      particles.forEach((particle, i) => {
        const angle = (i / particles.length) * Math.PI * 2 + time * 2;
        const radius = scaledSize * 1.5 + Math.sin(time * 3 + i) * scaledSize * 0.3;
        particle.position.x = Math.cos(angle) * radius;
        particle.position.z = Math.sin(angle) * radius;
        particle.position.y = Math.sin(time * 4 + i * 0.5) * scaledSize * 0.5;
        
        // Scale particles
        const particleScale = 0.5 + Math.sin(time * 5 + i) * 0.3;
        particle.scale.setScalar(particleScale);
      });
    }
    
    // Energy beam shooting forward
    if (beamRef.current) {
      const beamLength = 5 + Math.sin(time * 3) * 2;
      beamRef.current.scale.z = beamLength;
      beamRef.current.position.z = beamLength / 2;
      if (beamRef.current.material) {
        beamRef.current.material.emissiveIntensity = 4 + Math.sin(time * 6) * 2;
        beamRef.current.material.opacity = 0.7 + Math.sin(time * 4) * 0.2;
      }
    }
  });

  if (!active) return null;

  const scaledSize = scale * 0.3;

  return (
    <group>
      {/* Main pulsing core */}
      <mesh ref={coreRef} position={[0, 0, scaledSize * 0.5]}>
        <sphereGeometry args={[scaledSize, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Rotating energy ring */}
      <mesh ref={ringRef} position={[0, 0, scaledSize * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[scaledSize * 0.8, scaledSize * 0.1, 16, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={4}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Energy particles orbiting */}
      <group ref={particlesRef}>
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[scaledSize * 0.15, 16, 16]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={3}
            />
          </mesh>
        ))}
      </group>
      
      {/* Energy beam shooting forward */}
      <mesh 
        ref={beamRef} 
        position={[0, 0, scaledSize * 0.5]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[scaledSize * 0.2, scaledSize * 0.4, 5, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={4}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Additional glow effect */}
      <mesh position={[0, 0, scaledSize * 0.5]}>
        <sphereGeometry args={[scaledSize * 1.5, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          transparent
          opacity={0.2}
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
export const SimulationManager = ({ objectId, simulation, objectPosition, objectRef, objectScale = 1 }) => {
  const effects = useMemo(() => {
    if (!simulation || !simulation.active) return null;

    switch (simulation.type) {
      case 'arc_reactor_blast':
        return <ArcReactorBlast objectRef={objectRef} active={simulation.active} scale={objectScale} />;
      case 'hover':
        return <HoverAnimation objectRef={objectRef} active={simulation.active} />;
      case 'rotate':
        return <RotationAnimation objectRef={objectRef} active={simulation.active} />;
      default:
        return null;
    }
  }, [simulation, objectRef, objectScale]);

  return effects;
};

