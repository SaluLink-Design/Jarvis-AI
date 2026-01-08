# GLB/GLTF Upload Feature

## Overview

Jarvis now supports uploading **any GLB or GLTF 3D model file** directly from the interface! You can upload your own 3D models and they will be rendered in the scene.

## How to Use

### Step 1: Open the 3D Model Upload Tab

1. Click on the **"3D Model Upload"** tab in the input panel
2. Click the **"Upload 3D Model (GLB/GLTF)"** button
3. Select a GLB or GLTF file from your computer

### Step 2: Model is Added to Scene

The uploaded model will automatically:
- Be loaded and rendered in the 3D scene
- Appear at position [0, 1, 0] (center, slightly elevated)
- Be scaled to 1.0 (you can adjust this in the code if needed)

## Supported Formats

- **GLB** (recommended) - Binary GLTF format, single file
- **GLTF** - JSON-based format, may require separate texture files

## How It Works

### Client-Side Loading (Current Implementation)

The system uses **object URLs** to load GLB files directly in the browser:

1. When you upload a file, it creates a temporary object URL
2. The model is loaded using `useGLTF` from `@react-three/drei`
3. The model is rendered immediately in the scene
4. No backend storage required - works instantly!

### Backend Storage (Optional)

A backend endpoint `/api/process-model` is also available for server-side storage:

- Uploads are saved to `/public/uploads/`
- Files are given unique names to avoid conflicts
- Models persist across sessions
- Accessible via `/uploads/<filename>` URL

## Technical Details

### Frontend Changes

- **InputPanel.js**: Added "3D Model Upload" tab with file input
- **App.js**: Added `handleModelUpload` function that creates object URLs
- **SceneObjects.js**: Already supports loading models via `modelPath` property

### Backend Changes

- **app.py**: Added `/api/process-model` endpoint for optional server-side storage
- Created `/public/uploads/` directory for storing uploaded models
- Added file serving route `/uploads/<filename>`

## Example Usage

```javascript
// When a GLB file is uploaded:
const objectUrl = URL.createObjectURL(file);
// Creates: blob:http://localhost:3000/abc123...

// Model is added to scene:
{
  type: 'custom',
  model: 'uploaded_model',
  position: [0, 1, 0],
  color: '#ffffff',
  scale: 1.0,
  modelPath: objectUrl,  // Loads directly from browser
  source: 'file_upload',
  fileName: 'iron_man_mark1.glb'
}
```

## Advantages

1. **No Server Required**: Works with client-side object URLs
2. **Instant Loading**: Models appear immediately after upload
3. **Any Model**: Upload any GLB/GLTF file, not just predefined ones
4. **Flexible**: Can use either client-side or server-side storage

## Limitations

- Object URLs are temporary (cleared when page refreshes)
- For persistence, use the backend endpoint
- Large files (>50MB) may cause performance issues
- GLTF files with external textures need all files uploaded

## Future Enhancements

- Drag and drop file upload
- Multiple model upload at once
- Model preview before adding to scene
- Adjustable position, scale, and rotation controls
- Model library/collection management

## Troubleshooting

### Model Not Loading?

1. **Check file format**: Must be `.glb` or `.gltf`
2. **Check file size**: Very large files may take time to load
3. **Check browser console**: Look for loading errors
4. **Check file integrity**: Corrupted GLB files won't load

### Model Appears Too Large/Small?

- Adjust the `scale` property in the object data
- Default scale is 1.0
- You can modify this in `App.js` `handleModelUpload` function

### Model Not Visible?

- Check the position - default is [0, 1, 0]
- Try adjusting camera position in Scene3D.js
- Check if model is outside the camera view

## Code Locations

- **Upload UI**: `src/components/InputPanel.js`
- **Upload Handler**: `src/App.js` → `handleModelUpload`
- **Model Renderer**: `src/components/SceneObjects.js` → `ModelLoader`
- **Backend Endpoint**: `backend/app.py` → `/api/process-model`

