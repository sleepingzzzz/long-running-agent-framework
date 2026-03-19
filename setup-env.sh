#!/bin/bash
# Long Running Agent Framework - Environment Setup (Linux/macOS)

echo "Setting up environment variables..."

# Get script directory
LRAF_WORKSPACE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export LRAF_WORKSPACE

echo "LRAF_WORKSPACE=$LRAF_WORKSPACE"

# Add to shell profile
echo ""
echo "To permanently add to your shell, run:"
echo "  echo 'export LRAF_WORKSPACE=\"$LRAF_WORKSPACE\"' >> ~/.bashrc"
echo "  source ~/.bashrc"
echo ""

echo "Environment setup complete!"
