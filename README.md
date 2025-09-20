# Calculator Desktop App

A full-stack calculator application built with Electron, featuring a Next.js frontend with shadcn/ui components and a FastAPI backend with SQLite database for calculation history.

## 📁 Project Structure

```
electron-example-app/
├── main.js                    # Electron main process (CommonJS)
├── preload.js                 # Electron preload script
├── package.json              # Electron app configuration
├── .gitignore               # Git ignore rules
├── README.md                # This file
├── start-dev.sh             # Development startup script
├── build-production.sh      # Production build script
├── backend/                 # FastAPI Python backend
│   ├── main.py             # FastAPI app entry point
│   ├── routes.py           # API endpoint definitions
│   ├── models.py           # Pydantic request/response models
│   ├── database.py         # SQLAlchemy database setup
│   ├── pyproject.toml      # Python dependencies (Poetry)
│   ├── poetry.lock         # Lock file for dependencies
│   ├── myvenv/             # Development virtual environment
│   ├── prod-venv/          # Production virtual environment (created during build)
│   └── calculator.db       # SQLite database (created at runtime)
└── frontend/               # Next.js frontend
    ├── src/
    │   ├── app/
    │   │   ├── calculator/
    │   │   │   └── page.tsx   # Calculator UI page
    │   │   ├── globals.css    # Global styles
    │   │   └── layout.tsx     # Root layout
    │   └── components/ui/     # shadcn/ui components
    ├── package.json          # Frontend dependencies
    ├── next.config.ts        # Next.js configuration
    └── .next/              # Next.js build output
        └── standalone/     # Standalone production build
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.10 or higher)
- **Poetry** (for Python dependency management)

### 1. Clone and Install

```bash
# Navigate to project directory
cd electron-example-app

# Install Electron dependencies (also installs frontend deps via postinstall)
npm install
```

### 2. Run the Desktop App

#### Option A: Using the development script (recommended)
```bash
# Launch in development mode
./start-dev.sh
```

#### Option B: Using npm directly
```bash
# Launch in development mode
npm run dev
```

Both methods will:
- Start the FastAPI backend server (port 8000)
- Start the Next.js development server (port 3000)
- Launch the Electron desktop app
- Open developer tools automatically

## 🛠️ Development Setup

### Running Components Individually

For debugging and development, you can run each component separately:

#### Backend Only (FastAPI)

```bash
cd backend

# Activate virtual environment
source myvenv/bin/activate

# Start FastAPI server
python main.py

# Server will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

#### Frontend Only (Next.js)

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# App will be available at http://localhost:3000
```

#### Electron Only (with external services)

```bash
# Make sure backend and frontend are running separately first
# Then launch Electron pointing to localhost:3000
npm run start
```

## 🐛 Debugging Guide

### Backend Debugging

1. **API Testing**: Use the built-in FastAPI docs at `http://localhost:8000/docs`
2. **Database Inspection**:
   ```bash
   cd backend
   sqlite3 calculator.db
   .tables
   SELECT * FROM calculations;
   ```
3. **Python Debugging**: Add breakpoints in your IDE or use:
   ```python
   import pdb; pdb.set_trace()
   ```

### Frontend Debugging

1. **Browser DevTools**: The Electron app opens with DevTools in development mode
2. **Next.js DevTools**: Available at `http://localhost:3000` when running standalone
3. **React DevTools**: Install the browser extension for component inspection
4. **Network Tab**: Monitor API calls between frontend and backend

### Electron Debugging

1. **Main Process**: Add `console.log()` statements in `main.js`
2. **Renderer Process**: Use the DevTools console (automatically opens in dev mode)
3. **Process Management**: Check if both backend and frontend processes are running:
   ```bash
   ps aux | grep python  # Check backend
   ps aux | grep node    # Check frontend
   ```

### Common Issues & Solutions

#### Port Conflicts
```bash
# Check what's using port 3000 or 8000
lsof -i :3000
lsof -i :8000

# Kill processes if needed
kill -9 <PID>
```

#### Python Environment Issues
```bash
cd backend

# Recreate virtual environment if needed
rm -rf myvenv
python -m venv myvenv
source myvenv/bin/activate
poetry install
```

#### Frontend Build Issues
```bash
cd frontend

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📊 Features

### Calculator Functionality
- ✅ Basic arithmetic operations (add, subtract, multiply, divide)
- ✅ Input validation (numbers only)
- ✅ Error handling (division by zero)
- ✅ Real-time API integration

### Data Management
- ✅ SQLite database storage
- ✅ Calculation history with timestamps
- ✅ Unique ID for each calculation
- ✅ JSON export functionality

### UI/UX
- ✅ Modern UI with shadcn/ui components
- ✅ Responsive design
- ✅ Loading states
- ✅ Error feedback

## 🏗️ Build & Distribution

### Production Build & Distribution

#### Option A: Complete automated build (recommended)
```bash
# Complete build and package process
./build-production.sh
```

This script will:
- Install all dependencies
- Build the Next.js frontend with standalone output
- Setup production Python virtual environment
- Package the application for your platform (.exe, .AppImage, .dmg)
- Output final packages to the `dist/` directory

#### Option B: Manual build workflow
```bash
# 1. Build both frontend and backend
npm run build

# 2. Package the Electron app
npm run package
```

### Platform-Specific Packaging
```bash
# Package for specific platforms
npm run package:win     # Windows (.exe)
npm run package:mac     # macOS (.dmg)
npm run package:linux   # Linux (.AppImage)
```

### Build Configuration

The app is configured to build for:
- **Windows**: NSIS installer (.exe)
- **macOS**: DMG package (.dmg)
- **Linux**: AppImage (.AppImage)

All packaged applications will be created in the `dist/` directory.

## 🔧 Configuration

### Backend Configuration
- **Database**: SQLite file at `backend/calculator.db`
- **CORS**: Configured for `http://localhost:3000`
- **Virtual Environment**: `backend/myvenv/`

### Frontend Configuration
- **Base URL**: `http://localhost:3000`
- **API Endpoint**: `http://localhost:8000`
- **Build Output**: `.next/` directory

### Electron Configuration
- **Main Process**: `main.js` (CommonJS)
- **Renderer Process**: Next.js app (ES Modules)
- **Security**: Context isolation enabled, node integration disabled

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/`      | Health check |
| POST   | `/add`   | Addition operation |
| POST   | `/subtract` | Subtraction operation |
| POST   | `/multiply` | Multiplication operation |
| POST   | `/divide` | Division operation |
| GET    | `/export` | Download calculation history as JSON |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test all components individually and together
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details# eleectron-sample-app
