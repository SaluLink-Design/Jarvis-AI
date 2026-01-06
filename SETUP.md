# Jarvis 3D AI - Setup Guide

## Quick Start Guide

This guide will help you get the Jarvis 3D AI application running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify: `node --version`

- **Python** (v3.9 or higher)
  - Download from: https://python.org/
  - Verify: `python --version` or `python3 --version`

- **npm** (comes with Node.js)
  - Verify: `npm --version`

- **pip** (comes with Python)
  - Verify: `pip --version` or `pip3 --version`

## Step-by-Step Installation

### 1. Frontend Setup (React)

Open a terminal and navigate to the project root directory:

```bash
# Install all Node.js dependencies
npm install

# This will install:
# - React and React DOM
# - Three.js and React Three Fiber
# - Axios for API calls
# - All other dependencies
```

### 2. Backend Setup (Python/Flask)

Open a **new terminal** window/tab and navigate to the backend directory:

```bash
cd backend
```

#### Create Virtual Environment

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt indicating the virtual environment is active.

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- Flask-CORS (for cross-origin requests)
- spaCy (NLP library)
- Pillow (image processing)
- NumPy (numerical computing)

#### Download spaCy Language Model

```bash
python -m spacy download en_core_web_sm
```

This downloads the English language model for natural language processing.

## Running the Application

You need to run both the frontend and backend servers simultaneously.

### Terminal 1: Start Frontend Server

From the project root directory:

```bash
npm start
```

- The React app will start at `http://localhost:3000`
- Your browser should open automatically
- If not, manually navigate to the URL

### Terminal 2: Start Backend Server

From the backend directory (with virtual environment activated):

```bash
python app.py
```

- The Flask API will start at `http://localhost:5000`
- You should see output like:
  ```
  * Running on http://0.0.0.0:5000
  * Debug mode: on
  ```

## Verification

### Check Backend is Running

Open a browser or use curl:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "online",
  "nlp_available": true
}
```

### Check Frontend Connection

1. Open `http://localhost:3000` in your browser
2. You should see the Jarvis 3D AI interface
3. Try a test prompt: "Create a red cube"
4. A red cube should appear in the 3D viewer

## Troubleshooting

### Port Already in Use

**Frontend (3000):**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use a different port
PORT=3001 npm start
```

**Backend (5000):**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Change port in backend/app.py:
app.run(debug=True, host='0.0.0.0', port=5001)
```

### spaCy Model Not Found

```bash
# Ensure virtual environment is activated
python -m spacy download en_core_web_sm

# If still failing, try:
pip install --upgrade spacy
python -m spacy download en_core_web_sm
```

### Module Import Errors

```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### CORS Errors

If you see CORS errors in the browser console:

1. Ensure Flask-CORS is installed: `pip install flask-cors`
2. Check that the backend is running on port 5000
3. Verify `proxy` setting in `package.json`

### React Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Development Tips

### Hot Reload

Both servers support hot reload:
- **Frontend**: Changes to React files will auto-reload the browser
- **Backend**: Flask debug mode will auto-restart on code changes

### Viewing Logs

- **Frontend**: Check browser console (F12 → Console)
- **Backend**: Check terminal running Flask app

### Testing API Directly

Use curl or Postman to test backend endpoints:

```bash
# Test text processing
curl -X POST http://localhost:5000/api/process-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Create a blue sphere"}'
```

## Next Steps

Once everything is running:

1. Try different text prompts in the input panel
2. Experiment with colors, sizes, and shapes
3. Navigate the 3D scene (click + drag to orbit, scroll to zoom)
4. Check the example prompts for inspiration

## Production Build

To create a production build:

```bash
# Build frontend
npm run build

# Serve with a production server like nginx or serve
npx serve -s build
```

For production backend deployment, use gunicorn or similar WSGI server:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Support

For issues or questions:
- Check `Jarvis.ipynb` for technical research and architecture
- Review `README.md` for feature documentation
- Check GitHub issues (if applicable)

---

**Success!** 🎉 You should now have Jarvis 3D AI running locally!

