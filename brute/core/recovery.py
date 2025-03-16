"""
Script for brute-forcing XRPL wallet seeds by testing
combinations against a target address.
"""

import itertools
import time
import multiprocessing as mp
import argparse
from typing import List, Tuple
from xrpl.wallet import Wallet

# Configuration
BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
CHUNK_SIZE = 1000  # Number of combinations to process per chunk
UPDATE_INTERVAL = 1  # Seconds between progress updates
DEBUG_MODE = False  # Disable verbose seed testing output

def calculate_total_combinations(missing_positions: List[int]) -> int:
    """Calculate total possible combinations based on number of missing positions."""
    return 58 ** len(missing_positions)

def format_time(seconds: float) -> str:
    """Format time in seconds to a human-readable string."""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        minutes = seconds / 60
        return f"{minutes:.1f}m"
    else:
        hours = seconds / 3600
        return f"{hours:.1f}h"

def process_chunk(args: Tuple[str, str, List[str], List[int]]) -> str | None:
    """Process a chunk of possible combinations."""
    partial_seed, target_address, combinations, missing_positions = args

    for combo in combinations:
        # Start with a clean slate for each attempt
        test_seed = list(partial_seed)
        
        # Insert our test characters at the missing positions
        for pos, char in zip(missing_positions, combo):
            test_seed[pos] = char
        
        full_seed = "".join(test_seed)
        
        try:
            wallet = Wallet.from_seed(full_seed)
            if wallet.classic_address == target_address:
                return full_seed
        except Exception:
            continue

    return None

def brute_force_parallel(partial_seed: str, target_address: str, missing_positions: List[int]) -> str | None:
    """Attempt to brute-force the missing characters using parallel processing."""
    total_combinations = calculate_total_combinations(missing_positions)
    print(f"Starting recovery process...")
    print(f"Total possible combinations: {total_combinations:,}")
    print(f"Using {mp.cpu_count()} CPU cores")
    
    start_time = time.time()
    last_update = start_time
    last_line_length = 0
    attempts = 0

    with mp.Pool() as pool:
        # Generate combinations in batches
        batch_size = CHUNK_SIZE * 1000  # Process larger batches for efficiency
        current_batch = []
        
        for combo in itertools.product(BASE58_ALPHABET, repeat=len(missing_positions)):
            current_batch.append(combo)
            
            if len(current_batch) >= batch_size:
                # Process current batch
                chunk_args = [(partial_seed, target_address, current_batch[i:i+CHUNK_SIZE], missing_positions) 
                            for i in range(0, len(current_batch), CHUNK_SIZE)]
                
                for result in pool.imap_unordered(process_chunk, chunk_args):
                    attempts += CHUNK_SIZE
                    current_time = time.time()

                    if current_time - last_update >= UPDATE_INTERVAL:
                        elapsed_time = current_time - start_time
                        progress = (attempts / total_combinations) * 100
                        attempts_per_second = attempts / elapsed_time if elapsed_time > 0 else 0
                        
                        # Calculate estimated time remaining
                        remaining_combinations = total_combinations - attempts
                        if attempts_per_second > 0:
                            estimated_seconds = remaining_combinations / attempts_per_second
                            eta = format_time(estimated_seconds)
                        else:
                            eta = "calculating..."

                        # Create the progress message
                        progress_msg = (
                            f"Progress: {progress:.2f}% | "
                            f"Attempts: {attempts:,}/{total_combinations:,} | "
                            f"Speed: {attempts_per_second:.2f}/s | "
                            f"Elapsed: {format_time(elapsed_time)} | "
                            f"ETA: {eta}"
                        )
                        
                        print(progress_msg)
                        last_update = current_time

                    if result is not None:
                        print(f"\nMatch found! Seed: {result}")
                        return result
                
                # Clear batch for next iteration
                current_batch = []

        # Process any remaining combinations
        if current_batch:
            chunk_args = [(partial_seed, target_address, current_batch[i:i+CHUNK_SIZE], missing_positions) 
                         for i in range(0, len(current_batch), CHUNK_SIZE)]
            
            for result in pool.imap_unordered(process_chunk, chunk_args):
                if result is not None:
                    print(f"\nMatch found! Seed: {result}")
                    return result

    print("\nNo match found.")
    return None

def main():
    parser = argparse.ArgumentParser(description='XRPL Seed Recovery Tool')
    parser.add_argument('--partial-seed', required=True, help='Partial seed with known characters')
    parser.add_argument('--missing-positions', required=True, help='Comma-separated list of missing positions (0-based)')
    parser.add_argument('--target-address', required=True, help='Target XRPL address to match against')
    parser.add_argument('--seed-type', required=True, choices=['secp256k1_seed', 'ed25519_seed', 'mnemonic'],
                      help='Type of seed to recover')

    args = parser.parse_args()
    
    # Convert missing positions from string to list of integers
    missing_positions = [int(pos) for pos in args.missing_positions.split(',')]
    
    # Start the recovery process
    result = brute_force_parallel(args.partial_seed, args.target_address, missing_positions)
    
    if result:
        print(f"\nSuccess! Recovered seed: {result}")
        return 0
    else:
        print("\nFailed to recover seed")
        return 1

if __name__ == '__main__':
    exit(main())
