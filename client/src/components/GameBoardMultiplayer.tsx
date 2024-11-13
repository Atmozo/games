import React, { useState, useEffect } from 'react';
import * as Ably from 'ably';

import LoadingSpinner from './LoadingSpinner';
import WordChart from './WordChart';
import Leaderboard from './Leaderboard';
import { playSound } from '../utils/soundManager';

const GameBoardMultiplayer: React.FC = () => {
  const [letters, setLetters] = useState<string[]>([]);
  const [validWords, setValidWords] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeUp, setTimeUp] = useState<boolean>(false);
  const [isMultiplayer, setIsMultiplayer] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [ablyClient, setAblyClient] = useState<any>(null);
  const [gameId, setGameId] = useState<string>('');
  const [connectedPlayers, setConnectedPlayers] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [isHost, setIsHost] = useState<boolean>(false);

  // Helper function to generate a random game ID
  const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2, 10); 
  };

  useEffect(() => {
    const client = new Ably.Realtime({ key: '2X6N3w.lx8Y7A:4tzNkPlSO7d17U8vUHPZJmOJoGX4bPeRa67T9QLwmws' });
    setAblyClient(client);

    return () => client.close();
  }, []);

  useEffect(() => {
    if (!ablyClient || !gameId) return;

    const channel = ablyClient.channels.get(gameId);

    channel.subscribe('playerJoined', (message: { data: { leaderboard: React.SetStateAction<{ name: string; score: number; }[]>; connectedPlayers: React.SetStateAction<number>; }; }) => {
      setLeaderboard(message.data.leaderboard);
      setConnectedPlayers(message.data.connectedPlayers);
    });

    channel.subscribe('gameStart', () => {
      startNewGame();
    });

    channel.subscribe('gameOver', () => {
      endGame();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [ablyClient, gameId]);

  const handleJoinGame = async (name: string, gameId: string) => {
    try {
      if (ablyClient && gameId) {
        setPlayerName(name);
        setGameId(gameId);
        const channel = ablyClient.channels.get(gameId);
        await channel.publish('playerJoined', { name, gameId });
        setIsMultiplayer(true);
      }
    } catch (err) {
      console.error('Error joining game:', err);
    }
  };

  const handleHostGame = async () => {
    try {
      const generatedId = generateRandomId();
      setGameId(generatedId);
      setIsMultiplayer(true);
      setIsHost(true);

      const channel = ablyClient!.channels.get(generatedId);
      await channel.publish('playerJoined', { leaderboard, connectedPlayers: connectedPlayers + 1 });
    } catch (err) {
      console.error('Error hosting game:', err);
    }
  };

  const startNewGame = () => {
    setLoading(true);
    playSound('newGame');

    const newLetters = generateRandomLetters();
    setLetters(newLetters);
    setValidWords([]);
    setScore(0);
    setTimer(60);
    setGameActive(true);
    setGameOver(false);
    setTimeUp(false);
    setMessage('');
    setLoading(false);

    startTimer();
  };

  const generateRandomLetters = (): string[] => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from({ length: 9 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]);
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = async () => {
    setGameActive(false);
    setGameOver(true);
    setTimeUp(timer === 0);
    displayMessage();

    if (ablyClient && gameId) {
      const channel = ablyClient.channels.get(gameId);
      await channel.publish('updateScore', { name: playerName, score });
    }
  };

  const displayMessage = () => {
    if (score < 8) {
      setMessage('Work hard!');
    } else if (score >= 8 && score < 20) {
      setMessage('Better!');
    } else if (score >= 20) {
      setMessage('Well done! Genius');
    }
  };

  const handleWordSubmit = async (word: string) => {
    const upperWord = word.toUpperCase();
    if (validWords.includes(upperWord)) return;
    if (upperWord.length < 3) {
      setMessage('Word must be at least 3 letters long.');
      return;
    }
    setValidWords((prev) => [...prev, upperWord]);
    setScore((prev) => prev + upperWord.length);
    setMessage('');
    playSound('submit');

    updateLeaderboard(playerName, score + upperWord.length);

    if (ablyClient && gameId) {
      const channel = ablyClient.channels.get(gameId);
      await channel.publish('wordSubmitted', { playerName, word: upperWord, newScore: score + upperWord.length });
    }
  };

  const updateLeaderboard = (name: string, newScore: number) => {
    setLeaderboard((prev) => {
      const updatedLeaderboard = prev.map((entry) =>
        entry.name === name ? { ...entry, score: newScore } : entry
      );
      if (!updatedLeaderboard.find((entry) => entry.name === name)) {
        updatedLeaderboard.push({ name, score: newScore });
      }
      return updatedLeaderboard.sort((a, b) => b.score - a.score);
    });
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Words Countdown</h1>
      {loading && <LoadingSpinner />}

      {!isMultiplayer ? (
        <div className="flex justify-center gap-4 mb-4">
          <button onClick={handleHostGame} className="px-4 py-2 bg-blue-500 text-white rounded-md">Host Game</button>
          <input
            type="text"
            placeholder="Enter Game ID"
            className="px-4 py-2 border border-gray-300 rounded-md"
            onChange={(e) => setGameId(e.target.value)}
          />
          <button onClick={() => handleJoinGame(playerName, gameId)} className="px-4 py-2 bg-green-500 text-white rounded-md">Join Game</button>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-xl">Game ID: <b>{gameId}</b></h3>
          <h4>Connected players: {connectedPlayers}</h4>
        </div>
      )}

      <div className="flex justify-between mb-4">
        {isHost && connectedPlayers >= 2 && (
          <button
      
            onClick={() => ablyClient!.channels.get(gameId).publish('gameStart')}
            className="px-6 py-2 bg-green-500 text-white rounded-3xl font-semibold shadow-md mx-2 mt-6 hover:bg-green-600 active:bg-green-700 transform transition duration-200 hover:scale-105 active:scale-95"
          >
            {gameOver || timeUp ? 'Restart' : 'Start'}
          </button>
        )}
        <div className="text-xl font-semibold">{timer} seconds</div>
      </div>

      {gameActive && !loading && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {letters.map((letter, index) => (
            <div key={index} className="flex items-center justify-center h-12 text-3xl font-bold border border-gray-300 rounded-md">
              {letter}
            </div>
          ))}
        </div>
      )}

      {/* <input
        type="text"
        className="border border-gray-300 p-2 rounded-md w-full mb-4"
        placeholder="Enter a word..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            handleWordSubmit(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      /> */}

      <div className="mt-4">
        <h2 className="text-xl font-bold">Your Score: {score}</h2>
        <WordChart words={validWords} />
      </div>

      {message && (
        <div className={`mt-4 font-bold text-xl text-center animate-bounce ${score < 8 ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </div>
      )}

      <Leaderboard leaderboard={leaderboard} />
    </div>
  );
};

export default GameBoardMultiplayer;
