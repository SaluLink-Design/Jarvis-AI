import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Sky } from '@react-three/drei';
import './Scene3D.css';
import SceneObjects from './SceneObjects';

const Scene3D = ({ sceneData, loading }) => {
  return (
    <div className="scene-container">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        className="canvas"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00ffff" />

          {/* Environment */}
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />
          
          {/* Grid for reference */}
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#00ffff"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#0080ff"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
          />

          {/* Scene Objects */}
          <SceneObjects objects={sceneData.objects} />

          {/* Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            minDistance={2}
            maxDistance={50}
          />
        </Suspense>
      </Canvas>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Generating 3D scene...</p>
        </div>
      )}
    </div>
  );
};

export default Scene3D;

