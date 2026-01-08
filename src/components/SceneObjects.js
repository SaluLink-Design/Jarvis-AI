import React from 'react';
import { Box, Sphere, Cylinder, Cone, useGLTF } from '@react-three/drei';

// Preload common models (can be expanded)
// Note: If modelPath doesn't exist, the system will fall back to simple shapes
const ModelLoader = ({ modelPath, position, scale, color }) => {
  const { scene } = useGLTF(modelPath);
  
  React.useEffect(() => {
    // Apply color tint if provided
    if (color && scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          // Only modify color if material exists and is not an array
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat) mat.color.set(color);
            });
          } else if (child.material.color) {
            child.material.color.set(color);
          }
        }
      });
    }
  }, [scene, color]);
  
  return (
    <primitive 
      object={scene.clone()} 
      position={position} 
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

const SceneObjects = ({ objects }) => {
  const renderObject = (obj, index) => {
    const { type, position = [0, 1, 0], color = '#00ffff', scale = 1, model, modelPath } = obj;
    const [x, y, z] = position;
    
    // If a 3D model file path is provided, load and render it
    if (modelPath) {
      return (
        <ModelLoader
          key={index}
          modelPath={modelPath}
          position={[x, y, z]}
          scale={scale}
          color={color}
        />
      );
    }

    const commonProps = {
      key: index,
      castShadow: true,
      receiveShadow: true
    };

    // Render car model
    if (type === 'car' || model === 'car') {
      return (
        <group position={[x, y, z]} {...commonProps}>
          {/* Car body */}
          <Box position={[0, 0.3, 0]} args={[scale * 1.5, scale * 0.6, scale * 2.5]}>
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </Box>
          {/* Car roof */}
          <Box position={[0, 0.7, -0.2]} args={[scale * 1.2, scale * 0.5, scale * 1.2]}>
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </Box>
          {/* Wheels */}
          <Cylinder position={[-scale * 0.8, 0, scale * 0.8]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.3, scale * 0.3, scale * 0.2]}>
            <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.3} />
          </Cylinder>
          <Cylinder position={[scale * 0.8, 0, scale * 0.8]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.3, scale * 0.3, scale * 0.2]}>
            <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.3} />
          </Cylinder>
          <Cylinder position={[-scale * 0.8, 0, -scale * 0.8]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.3, scale * 0.3, scale * 0.2]}>
            <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.3} />
          </Cylinder>
          <Cylinder position={[scale * 0.8, 0, -scale * 0.8]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.3, scale * 0.3, scale * 0.2]}>
            <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.3} />
          </Cylinder>
        </group>
      );
    }

    // Render Iron Man suit
    if (type === 'suit' || model === 'iron_man' || model === 'iron_man_mark1') {
      // Use simple geometric representation (fallback when no 3D model file is provided)
      const suitColor = color === '#ff0000' ? '#ff0000' : '#ff4444';
      return (
        <group position={[x, y, z]} {...commonProps}>
          {/* Head/Helmet */}
          <Sphere position={[0, scale * 1.2, 0]} args={[scale * 0.4, 32, 32]}>
            <meshStandardMaterial color={suitColor} metalness={0.9} roughness={0.1} />
          </Sphere>
          {/* Torso */}
          <Box position={[0, scale * 0.5, 0]} args={[scale * 0.8, scale * 1.2, scale * 0.6]}>
            <meshStandardMaterial color={suitColor} metalness={0.9} roughness={0.1} />
          </Box>
          {/* Arc Reactor */}
          <Sphere position={[0, scale * 0.5, scale * 0.35]} args={[scale * 0.15, 16, 16]}>
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
          </Sphere>
          {/* Arms */}
          <Cylinder position={[-scale * 0.7, scale * 0.3, 0]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.2, scale * 0.2, scale * 0.8]}>
            <meshStandardMaterial color={suitColor} metalness={0.9} roughness={0.1} />
          </Cylinder>
          <Cylinder position={[scale * 0.7, scale * 0.3, 0]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.2, scale * 0.2, scale * 0.8]}>
            <meshStandardMaterial color={suitColor} metalness={0.9} roughness={0.1} />
          </Cylinder>
          {/* Legs */}
          <Cylinder position={[-scale * 0.3, -scale * 0.3, 0]} args={[scale * 0.2, scale * 0.2, scale * 0.8]}>
            <meshStandardMaterial color={suitColor} metalness={0.9} roughness={0.1} />
          </Cylinder>
          <Cylinder position={[scale * 0.3, -scale * 0.3, 0]} args={[scale * 0.2, scale * 0.2, scale * 0.8]}>
            <meshStandardMaterial color={suitColor} metalness={0.9} roughness={0.1} />
          </Cylinder>
        </group>
      );
    }

    // Render robot
    if (type === 'robot' || model === 'robot') {
      return (
        <group position={[x, y, z]} {...commonProps}>
          {/* Head */}
          <Box position={[0, scale * 1.1, 0]} args={[scale * 0.6, scale * 0.6, scale * 0.6]}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </Box>
          {/* Eyes */}
          <Sphere position={[-scale * 0.15, scale * 1.15, scale * 0.32]} args={[scale * 0.08, 16, 16]}>
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
          </Sphere>
          <Sphere position={[scale * 0.15, scale * 1.15, scale * 0.32]} args={[scale * 0.08, 16, 16]}>
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
          </Sphere>
          {/* Body */}
          <Box position={[0, scale * 0.4, 0]} args={[scale * 0.8, scale * 1.0, scale * 0.6]}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </Box>
          {/* Arms */}
          <Cylinder position={[-scale * 0.7, scale * 0.3, 0]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.15, scale * 0.15, scale * 0.7]}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </Cylinder>
          <Cylinder position={[scale * 0.7, scale * 0.3, 0]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.15, scale * 0.15, scale * 0.7]}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </Cylinder>
          {/* Legs */}
          <Cylinder position={[-scale * 0.25, -scale * 0.3, 0]} args={[scale * 0.15, scale * 0.15, scale * 0.7]}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </Cylinder>
          <Cylinder position={[scale * 0.25, -scale * 0.3, 0]} args={[scale * 0.15, scale * 0.15, scale * 0.7]}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </Cylinder>
        </group>
      );
    }

    // Render airplane
    if (type === 'airplane' || model === 'airplane') {
      return (
        <group position={[x, y, z]} {...commonProps}>
          {/* Fuselage */}
          <Cylinder position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[scale * 0.2, scale * 0.2, scale * 2]}>
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </Cylinder>
          {/* Wings */}
          <Box position={[0, 0, 0]} args={[scale * 2.5, scale * 0.1, scale * 0.5]}>
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </Box>
          {/* Tail */}
          <Box position={[0, scale * 0.3, -scale * 0.8]} args={[scale * 0.3, scale * 0.8, scale * 0.1]}>
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </Box>
          {/* Nose */}
          <Cone position={[0, 0, scale * 1.1]} args={[scale * 0.2, scale * 0.4, 16]}>
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </Cone>
        </group>
      );
    }

    // Basic shapes
    switch (type) {
      case 'cube':
        return (
          <Box {...commonProps} position={[x, y, z]} args={[scale, scale, scale]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Box>
        );
      case 'sphere':
        return (
          <Sphere {...commonProps} position={[x, y, z]} args={[scale, 32, 32]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Sphere>
        );
      case 'cylinder':
        return (
          <Cylinder {...commonProps} position={[x, y, z]} args={[scale, scale, scale * 2, 32]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Cylinder>
        );
      case 'cone':
        return (
          <Cone {...commonProps} position={[x, y, z]} args={[scale, scale * 2, 32]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Cone>
        );
      default:
        // For custom or unknown types, render a composite shape
        return (
          <Box {...commonProps} position={[x, y, z]} args={[scale, scale, scale]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Box>
        );
    }
  };

  return (
    <group>
      {objects.map((obj, index) => renderObject(obj, index))}
      
      {/* Default platform */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

export default SceneObjects;

