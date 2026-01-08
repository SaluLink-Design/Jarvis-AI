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
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      console.log('Backend URL:', backendUrl);
      console.log('Full API URL:', `${backendUrl}/api/process-text`);

      const response = await fetch(`${backendUrl}/api/process-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Scene data received:', data);
        setSceneData(data.sceneData);
      } else {
        console.error('Response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error processing text:', error);
      alert(`Error connecting to backend: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      console.log('Uploading image to:', `${backendUrl}/api/process-image`);

      const response = await fetch(`${backendUrl}/api/process-image`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image processing result:', data);
        setSceneData(prev => ({
          ...prev,
          objects: [...prev.objects, ...data.objects]
        }));
      } else {
        console.error('Response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert(`Error connecting to backend: ${error.message}`);
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

