from flask import Flask, request, jsonify  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # pyright: ignore[reportMissingModuleSource]
import spacy  # pyright: ignore[reportMissingImports]
import re
from typing import Dict, List, Any

app = Flask(__name__)
CORS(app)

# Load spaCy model for NLP
nlp = None
try:
    nlp = spacy.load("en_core_web_sm")
    print("spaCy model loaded successfully!")
except OSError:
    print("Warning: spaCy model 'en_core_web_sm' not found.")
    print("The app will work without NLP features. Model should be downloaded during build.")
except Exception as e:
    print(f"Error loading spaCy model: {e}")
    print("The app will work without NLP features.")

# Simple rule-based text-to-3D scene generator
class SceneGenerator:
    def __init__(self):
        self.shape_keywords = {
            'cube': ['cube', 'box', 'square'],
            'sphere': ['sphere', 'ball', 'orb', 'globe'],
            'cylinder': ['cylinder', 'tube', 'pipe'],
            'cone': ['cone', 'pyramid']
        }
        
        self.color_map = {
            'red': '#ff0000',
            'blue': '#0000ff',
            'green': '#00ff00',
            'yellow': '#ffff00',
            'orange': '#ff8800',
            'purple': '#8800ff',
            'pink': '#ff00ff',
            'white': '#ffffff',
            'black': '#000000',
            'cyan': '#00ffff',
            'magenta': '#ff00ff'
        }
        
        self.size_keywords = {
            'small': 0.5,
            'tiny': 0.3,
            'large': 2.0,
            'big': 2.0,
            'huge': 3.0,
            'medium': 1.0
        }

    def extract_objects(self, text: str) -> List[Dict[str, Any]]:
        """Extract objects from natural language text"""
        text = text.lower()
        objects = []
        
        # Parse with spaCy if available
        if nlp:
            doc = nlp(text)
            entities = [(ent.text, ent.label_) for ent in doc.ents]
        
        # Find shapes
        for shape_type, keywords in self.shape_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    obj = {
                        'type': shape_type,
                        'position': [0, 1, 0],
                        'color': '#00ffff',
                        'scale': 1.0
                    }
                    
                    # Extract color
                    for color_name, color_hex in self.color_map.items():
                        if color_name in text:
                            obj['color'] = color_hex
                            break
                    
                    # Extract size
                    for size_word, scale in self.size_keywords.items():
                        if size_word in text:
                            obj['scale'] = scale
                            break
                    
                    # Try to extract position hints
                    obj['position'] = self._extract_position(text, len(objects))
                    
                    objects.append(obj)
                    break
        
        # If no objects found, create a default cube
        if not objects:
            objects.append({
                'type': 'cube',
                'position': [0, 1, 0],
                'color': '#00ffff',
                'scale': 1.0
            })
        
        return objects

    def _extract_position(self, text: str, index: int) -> List[float]:
        """Extract position hints from text"""
        # Simple position inference
        x, y, z = 0, 1, 0
        
        if 'left' in text:
            x = -2 * (index + 1)
        elif 'right' in text:
            x = 2 * (index + 1)
        
        if 'next to' in text or 'beside' in text:
            x = 2 * index
            z = 0
        elif 'behind' in text:
            z = -2 * (index + 1)
        elif 'front' in text:
            z = 2 * (index + 1)
        
        if 'above' in text or 'top' in text:
            y = 3
        elif 'ground' in text or 'floor' in text:
            y = 0.5
        
        return [x, y, z]

    def generate_scene(self, text: str) -> Dict[str, Any]:
        """Generate complete scene from text"""
        objects = self.extract_objects(text)
        
        # Determine lighting based on keywords
        lighting = {'type': 'ambient', 'intensity': 1}
        if 'dark' in text.lower():
            lighting['intensity'] = 0.5
        elif 'bright' in text.lower() or 'sunny' in text.lower():
            lighting['intensity'] = 1.5
        
        # Determine environment
        environment = 'default'
        if 'forest' in text.lower():
            environment = 'forest'
        elif 'sunset' in text.lower() or 'evening' in text.lower():
            environment = 'sunset'
        elif 'night' in text.lower():
            environment = 'night'
        
        return {
            'sceneData': {
                'objects': objects,
                'lighting': lighting,
                'environment': environment
            }
        }


# Initialize scene generator
scene_generator = SceneGenerator()


@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'message': 'Jarvis AI Backend API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'process_text': '/api/process-text (POST)',
            'process_image': '/api/process-image (POST)'
        },
        'status': 'online'
    })


@app.route('/api/process-text', methods=['POST'])
def process_text():
    """Process natural language text to generate 3D scene"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = scene_generator.generate_scene(text)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/process-image', methods=['POST'])
def process_image():
    """Process uploaded image (placeholder for future implementation)"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image = request.files['image']
        
        # Placeholder: For now, return a simple object
        # In production, this would use computer vision models
        result = {
            'objects': [{
                'type': 'sphere',
                'position': [2, 1, 0],
                'color': '#ff00ff',
                'scale': 1.0,
                'source': 'image_upload'
            }]
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'nlp_available': nlp is not None
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

