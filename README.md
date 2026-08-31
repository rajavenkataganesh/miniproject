# EndpointGuard — Web URL Endpoint Security Analyzer

**EndpointGuard** is a learning-focused cybersecurity mini-project designed to crawl website endpoints, analyze security headers, classify path sensitivities, visualize directory trees, and generate AI-driven security reports.

---

## 🎯 Learning Objectives

This project teaches core full-stack and cybersecurity concepts:
- **React & Tailwind CSS**: Modern interactive dark cybersecurity UI design.
- **Python & FastAPI**: Lightweight REST API backend and asynchronous HTTP handling.
- **Web Crawling**: Safe HTML link extraction with `httpx` and `BeautifulSoup`.
- **Defensive Cybersecurity Analysis**: Endpoint classification, HTTP security headers, and risk severity scoring.
- **Local AI Integration**: Seamless local Gemma 4 model detection with graceful Demo AI fallbacks.

---

## 🏗️ Architecture

```
                    USER
                      |
                      v
              React Frontend (Port 5173)
                      |
                      v
            FastAPI Backend (Port 8000)
                      |
          +-----------+-----------+
          |                       |
          v                       v
     Web Crawler             Security Analyzer
   (httpx/bs4)              (Headers/Paths)
          |                       |
          +-----------+-----------+
                      |
                      v
              Scan Results
                      |
                      v
           AI Abstraction Layer
            (ai.py / Gemma 4)
                      |
                      v
        Human-Readable Report & Chatbot
```

---

## 🚀 Quick Start (Windows)

Simply double-click **`launch.bat`**.

On **First Run**:
1. Checks for Python 3.9+ and Node.js.
2. Creates a Python virtual environment (`venv/`).
3. Installs backend dependencies (`requirements.txt`).
4. Installs frontend packages (`npm install`).
5. Starts backend & frontend servers and opens `http://localhost:5173` in your browser.

On **Subsequent Runs**:
- Instantly launches the servers without reinstalling packages.

---

## 🛠️ Manual Launch Commands

### 1. Start Backend (Python / FastAPI)
```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run server
cd backend
uvicorn main:app --port 8000 --reload
```

### 2. Start Frontend (React / Vite)
```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🤖 Gemma 4 Integration Workflow

1. **Out of the Box (Offline Demo Mode)**:
   - EndpointGuard runs completely offline in **Demo AI Mode**.
   - Generates structured security summaries and answers chatbot questions using realistic pre-configured templates.
   - Prominently displays: `"Gemma is currently offline (Demo Mode)"`.

2. **Connecting Gemma 4**:
   - Manually copy your compatible Gemma model file (`.gguf` or `.bin`) into `assets/models/`.
   - Restart or refresh the application.
   - EndpointGuard automatically detects the model via `GET /api/ai/status` and switches to **Gemma AI Online**.

---

## ⚠️ Ethical & Defensive Testing Policy

EndpointGuard is strictly built for defensive and educational security testing:
- **Same-Domain Restriction**: The crawler will never traverse outside the target domain.
- **Safe Crawl Limits**: Maximum crawl depth of 2 and page limit of 35.
- **Passive Operations**: Employs non-destructive `GET`/`HEAD` requests only.
- **No Exploits**: Excludes brute-force, injection payloads, or credential testing.

> **Warning**: Only scan websites that you own or have explicit authorization to test.
