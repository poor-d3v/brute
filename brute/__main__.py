"""Main entry point for the BRUTE application."""

import os
from dotenv import load_dotenv
from brute.api.server import app
from brute.config import HOST, PORT, DEBUG

def main():
    """Start the BRUTE application."""
    # Load environment variables from .env file
    load_dotenv()
    
    # Start the Flask server
    app.run(host=HOST, port=PORT, debug=DEBUG)

if __name__ == '__main__':
    main() 