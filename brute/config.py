"""Configuration settings for the BRUTE application."""

import os
from pathlib import Path

# Server Configuration
HOST = os.getenv('BRUTE_HOST', '0.0.0.0')
PORT = int(os.getenv('BRUTE_PORT', '5001'))
DEBUG = os.getenv('BRUTE_DEBUG', 'false').lower() == 'true'

# CORS Configuration
CORS_ORIGINS = os.getenv('BRUTE_CORS_ORIGINS', 'http://localhost:5173').split(',')

# Python Environment
BASE_DIR = Path(__file__).resolve().parent
VENV_DIR = os.getenv('VIRTUAL_ENV', str(BASE_DIR / 'venv'))
PYTHON_PATH = os.getenv('BRUTE_PYTHON_PATH', str(Path(VENV_DIR) / 'bin' / 'python3'))
SITE_PACKAGES = os.getenv('BRUTE_SITE_PACKAGES', str(Path(VENV_DIR) / 'lib' / 'python3.13' / 'site-packages'))

# Performance Configuration
CHUNK_SIZE = int(os.getenv('BRUTE_CHUNK_SIZE', '1000'))
UPDATE_INTERVAL = float(os.getenv('BRUTE_UPDATE_INTERVAL', '1.0')) 