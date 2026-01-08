# 3D Models Directory

This directory contains 3D model files (GLB/GLTF format) for detailed object rendering.

## Supported Formats

- **GLB** (recommended) - Binary GLTF format, single file with embedded textures
- **GLTF** - JSON-based format, may require separate texture files

## Adding Models

To add a 3D model:

1. Place your `.glb` or `.gltf` file in this directory
2. Update the backend `app.py` to map object types to model paths
3. The model will be automatically loaded when the object type is detected

## Example: Iron Man Mark I

To use a detailed Iron Man Mark I model:

1. Download or create an Iron Man Mark I 3D model in GLB format
2. Save it as `iron_man_mark1.glb` in this directory
3. The system will automatically use it when detecting "iron man mark 1" or "iron man mark i"

## Model Requirements

- **Format**: GLB or GLTF
- **Size**: Keep models under 50MB for web performance
- **Textures**: Embedded in GLB format (recommended)
- **Scale**: Models should be normalized (1 unit = 1 meter recommended)
- **Origin**: Models should be centered at origin (0,0,0)

## Current Models

- `iron_man_mark1.glb` - Iron Man Mark I suit (detailed version)

## Notes

- If a model file doesn't exist, the system will fall back to simple geometric shapes
- Model paths are relative to the `public` directory (e.g., `/models/iron_man_mark1.glb`)
- Models are loaded using `@react-three/drei`'s `useGLTF` hook

