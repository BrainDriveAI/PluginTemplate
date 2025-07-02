#!/bin/bash

# TEMPLATE: Plugin Template Build Script
# TODO: Customize this script for your plugin's specific build requirements

echo "🧩 Building Plugin Template..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js to build the plugin."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm to build the plugin."
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the plugin directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
npm run clean

# Build the plugin
echo "🔨 Building plugin..."
npm run build

# Check if build was successful
if [ -f "dist/remoteEntry.js" ]; then
    echo "✅ Plugin Template built successfully!"
    echo "📦 Bundle location: dist/remoteEntry.js"
    echo "📊 Bundle size: $(du -h dist/remoteEntry.js | cut -f1)"
    echo ""
    echo "🎉 Plugin Template is ready for installation!"
    echo ""
    echo "Next steps:"
    echo "1. Test your plugin by running: npm start"
    echo "2. Install via BrainDrive Plugin Manager"
    echo "3. Or use the lifecycle manager: python3 lifecycle_manager.py install"
else
    echo "❌ Build failed! Bundle file not found."
    echo "Please check the errors above and try again."
    exit 1
fi

echo "Build completed!"