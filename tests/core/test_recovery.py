"""Tests for the recovery module."""

import pytest
from brute.core.recovery import calculate_total_combinations

def test_calculate_total_combinations():
    """Test the calculation of total combinations."""
    # Test with different numbers of missing positions
    assert calculate_total_combinations([0]) == 58  # One missing position
    assert calculate_total_combinations([0, 1]) == 58 * 58  # Two missing positions
    assert calculate_total_combinations([0, 1, 2]) == 58 ** 3  # Three missing positions

def test_calculate_total_combinations_empty():
    """Test calculation with no missing positions."""
    assert calculate_total_combinations([]) == 1  # No missing positions 