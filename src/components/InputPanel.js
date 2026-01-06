import React, { useState, useRef } from 'react';
import './InputPanel.css';

const InputPanel = ({ onTextSubmit, onImageUpload, loading }) => {
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const fileInputRef = useRef(null);

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

