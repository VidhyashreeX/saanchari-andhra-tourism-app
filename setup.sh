#!/bin/bash

# Saanchari Setup Script
# This script helps you set up the Saanchari tourism chatbot locally

echo "🗺️  Setting up Saanchari - Tourism Assistant for Andhra Pradesh"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd src/client && npm install && cd ../..

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file..."
    cp .env.example .env
    
    echo ""
    echo "⚠️  IMPORTANT: Please add your Google Gemini API key to the .env file"
    echo "   1. Go to https://makersuite.google.com/app/apikey"
    echo "   2. Sign in with your Google account"
    echo "   3. Click 'Create API Key'"
    echo "   4. Copy the API key and paste it in the .env file"
    echo ""
    echo "   Edit the .env file and replace 'your_gemini_api_key_here' with your actual API key"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo "🚀 Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev           # Start both client and server"
echo "  npm run dev:client    # Start client only"
echo "  npm run dev:server    # Start server only"
echo ""
echo "The application will be available at: http://localhost:5000"
echo ""
echo "If you need help, check the README.md file or the troubleshooting section."