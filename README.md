# BRUTE - XRPL Seed Recovery Tool

A powerful tool for recovering XRPL wallet seeds when you have partial information. This tool supports both family seeds and mnemonic recovery.

![Brute](https://github.com/user-attachments/assets/9fd07e1e-4b6e-4bf2-95be-83801e5fcb93)


## Purpose

BRUTE is designed to help recover XRPL wallet seeds in scenarios where you:
- Remember most of your seed but are missing a few characters
- Know the wallet address you're trying to recover
- Know which positions in the seed are missing

The tool provides a modern web interface for seed recovery with real-time progress tracking and detailed status updates.

## Key Features

- Support for both family seeds and mnemonic recovery
- Real-time progress tracking with ETA
- Multi-core CPU utilization for maximum performance
- Modern, user-friendly web interface
- Support for missing characters in any position
- Detailed progress statistics and status updates

## Technical Details

### Family Seeds

- Complete XRPL family seed is 31 characters long (starts with 's')
- Uses Base58 alphabet (58 possible characters)
- Practical for recovery when missing 4-6 characters
- Performance: ~250,000 attempts/second (on modern hardware)

#### Search Space Examples:
```
Missing Characters | Combinations  | Time (250K/sec)
------------------|---------------|----------------
2 characters      | 3,364        | ~13.5 seconds
3 characters      | 195,112      | ~13 minutes
4 characters      | 11,316,496   | ~12.6 hours
5 characters      | 656,356,768  | ~30.4 days
```

### Mnemonic Seeds

- 12 or 24 word seeds
- 2048 possible words per position
- Significantly more complex than family seeds
- Limited practical recovery (1-2 missing words maximum)

#### Search Space Comparison (vs Family Seeds):
```
Missing Positions | Family Seed    | Mnemonic        | Difference
-----------------|---------------|-----------------|------------
1 position       | 58           | 2,048          | 35.3x
2 positions      | 3,364        | 4,194,304      | 1,246.8x
3 positions      | 195,112      | 8.59B          | 44,025.5x
4 positions      | 11.3M        | 17.59T         | 1.55M x
```

## Project Structure

```
brute/
├── frontend/           # Frontend React application
│   ├── src/           # Frontend source code
│   ├── public/        # Public assets
│   └── ...           # Frontend configuration files
├── brute/             # Backend Python package
│   ├── api/          # Flask API server
│   ├── core/         # Core recovery logic
│   └── utils/        # Utility functions
├── tests/             # Test files
├── dev.sh            # Development script
├── setup.py          # Python package configuration
├── requirements.txt   # Python dependencies
└── ...              # Configuration files
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/poor-d3v/brute.git
cd brute
```

2. Copy environment files:
```bash
cp .env.example .env
cp .env.frontend.example frontend/.env
```

3. Run the development script:
```bash
chmod +x dev.sh
./dev.sh
```

The script will automatically:
- Create a Python virtual environment
- Install Python dependencies
- Install frontend dependencies
- Start both backend and frontend servers

4. Open your browser to http://localhost:5173

## Usage

1. Select seed type (family seed or mnemonic)
2. Enter known characters
3. Mark missing positions
4. Enter target wallet address
5. Click "Start Recovery"

## Development

### Prerequisites
- Python 3.8 or higher
- Node.js and npm
- Git

### Running Tests
```bash
source venv/bin/activate
pytest
```

### Code Formatting
```bash
source venv/bin/activate
black .
mypy .
```

## Contributing

1. **Fork the Repository**
   - Create your feature branch (`git checkout -b feature/AmazingFeature`)
   - Commit your changes (`git commit -m 'Add some AmazingFeature'`)
   - Push to the branch (`git push origin feature/AmazingFeature`)
   - Open a Pull Request

2. **Areas for Improvement**
   - Performance optimizations
   - UI/UX enhancements
   - Additional seed types support
   - Better error handling
   - Testing and documentation

## Security Considerations

- This tool is for recovery of your own wallet seeds
- Never share your seed with others
- Always verify the tool's source code
- Run on a secure, isolated system
- Use at your own risk

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- GitHub Issues: [Project Issues](https://github.com/poor-d3v/brute/issues)
- X: [@poor_xrpl](https://X.com/poor_xrpl)

## Disclaimer

This tool is provided as-is without any warranty. Always verify recovered seeds before use. The authors are not responsible for any loss of funds or other damages that may occur from using this tool.
