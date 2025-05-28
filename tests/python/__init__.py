"""Test configuration and utilities for Python tests."""

import sys
from pathlib import Path

# Add the src/python directory to Python path for testing
src_path = Path(__file__).parent.parent / "src" / "python"
sys.path.insert(0, str(src_path))
