#!/bin/bash

# Function to cleanup background processes on exit
cleanup() {
    echo "Cleaning up..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -e .

# Install development dependencies
echo "Installing development dependencies..."
pip install pytest black mypy types-flask types-flask-cors

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Start backend server
echo "Starting backend server..."
export PYTHONPATH="${PYTHONPATH:+${PYTHONPATH}:}$(pwd)"
python3 -m brute &

# Start frontend development server
echo "Starting frontend development server..."
cd frontend
npm run dev &

# Wait for Ctrl+C
echo "Development servers are running. Press Ctrl+C to stop."
wait 