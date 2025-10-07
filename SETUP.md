# Blackjack Multiplayer Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Netlify account (for deployment)

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: "blackjack-multiplayer"
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Anonymous" authentication
5. Click "Save"

### 1.3 Enable Realtime Database
1. In Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### 1.4 Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select Web (</>) icon
4. Register app with nickname "blackjack-web"
5. Copy the Firebase configuration object

### 1.5 Update Environment Variables
1. Copy `env.example` to `.env`
2. Fill in your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-actual-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
REACT_APP_FIREBASE_APP_ID=your-actual-app-id
```

## Step 2: Local Development

### 2.1 Install Dependencies
```bash
npm install
```

### 2.2 Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### 2.3 Test the Application
1. Open the app in your browser
2. Enter your name and create a room
3. Open another browser tab/window
4. Join the room with the room code
5. Test the game functionality

## Step 3: Netlify Deployment

### 3.1 Prepare for Deployment
1. Make sure your code is pushed to GitHub
2. Run the build command to test:
```bash
npm run build
```

### 3.2 Deploy to Netlify

#### Option A: Netlify CLI
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod --dir=build
```

#### Option B: Netlify Dashboard
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Add environment variables in Site settings > Environment variables
6. Deploy!

### 3.3 Configure Environment Variables in Netlify
1. Go to your site dashboard
2. Go to Site settings > Environment variables
3. Add all the Firebase environment variables from your `.env` file
4. Redeploy the site

## Step 4: Firebase Security Rules (Production)

### 4.1 Update Database Rules
In Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": "auth != null || newData.child('dealer').exists()"
      }
    }
  }
}
```

### 4.2 Authentication Rules
Make sure Anonymous authentication is enabled for production use.

## Step 5: Testing the Deployed App

1. Visit your Netlify URL
2. Create a room as dealer
3. Share the room code with friends
4. Test multiplayer functionality
5. Verify all game features work correctly

## Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Check environment variables are set correctly
   - Verify Firebase project is active
   - Check database rules allow read/write

2. **Build failures**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript/JavaScript errors
   - Verify all imports are correct

3. **Deployment issues**
   - Ensure build command is `npm run build`
   - Check publish directory is `build`
   - Verify environment variables are set in Netlify

4. **Game not working**
   - Check browser console for errors
   - Verify Firebase Realtime Database is enabled
   - Test with multiple browser tabs/windows

### Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Test locally first before deploying
4. Check Netlify build logs for deployment issues

## Features Implemented

✅ **Multiplayer Support**: Room creation and joining
✅ **6-Deck Shoe**: Automatic shuffling and cutting
✅ **Multiple Hands**: Up to 3 hands per player
✅ **Side Bets**: Pair, Trip, Perfect Pair, Straight Flush
✅ **Auto Blackjack Detection**: For dealer 10 and A
✅ **Chip System**: VND currency with betting limits
✅ **Real-time Updates**: Firebase Realtime Database
✅ **Modern UI**: Responsive design with animations
✅ **Deployment Ready**: Netlify configuration included

## Game Rules Summary

- **Basic Blackjack**: Standard rules with 3:2 blackjack payout
- **Side Bets**: Various odds from 5:1 to 50:1
- **Betting**: 5,000 - 50,000 VND per hand
- **Multiple Hands**: Players can play up to 3 hands
- **Auto Features**: Dealer blackjack detection and shoe management

Enjoy your multiplayer Blackjack platform! 🃏
