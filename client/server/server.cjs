const express = require('express');
const cors = require('cors');
const Ably = require('ably');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Set up Ably API key and client
const ABLY_API_KEY = '2X6N3w.lx8Y7A:4tzNkPlSO7d17U8vUHPZJmOJoGX4bPeRa67T9QLwmws';
const ably = new Ably.Realtime(ABLY_API_KEY);

// Store game data
const games = {};

// Create a new game and generate a game ID
app.post('/create-game', (req, res) => {
  const gameId = generateGameId();
  games[gameId] = {
    players: [],
    host: req.body.playerName,
  };
  res.send({ gameId });
});

// Join an existing game
app.post('/join-game', (req, res) => {
  const { gameId, playerName } = req.body;
  if (!games[gameId]) {
    return res.status(404).send({ message: 'Game not found' });
  }

  games[gameId].players.push(playerName);
  res.send({ message: 'Joined game successfully', gameId });
});

// Generate a unique game ID
const generateGameId = () => Math.random().toString(36).substr(2, 8);

// Ably token request endpoint for secure client connections
app.get('/auth', (req, res) => {
  ably.auth.createTokenRequest({}, (err, tokenRequest) => {
    if (err) {
      res.status(500).send('Error requesting token');
    } else {
      res.send(tokenRequest);
    }
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
