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
        // Add IDs to objects if they don't have them
        const sceneDataWithIds = {
          ...data.sceneData,
          objects: (data.sceneData?.objects || []).map((obj, index) => ({
            ...obj,
            id: obj.id || `object_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
          }))
        };
        setSceneData(sceneDataWithIds);
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
        // Handle both old format (data.objects) and new format (data.sceneData)
        if (data.sceneData) {
          const sceneDataWithIds = {
            ...data.sceneData,
            objects: (data.sceneData.objects || []).map((obj, index) => ({
              ...obj,
              id: obj.id || `object_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
            }))
          };
          setSceneData(sceneDataWithIds);
        } else if (data.objects) {
          const objectsWithIds = data.objects.map((obj, index) => ({
            ...obj,
            id: obj.id || `object_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
          }));
          setSceneData(prev => ({
            ...prev,
            objects: [...prev.objects, ...objectsWithIds]
          }));
        }
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

  const handleModelUpload = async (file) => {
    setLoading(true);
    try {
      // Create an object URL for the GLB file to load it directly in the browser
      const objectUrl = URL.createObjectURL(file);
      
      // Create a new object in the scene with the uploaded model
      // Start with a smaller default scale (0.2) so large models fit better
      const newObject = {
        type: 'custom',
        model: 'uploaded_model',
        position: [0, 1, 0],
        color: '#ffffff',
        scale: 0.2,
        modelPath: objectUrl, // Use object URL for direct loading
        source: 'file_upload',
        fileName: file.name,
        id: `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Unique ID for each model
      };

      // Add the object to the scene
      setSceneData(prev => ({
        ...prev,
        objects: [...prev.objects, newObject]
      }));

      console.log('3D model uploaded:', file.name);
    } catch (error) {
      console.error('Error loading 3D model:', error);
      alert(`Error loading 3D model: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleObjectScaleChange = (objectId, newScale) => {
    if (!objectId) return;
    setSceneData(prev => ({
      ...prev,
      objects: prev.objects.map(obj => 
        obj.id === objectId ? { ...obj, scale: newScale } : obj
      )
    }));
  };

  const handleObjectPositionChange = (objectId, axis, value) => {
    if (!objectId) return;
    setSceneData(prev => ({
      ...prev,
      objects: prev.objects.map(obj => {
        if (obj.id === objectId) {
          const newPosition = [...(obj.position || [0, 0, 0])];
          newPosition[axis] = value;
          return { ...obj, position: newPosition };
        }
        return obj;
      })
    }));
  };

  const handleRemoveObject = (objectId) => {
    if (!objectId) return;
    setSceneData(prev => ({
      ...prev,
      objects: prev.objects.filter(obj => obj.id !== objectId)
    }));
  };

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Scene3D sceneData={sceneData} loading={loading} />
        <InputPanel 
          onTextSubmit={handleTextInput}
          onImageUpload={handleImageUpload}
          onModelUpload={handleModelUpload}
          sceneData={sceneData}
          onObjectScaleChange={handleObjectScaleChange}
          onObjectPositionChange={handleObjectPositionChange}
          onRemoveObject={handleRemoveObject}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default App;

