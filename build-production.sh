#!/bin/bash

# Production build script for Calculator Electron App

set -e  # exit on first error

echo "🚀 Building Calculator App for production..."

# 1. Install all JS dependencies
echo "📦 Installing JS dependencies..."
npm install

# 2. Build frontend (Next.js)
echo "🌐 Building frontend..."
cd frontend
npm install
npm run build

# Copy next runtime into standalone
if [ -d ".next/standalone" ]; then
    echo "📂 Copying Next.js runtime into standalone..."
    mkdir -p .next/standalone/node_modules
    cp -r node_modules/next .next/standalone/node_modules/
fi
cd ..

# 3. Setup backend with fresh production virtual environment
echo "🐍 Setting up backend for production..."
cd backend

# Remove old venv
rm -rf prod-venv

# Create fresh venv
python3 -m venv prod-venv
source prod-venv/bin/activate

# Install production dependencies (export from Poetry)
pip install --upgrade pip
poetry export -f requirements.txt --without-hashes --only=main | pip install -r /dev/stdin

deactivate
cd ..

# 4. Package the Electron app
echo "📦 Packaging application..."
npm run package

echo "✅ Build complete! Check the 'dist' directory for your packaged app."
