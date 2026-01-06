# 🚀 Quick Start - Get Running in 5 Minutes

## Prerequisites Check

```bash
node --version  # Should be v18+
python3 --version  # Should be v3.9+
```

## Installation (One-time Setup)

### 1. Install Frontend Dependencies (Terminal 1)

```bash
npm install
```

### 2. Install Backend Dependencies (Terminal 2)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

## Running the App

### Start Both Servers

**Terminal 1 - Frontend:**

```bash
npm start
```

**Terminal 2 - Backend:**

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

## Access the App

Open your browser to: **<http://localhost:3000>**

## Try It Out

Type these commands in the text input:

1. `Create a red cube`
2. `Add a blue sphere next to a green cylinder`
3. `Make a large yellow cone on the right`
4. `Create a small purple box on the left`

## Controls

- **Orbit**: Left-click + drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click + drag

---

That's it! 🎉 You're running Jarvis 3D AI!

For detailed setup help, see **SETUP.md**
For full documentation, see **README.md**
For research background, see **Jarvis.ipynb**
