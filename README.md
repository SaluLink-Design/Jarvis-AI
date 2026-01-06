# Jarvis 3D AI

A "Jarvis-like" AI system for generating and simulating interactive 3D environments through natural language, image uploads, and video analysis.

## Overview

This application implements the research findings from `Jarvis.ipynb`, providing:

- **Natural Language Interaction**: Describe scenes in plain English
- **Multimodal Input**: Text, images, and video (coming soon)
- **3D Content Generation**: AI-powered scene and object creation
- **Interactive Simulation**: Real-time 3D visualization with physics

## Features

### Current (Phase 1 - MVP)

- ✅ Natural language text-to-3D scene generation
- ✅ Interactive 3D viewer with Three.js
- ✅ Real-time scene manipulation
- ✅ Multiple shape types (cube, sphere, cylinder, cone)
- ✅ Color and size extraction from text
- ✅ Basic spatial positioning
- ✅ Image upload interface (placeholder)

### Coming Soon

- 🚧 Advanced NLP with context management
- 🚧 Image-to-3D reconstruction
- 🚧 YouTube video analysis
- 🚧 Physics-based simulation
- 🚧 Advanced procedural generation
- 🚧 Style transfer and material extraction

## Architecture

Based on the research in `Jarvis.ipynb`, the system follows a modular architecture:

```
┌─────────────────┐
│   User Interface│
│  (React + Three.js)│
└────────┬────────┘
         │
┌────────▼────────┐
│ Multimodal Input│
│   Processor     │
│  (NLP/CV/Video) │
└────────┬────────┘
         │
┌────────▼────────┐
│ Core Orchestration│
│  AI Reasoning   │
│     Engine      │
└────────┬────────┘
         │
┌────────▼────────┐
│ 3D Generation & │
│   Simulation    │
└─────────────────┘
```

## Installation

### Prerequisites

- Node.js 18+
- Python 3.9+
- npm or yarn

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Start backend server
python app.py
```

The backend API will run on `http://localhost:5000`

## Usage

### Text-to-3D Generation

Simply describe what you want to create:

- **"Create a red cube"** - Generates a red cube
- **"Add a blue sphere next to a green cylinder"** - Generates multiple objects
- **"Create a large yellow cone"** - Generates objects with size and color
- **"Make a small purple box on the left"** - Includes positioning

### Image Upload

Upload images to extract:

- 3D object information
- Textures and materials
- Style references
- Color palettes

*(Currently placeholder - full implementation coming soon)*

### 3D Scene Interaction

- **Orbit**: Click and drag to rotate camera
- **Zoom**: Scroll to zoom in/out
- **Pan**: Right-click and drag to pan

## Project Structure

```
jarvis-3d-ai/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Application header
│   │   ├── Scene3D.js         # 3D canvas and rendering
│   │   ├── SceneObjects.js    # 3D object primitives
│   │   └── InputPanel.js      # User input interface
│   ├── App.js                 # Main application
│   ├── App.css
│   └── index.js
├── backend/
│   ├── app.py                 # Flask API server
│   └── requirements.txt       # Python dependencies
├── Jarvis.ipynb              # Research documentation
├── package.json
└── README.md
```

## API Endpoints

### POST `/api/process-text`

Process natural language text and generate scene data.

**Request:**

```json
{
  "text": "Create a red cube"
}
```

**Response:**

```json
{
  "sceneData": {
    "objects": [{
      "type": "cube",
      "position": [0, 1, 0],
      "color": "#ff0000",
      "scale": 1.0
    }],
    "lighting": {
      "type": "ambient",
      "intensity": 1
    },
    "environment": "default"
  }
}
```

### POST `/api/process-image`

Process uploaded images (placeholder).

### GET `/api/health`

Health check endpoint.

## Technology Stack

### Frontend

- **React 18** - UI framework
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers

### Backend

- **Flask** - Python web framework
- **spaCy** - Natural language processing
- **Pillow** - Image processing
- **NumPy** - Numerical computing

## Research Foundation

This application is built on the comprehensive research documented in `Jarvis.ipynb`, which covers:

1. **Natural Language Interaction** - NLU techniques for command execution and conversational AI
2. **Multimodal Input** - Processing text, images, and video for 3D generation
3. **3D Content Generation** - State-of-the-art Text-to-3D and Image-to-3D models
4. **Interactive Simulation** - Physics engines and real-time rendering frameworks
5. **System Architecture** - Modular design with AI orchestration

See `Jarvis.ipynb` for detailed technical analysis and implementation roadmap.

## Development Roadmap

### Phase 1 (Current - MVP)

- ✅ Basic text-to-3D generation
- ✅ Interactive 3D viewer
- ✅ Simple NLP processing

### Phase 2 (Q2 2024)

- 🎯 Advanced NLP with context management
- 🎯 Improved object positioning and relationships
- 🎯 Basic physics simulation
- 🎯 Material and lighting controls

### Phase 3 (Q3 2024)

- 🎯 Image-to-3D reconstruction
- 🎯 Style transfer implementation
- 🎯 Procedural generation
- 🎯 Multi-object scene composition

### Phase 4 (Q4 2024)

- 🎯 YouTube video analysis
- 🎯 Motion capture and animation
- 🎯 Advanced physics and behavioral AI
- 🎯 Real-time collaboration

## Contributing

This is a research-based project. Contributions are welcome! Please refer to the research in `Jarvis.ipynb` for technical context.

## License

MIT License

## Acknowledgments

Based on research into:

- Text-to-3D models (DreamFusion, Magic3D)
- Image-to-3D reconstruction (NeRF, Zero123)
- Game engines (Unity, Unreal Engine)
- Physics simulation (Bullet, PhysX)
- Web 3D frameworks (Three.js, Babylon.js)

---

**Note**: This is a Phase 1 MVP implementation. Many advanced features from the research (complex NLP, advanced 3D generation, video analysis) are planned for future releases.
