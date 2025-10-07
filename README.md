# Blackjack Multiplayer Platform

A real-time multiplayer Blackjack game built with React, Firebase, and deployed on Netlify.

## Features

- **Multiplayer Support**: Create rooms with unique codes for friends to join
- **6-Deck Shoe**: Automatic shuffling and cutting when shoe ends
- **Multiple Hands**: Players can play up to 3 hands simultaneously
- **Side Bets**: Pair (5:1), Trip (15:1), Perfect Pair (20:1), Straight Flush (50:1)
- **Auto Blackjack Detection**: Automatic checking for dealer blackjack with 10 and A
- **Chip System**: VND currency with betting limits (5,000 - 50,000 per hand)
- **Real-time Updates**: Firebase Realtime Database for instant game state sync

## Game Rules

### Basic Blackjack
- Standard blackjack rules apply
- Dealer must hit on 16, stand on 17
- Players can hit, stand, double down, or split pairs
- Blackjack pays 3:2

### Side Bets
- **Pair**: Two player initial cards with same value (5:1)
- **Trip**: Two player cards + dealer up card same value (15:1)
- **Perfect Pair**: Two player initial cards are exact same (20:1)
- **Straight Flush**: Three cards in sequence & same suit (50:1)

### Betting System
- Initial chips: 100,000 VND per player
- Minimum bet: 5,000 VND
- Maximum bet: 50,000 VND per hand
- Double down: Maximum 100,000 VND per hand
- Chip denominations: 5,000, 10,000, 20,000, 50,000 VND

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Anonymous)
3. Enable Realtime Database
4. Copy your Firebase config and update `src/firebase/config.js`

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm start
```

### 4. Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Deploy!

## Project Structure

```
src/
├── components/
│   ├── Card.js          # Playing card component
│   ├── Chip.js          # Betting chip component
│   ├── GameRoom.js      # Main game room component
│   ├── Lobby.js         # Lobby/room selection
│   └── SideBetPanel.js  # Side betting interface
├── firebase/
│   └── config.js        # Firebase configuration
├── services/
│   └── firebaseService.js # Firebase database operations
├── utils/
│   └── gameLogic.js     # Game logic and utilities
├── App.js               # Main app component
├── App.css              # Global styles
└── index.js             # App entry point
```

## Firebase Database Structure

```
rooms/
  {roomCode}/
    code: string
    dealer: { id, name }
    players: {
      {playerId}: {
        id: string
        name: string
        chips: number
        hands: {
          {handIndex}: {
            bet: number
            cards: array
            status: string
            sideBets: object
          }
        }
        isReady: boolean
      }
    }
    gameState: string
    shoe: array
    currentHand: number
    dealerCards: array
```

## Technologies Used

- **React 18**: Frontend framework
- **Firebase**: Backend services (Auth, Realtime Database)
- **Framer Motion**: Animations
- **React Router**: Navigation
- **CSS3**: Styling with modern features
- **Netlify**: Deployment platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development!
