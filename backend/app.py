from flask import Flask, request, jsonify  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # pyright: ignore[reportMissingModuleSource]
import spacy  # pyright: ignore[reportMissingImports]
import re
import os
import base64
import io
from typing import Dict, List, Any
from openai import OpenAI  # pyright: ignore[reportMissingImports]
from dotenv import load_dotenv  # pyright: ignore[reportMissingImports]
from PIL import Image  # pyright: ignore[reportMissingImports]

# Load environment variables
load_dotenv()

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
            'cone': ['cone', 'pyramid'],
            'car': ['car', 'vehicle', 'automobile', 'truck'],
            'suit': ['iron man', 'ironman', 'suit', 'armor'],
            'robot': ['robot', 'android', 'bot'],
            'airplane': ['airplane', 'plane', 'aircraft', 'jet']
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
                    default_scale = 2.0 if shape_type in ['car', 'airplane'] else 1.5 if shape_type in ['suit', 'robot'] else 1.0
                    default_color = '#ff0000' if shape_type in ['car', 'suit'] else '#888888' if shape_type == 'robot' else '#ffffff' if shape_type == 'airplane' else '#00ffff'

                    obj = {
                        'type': shape_type,
                        'model': shape_type,
                        'position': [0, 1, 0],
                        'color': default_color,
                        'scale': default_scale
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

# Initialize OpenAI client
openai_client = None
openai_api_key = os.getenv('OPENAI_API_KEY')
if openai_api_key:
    openai_client = OpenAI(api_key=openai_api_key)
    print("OpenAI client initialized successfully!")
else:
    print("Warning: OPENAI_API_KEY not found in environment variables.")
    print("Image analysis will use fallback method.")


class ImageAnalyzer:
    """Analyze images and generate 3D models based on content"""
    
    def __init__(self):
        # Map detected objects to 3D model types
        self.object_to_model_map = {
            'car': {'type': 'car', 'model': 'car', 'scale': 2.0, 'color': '#ff0000'},
            'vehicle': {'type': 'car', 'model': 'car', 'scale': 2.0, 'color': '#ff0000'},
            'automobile': {'type': 'car', 'model': 'car', 'scale': 2.0, 'color': '#ff0000'},
            'iron man': {'type': 'suit', 'model': 'iron_man', 'scale': 1.5, 'color': '#ff0000'},
            'ironman': {'type': 'suit', 'model': 'iron_man', 'scale': 1.5, 'color': '#ff0000'},
            'suit': {'type': 'suit', 'model': 'suit', 'scale': 1.5, 'color': '#ff0000'},
            'robot': {'type': 'robot', 'model': 'robot', 'scale': 1.5, 'color': '#888888'},
            'person': {'type': 'human', 'model': 'human', 'scale': 1.0, 'color': '#ffdbac'},
            'human': {'type': 'human', 'model': 'human', 'scale': 1.0, 'color': '#ffdbac'},
            'building': {'type': 'building', 'model': 'building', 'scale': 3.0, 'color': '#cccccc'},
            'house': {'type': 'building', 'model': 'building', 'scale': 2.5, 'color': '#cccccc'},
            'tree': {'type': 'tree', 'model': 'tree', 'scale': 2.0, 'color': '#00ff00'},
            'airplane': {'type': 'airplane', 'model': 'airplane', 'scale': 2.5, 'color': '#ffffff'},
            'plane': {'type': 'airplane', 'model': 'airplane', 'scale': 2.5, 'color': '#ffffff'},
            'aircraft': {'type': 'airplane', 'model': 'airplane', 'scale': 2.5, 'color': '#ffffff'},
        }
    
    def analyze_image_with_openai(self, image_file) -> str:
        """Analyze image using OpenAI Vision API"""
        if not openai_client:
            return None
        
        try:
            # Read and encode image
            image_bytes = image_file.read()
            image_file.seek(0)  # Reset file pointer
            
            # Convert to base64
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            
            # Call OpenAI Vision API
            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Analyze this image and describe the main object or subject in detail. Focus on what 3D model should be generated. If you see a car, say 'car'. If you see Iron Man or a suit, say 'iron man'. Be specific about the main subject. Respond with just the main object name in lowercase."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=100
            )
            
            description = response.choices[0].message.content.strip().lower()
            return description
        
        except Exception as e:
            print(f"Error analyzing image with OpenAI: {e}")
            return None
    
    def extract_object_from_description(self, description: str) -> Dict[str, Any]:
        """Extract object type from description and map to 3D model"""
        if not description:
            return None
        
        description_lower = description.lower()
        
        # Check for matches in object map
        for key, model_info in self.object_to_model_map.items():
            if key in description_lower:
                return model_info
        
        # Default fallback
        return {
            'type': 'custom',
            'model': 'custom',
            'scale': 1.0,
            'color': '#00ffff',
            'description': description
        }
    
    def generate_3d_model_from_image(self, image_file) -> Dict[str, Any]:
        """Generate 3D model data from uploaded image"""
        # Analyze image
        description = self.analyze_image_with_openai(image_file)
        
        if description:
            print(f"Detected object: {description}")
            model_info = self.extract_object_from_description(description)
        else:
            # Fallback: try to extract info from filename or use default
            filename = image_file.filename.lower() if hasattr(image_file, 'filename') else ''
            model_info = self.extract_object_from_description(filename)
            if not model_info or model_info['type'] == 'custom':
                # Default to a generic 3D model
                model_info = {
                    'type': 'custom',
                    'model': 'custom',
                    'scale': 1.0,
                    'color': '#00ffff',
                    'description': 'uploaded_image'
                }
        
        # Generate 3D object data
        obj = {
            'type': model_info.get('type', 'custom'),
            'model': model_info.get('model', 'custom'),
            'position': [0, 1, 0],
            'color': model_info.get('color', '#00ffff'),
            'scale': model_info.get('scale', 1.0),
            'source': 'image_upload',
            'description': model_info.get('description', description or 'uploaded_image')
        }
        
        return obj


# Initialize image analyzer
image_analyzer = ImageAnalyzer()


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
    """Process uploaded image and generate 3D model based on content"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image = request.files['image']
        
        if image.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Analyze image and generate 3D model
        obj = image_analyzer.generate_3d_model_from_image(image)
        
        # Return scene data in the same format as text processing
        result = {
            'sceneData': {
                'objects': [obj],
                'lighting': {'type': 'ambient', 'intensity': 1},
                'environment': 'default'
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error processing image: {e}")
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

