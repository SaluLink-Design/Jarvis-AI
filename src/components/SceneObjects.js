import React from 'react';
import { Box, Sphere, Cylinder, Cone } from '@react-three/drei';

const SceneObjects = ({ objects }) => {
  const renderObject = (obj, index) => {
    const { type, position = [0, 1, 0], color = '#00ffff', scale = 1 } = obj;

    const commonProps = {
      key: index,
      position: position,
      castShadow: true,
      receiveShadow: true
    };

    switch (type) {
      case 'cube':
        return (
          <Box {...commonProps} args={[scale, scale, scale]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Box>
        );
      case 'sphere':
        return (
          <Sphere {...commonProps} args={[scale, 32, 32]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Sphere>
        );
      case 'cylinder':
        return (
          <Cylinder {...commonProps} args={[scale, scale, scale * 2, 32]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Cylinder>
        );
      case 'cone':
        return (
          <Cone {...commonProps} args={[scale, scale * 2, 32]}>
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </Cone>
        );
      default:
        return (
          <Box {...commonProps} args={[scale, scale, scale]}>
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

