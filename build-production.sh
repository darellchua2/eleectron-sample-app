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

# Copy next runtime and static files into standalone
if [ -d ".next/standalone" ]; then
    echo "📂 Copying Next.js runtime into standalone..."

    # Copy static files to standalone
    if [ -d ".next/static" ]; then
        cp -r .next/static .next/standalone/.next/
    fi

    # Copy public folder to standalone
    if [ -d "public" ]; then
        cp -r public .next/standalone/
    fi

    # Install production dependencies in standalone
    echo "📦 Installing standalone production dependencies..."
    cd .next/standalone
    npm install --production --no-optional
    cd ../..

    # Ensure proper permissions on standalone directory
    chmod -R 755 .next/standalone
fi
cd ..

# 3. Setup backend with fresh production virtual environment
echo "🐍 Setting up backend for production..."
cd backend

# Remove old venv
rm -rf prod-venv

# Create fresh venv with Python 3.10
python3.10 -m venv prod-venv
source prod-venv/bin/activate

# Install Poetry and production dependencies
pip install --upgrade pip
pip install poetry
poetry install --only=main --no-root

deactivate
cd ..

# 4. Package the Electron app
echo "📦 Packaging application..."
npm run package

echo "✅ Build complete! Check the 'dist' directory for your packaged app."
