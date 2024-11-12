import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import WordChart from './WordChart';
import { playSound } from '../utils/soundManager';

const GameBoard: React.FC = () => {
  const [letters, setLetters] = useState<string[]>([]);
  const [validWords, setValidWords] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>(''); // State for messages
  const [gameOver, setGameOver] = useState<boolean>(false); // Track if the game is over
  const [timeUp, setTimeUp] = useState<boolean>(false); // Track if the time is up

  // Function to start a new game
  const startNewGame = () => {
    setLoading(true);
    playSound('newGame');

    const newLetters = generateRandomLetters();
    setLetters(newLetters);
    setValidWords([]);
    setScore(0);
    setTimer(60);
    setGameActive(true);
    setGameOver(false); // Reset gameOver state
    setTimeUp(false);   // Reset timeUp state
    setMessage('');     // Clear any previous messages
    setLoading(false);

    startTimer();
  };

  // Function to generate random letters
  const generateRandomLetters = () => {
    const vowels = 'AEIOU';
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    const selectedLetters: string[] = [];

    const numVowels = Math.floor(Math.random() * 2) + 3; // 3 to 4 vowels
    for (let i = 0; i < numVowels; i++) {
      selectedLetters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }
    while (selectedLetters.length < 9) {
      selectedLetters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }
    return selectedLetters.sort(() => Math.random() - 0.5); // Shuffle the letters
  };

  // Timer function
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

  // Function to end the game
  const endGame = () => {
    setGameActive(false);
    setGameOver(true);  // Mark the game as over
    setTimeUp(timer === 0);  // Mark time as up if timer reaches 0
    displayMessage(); // Show message based on score
  };

  // Function to display messages based on the score
  const displayMessage = () => {
    if (score < 8) {
      setMessage('Work hard!'); // Message for score less than 4
    } else if (score >= 8 && score < 20) {
      setMessage('Better!'); // Message for score of 5 or 7
    } else if (score >= 20) {
      setMessage('Well done! Genius'); // Message for scores above 7
    }
  };

  // Function to check if a word can be formed from given letters
  const canFormWord = (word: string): boolean => {
    const letterCount: { [key: string]: number } = {};

    // Count the frequency of each letter in the available letters
    letters.forEach(letter => {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    // Check if the word can be formed
    for (let char of word) {
      if (!letterCount[char] || letterCount[char] <= 0) {
        return false; // If the letter is not available or not enough
      }
      letterCount[char]--; // Decrease the count for each character used
    }

    return true; // Word can be formed
  };

  // Function to handle word submission
  const handleWordSubmit = (word: string) => {
    const upperWord = word.toUpperCase();
    if (validWords.includes(upperWord)) return; // Word already submitted
    if (upperWord.length < 3) {
      setMessage('Word must be at least 3 letters long.'); // Message for short words
      return;
    }
    if (canFormWord(upperWord)) {
      setValidWords((prev) => [...prev, upperWord]);
      setScore((prev) => prev + upperWord.length); // Increment score based on word length
      setMessage(''); // Clear any previous message
      playSound('submit');
    } else {
      setMessage('Invalid word!'); // Message for invalid words
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Words Countdown</h1>
      {loading && <LoadingSpinner />}
      <div className="flex justify-between mb-4">
      <button
  onClick={startNewGame}
  className="px-6 py-2 bg-green-500 text-white rounded-3xl font-semibold shadow-md mx-2 mt-6 hover:bg-green-600 active:bg-green-700 transform transition duration-200 hover:scale-105 active:scale-95"
>
  {/* Conditional Button Text */}
  {gameOver || timeUp ? "Restart" : "Start"}
</button>
<div className="text-xl font-semibold">{timer} seconds</div>
      </div>

      {/* Displaying Time's Up message when time is up */}
      {timer === 0 && (
        <div className="text-red-600 font-bold text-center text-2xl mb-4">Time's up!</div>
      )}

      {gameActive && !loading && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {letters.map((letter, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-12 text-3xl font-bold border border-gray-300 rounded-md"
            >
              {letter}
            </div>
          ))}
        </div>
      )}
      <input
        type="text"
        className="border border-gray-300 p-2 rounded-md w-full mb-4"
        placeholder="Enter a word..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            handleWordSubmit(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />

      {/* Display Score */}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Your Score: {score}</h2>
        <WordChart words={validWords} />
      </div>

      {/* Message display */}
      {message && (
        <div className={`mt-4 font-bold text-xl text-center animate-bounce ${score < 4 ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </div>
      )}

      {/* Game Rules Section */}

    </div>
  );
};

export default GameBoard;
