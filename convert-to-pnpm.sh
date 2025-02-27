#!/bin/bash

# Script to convert from npm to pnpm

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Remove node_modules and package-lock.json
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with pnpm
echo "Installing dependencies with pnpm..."
pnpm install

echo "Conversion to pnpm completed successfully!"
echo "You can now use 'pnpm dev' to start the development server." 