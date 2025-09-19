#!/bin/bash

# Development startup script for Calculator Electron App

echo "Starting Calculator App in development mode..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Activate backend virtual environment and install dependencies
echo "Setting up backend environment..."
cd backend
source myvenv/bin/activate
poetry install
cd ..

# Start the Electron app in development mode
echo "Starting Electron app..."
npm run dev