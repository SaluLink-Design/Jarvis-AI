import React, { useState, useRef } from 'react';
import './InputPanel.css';

const InputPanel = ({ 
  onTextSubmit, 
  onImageUpload, 
  onModelUpload, 
  sceneData,
  onObjectScaleChange,
  onObjectPositionChange,
  onRemoveObject,
  loading 
}) => {
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const fileInputRef = useRef(null);
  const modelInputRef = useRef(null);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim() && !loading) {
      onTextSubmit(textInput);
      setTextInput('');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && !loading) {
      onImageUpload(file);
    }
  };

  const handleModelSelect = (e) => {
    const file = e.target.files[0];
    if (file && !loading) {
      // Validate file type
      const validExtensions = ['.glb', '.gltf'];
      const fileName = file.name.toLowerCase();
      const isValid = validExtensions.some(ext => fileName.endsWith(ext));
      
      if (!isValid) {
        alert('Please upload a GLB or GLTF file');
        return;
      }
      
      onModelUpload(file);
    }
  };

  const examplePrompts = [
    'Create a red cube',
    'Add a blue sphere next to a green cylinder',
    'Generate a forest scene with trees',
    'Create a sunset environment'
  ];

  return (
    <div className="input-panel">
      <div className="panel-tabs">
        <button
          className={`tab ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Text Input
        </button>
        <button
          className={`tab ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          Image Upload
        </button>
        <button
          className={`tab ${activeTab === 'model' ? 'active' : ''}`}
          onClick={() => setActiveTab('model')}
        >
          3D Model Upload
        </button>
        <button
          className={`tab ${activeTab === 'controls' ? 'active' : ''}`}
          onClick={() => setActiveTab('controls')}
        >
          Scene Controls
        </button>
        <button
          className={`tab ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
          disabled
        >
          Video (Coming Soon)
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'text' && (
          <div className="text-input-section">
            <form onSubmit={handleTextSubmit}>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Describe what you want to create... (e.g., 'Create a red cube on a blue sphere')"
                disabled={loading}
                rows={4}
              />
              <button type="submit" disabled={loading || !textInput.trim()}>
                {loading ? 'Generating...' : 'Generate Scene'}
              </button>
            </form>

            <div className="examples">
              <h3>Example prompts:</h3>
              <div className="example-buttons">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setTextInput(prompt)}
                    className="example-button"
                    disabled={loading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="image-input-section">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="upload-button"
            >
              <span className="upload-icon">📸</span>
              {loading ? 'Processing...' : 'Upload Image'}
            </button>
            <p className="hint">
              Upload an image to extract 3D information, textures, or style
            </p>
          </div>
        )}

        {activeTab === 'model' && (
          <div className="model-input-section">
            <input
              type="file"
              ref={modelInputRef}
              onChange={handleModelSelect}
              accept=".glb,.gltf"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => modelInputRef.current?.click()}
              disabled={loading}
              className="upload-button"
            >
              <span className="upload-icon">🎨</span>
              {loading ? 'Loading...' : 'Upload 3D Model (GLB/GLTF)'}
            </button>
            <p className="hint">
              Upload a GLB or GLTF 3D model file to add it to the scene
            </p>
            <p className="hint-small">
              Supported formats: .glb, .gltf
            </p>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="controls-section">
            <h3 className="controls-title">Scene Objects</h3>
            {sceneData.objects && sceneData.objects.length > 0 ? (
              <div className="objects-list">
                {sceneData.objects.map((obj, index) => {
                  // Ensure object has an ID
                  const objectId = obj.id || `temp_${index}`;
                  return (
                  <div key={objectId} className="object-control-card">
                    <div className="object-header">
                      <h4 className="object-name">
                        {obj.fileName || obj.model || obj.type || `Object ${index + 1}`}
                      </h4>
                      <button
                        className="remove-button"
                        onClick={() => onRemoveObject(objectId)}
                        title="Remove object"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="control-group">
                      <label className="control-label">
                        Scale: {obj.scale?.toFixed(2) || '1.00'}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={obj.scale || 1}
                        onChange={(e) => onObjectScaleChange(objectId, parseFloat(e.target.value))}
                        className="control-slider"
                      />
                      <div className="slider-values">
                        <span>0.1</span>
                        <span>5.0</span>
                      </div>
                    </div>

                    <div className="position-controls">
                      <label className="control-label">Position</label>
                      <div className="position-inputs">
                        <div className="position-input-group">
                          <label>X</label>
                          <input
                            type="number"
                            value={obj.position?.[0]?.toFixed(2) || '0'}
                            onChange={(e) => onObjectPositionChange(objectId, 0, parseFloat(e.target.value) || 0)}
                            className="position-input"
                            step="0.1"
                          />
                        </div>
                        <div className="position-input-group">
                          <label>Y</label>
                          <input
                            type="number"
                            value={obj.position?.[1]?.toFixed(2) || '0'}
                            onChange={(e) => onObjectPositionChange(objectId, 1, parseFloat(e.target.value) || 0)}
                            className="position-input"
                            step="0.1"
                          />
                        </div>
                        <div className="position-input-group">
                          <label>Z</label>
                          <input
                            type="number"
                            value={obj.position?.[2]?.toFixed(2) || '0'}
                            onChange={(e) => onObjectPositionChange(objectId, 2, parseFloat(e.target.value) || 0)}
                            className="position-input"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p className="empty-message">No objects in scene</p>
                <p className="empty-hint">Upload a 3D model or generate objects using text input</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'video' && (
          <div className="video-input-section">
            <p className="coming-soon">Video analysis feature coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPanel;

