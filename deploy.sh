#!/bin/bash

# Blackjack Multiplayer Deployment Script
echo "🃏 Deploying Blackjack Multiplayer Platform..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Ready for deployment to Netlify!"
    echo ""
    echo "Next steps:"
    echo "1. Connect your GitHub repository to Netlify"
    echo "2. Set build command: npm run build"
    echo "3. Set publish directory: build"
    echo "4. Configure Firebase environment variables in Netlify"
    echo "5. Deploy!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
