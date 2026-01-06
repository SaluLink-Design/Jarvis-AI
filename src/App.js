import React, { useState } from 'react';
import './App.css';
import Scene3D from './components/Scene3D';
import InputPanel from './components/InputPanel';
import Header from './components/Header';

const App = () => {
  const [sceneData, setSceneData] = useState({
    objects: [],
    lighting: { type: 'ambient', intensity: 1 },
    environment: 'default'
  });
  const [loading, setLoading] = useState(false);

  const handleTextInput = async (text) => {
    setLoading(true);
    try {
      // Call backend API to process text
      const response = await fetch('/api/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSceneData(data.sceneData);
      }
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setSceneData(prev => ({
          ...prev,
          objects: [...prev.objects, ...data.objects]
        }));
      }
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Scene3D sceneData={sceneData} loading={loading} />
        <InputPanel 
          onTextSubmit={handleTextInput}
          onImageUpload={handleImageUpload}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default App;

