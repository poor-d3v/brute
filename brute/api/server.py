from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import subprocess
import threading
import json
import time
import os
from pathlib import Path
from brute.config import PYTHON_PATH, SITE_PACKAGES

app = Flask(__name__)

# Configure CORS to allow requests from the React app
CORS(app)

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

recovery_process = None
recovery_output = []
start_time = None

def format_elapsed_time(elapsed_seconds):
    minutes = int(elapsed_seconds // 60)
    seconds = elapsed_seconds % 60
    if minutes > 0:
        return f"{minutes}m {seconds:.1f}s"
    return f"{seconds:.1f}s"

def create_progress_bar(percent, width=50, is_completed=False):
    """Create a visual progress bar with lock/unlock icons."""
    filled = int(width * percent / 100)
    bar = '█' * filled + '░' * (width - filled)
    icon = '🔓' if is_completed else '🔒'
    return f"[{bar}] {percent:.2f}% {icon}"

def run_recovery(data):
    global recovery_process, start_time
    try:
        # Get the current directory
        current_dir = Path(__file__).resolve().parent.parent.parent
        
        cmd = [
            str(PYTHON_PATH),  # Use configured Python path
            '-m', 'brute.core.recovery',  # Use the module path
            '--partial-seed', data['partial_seed'],
            '--missing-positions', ','.join(map(str, data['missing_positions'])),
            '--seed-type', data['seed_type'],
            '--target-address', data['target_address']
        ]
        
        # Initialize output with ordered messages
        recovery_output.clear()
        start_time = time.time()
        
        total_combinations = 11316496
        recovery_output.extend([
            "In Recovery Process...",
            f"Seed Type: {data['seed_type']}",
            f"Missing Positions: {', '.join(map(str, data['missing_positions']))}",
            f"Total possible combinations: {total_combinations:,}",
            f"Progress: 0.00% | Attempts: 0/{total_combinations:,} | Speed: 0/s | Elapsed: 0.0s | ETA: 0.0s",
            f"Target Address: {data['target_address']}"
        ])
        
        # Use unbuffered output and set up environment
        env = os.environ.copy()
        env["PYTHONUNBUFFERED"] = "1"
        env["PYTHONPATH"] = str(current_dir)
        
        recovery_process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            bufsize=0,
            env=env,
            cwd=str(current_dir)
        )

        found_seed = None
        last_attempt_num = 0  # Keep track of the last attempt number
        
        # Read output in real-time
        while True:
            line = recovery_process.stdout.readline()
            if not line and recovery_process.poll() is not None:
                break
                
            line = line.strip()
            print(f"Debug - received line: {line}")  # Debug output
            
            if line:  # Only process non-empty lines
                if line.startswith("Starting"):
                    continue  # Skip "Starting" message since we already have "In Recovery Process..."
                elif "Progress:" in line:
                    print(f"Debug - updating progress: {line}")  # Debug output
                    recovery_output[4] = line
                elif "Attempt" in line:
                    print(f"Debug - received attempt update: {line}")  # Debug output
                    # Parse attempt number and update progress
                    try:
                        attempt_num = int(line.split()[1].replace(',', ''))
                        last_attempt_num = attempt_num  # Store the attempt number
                        total = total_combinations
                        progress = (attempt_num / total) * 100
                        elapsed = time.time() - start_time
                        speed = attempt_num / elapsed if elapsed > 0 else 0
                        eta = (total - attempt_num) / speed if speed > 0 else 0
                        
                        progress_line = (
                            f"Progress: {progress:.2f}% | "
                            f"Attempts: {attempt_num:,}/{total:,} | "
                            f"Speed: {speed:.2f}/s | "
                            f"Elapsed: {format_elapsed_time(elapsed)} | "
                            f"ETA: {format_elapsed_time(eta)}"
                        )
                        recovery_output[4] = progress_line
                    except (ValueError, IndexError) as e:
                        print(f"Debug - error parsing attempt: {e}")  # Debug output
                        pass
                elif line.startswith("Match found!"):
                    seed = line.split("Seed: ")[1]
                    found_seed = f"Success! Recovered seed: {seed}"
                elif not line.startswith(("Using", "No match found", "Failed to recover")):
                    if not any(msg.startswith(line.split(':')[0]) for msg in recovery_output):
                        recovery_output.append(line)

        # If recovery was successful, update progress to 100% and add the seed
        if found_seed:
            elapsed = time.time() - start_time
            elapsed_str = format_elapsed_time(elapsed)
            recovery_output[4] = f"Progress: 100% | Attempts: {last_attempt_num:,}/11316496 | Elapsed: {elapsed_str}"
            # Only add the success message once
            if not any(msg.startswith("Success!") for msg in recovery_output):
                recovery_output.append(found_seed)
        else:
            # Format failed recovery message
            elapsed = time.time() - start_time
            elapsed_str = format_elapsed_time(elapsed)
            progress = (last_attempt_num / 11316496) * 100
            recovery_output[0] = "Recovery Failed!"
            recovery_output[4] = f"Progress: {progress:.1f}%\nAttempts: {last_attempt_num:,}/11316496\nElapsed: {elapsed_str}"

        # Check for any errors
        errors = recovery_process.stderr.read()
        if errors:
            recovery_output.append(f"Error: {errors}")
            print(f"Error: {errors}")

        recovery_process.wait()
        
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        recovery_output.append(error_msg)
        print(error_msg)

@app.route('/start-recovery', methods=['POST', 'OPTIONS'])
def start_recovery():
    global recovery_process, recovery_output
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = make_response()
        response.status_code = 200
        return response
    
    if recovery_process is not None and recovery_process.poll() is None:
        return jsonify({'error': 'Recovery process already running'}), 400

    try:
        data = request.json
        print(f"Received data: {data}")  # Debug output
        recovery_output.clear()
        
        # Start recovery process in a separate thread
        thread = threading.Thread(target=run_recovery, args=(data,))
        thread.start()
        
        return jsonify({'message': 'Recovery process started'})

    except Exception as e:
        error_msg = f"Error starting recovery: {str(e)}"
        print(error_msg)  # Debug output
        return jsonify({'error': error_msg}), 500

@app.route('/status', methods=['GET'])
def get_status():
    global recovery_process, recovery_output
    
    if recovery_process is None:
        status = 'Not started'
    elif recovery_process.poll() is None:
        status = 'Running'
    else:
        status = 'Completed' if recovery_process.returncode == 0 else 'Failed'
    
    return jsonify({
        'status': status,
        'output': recovery_output
    })

if __name__ == '__main__':
    # Run the Flask app on all network interfaces
    app.run(host='0.0.0.0', port=5001, debug=True) 