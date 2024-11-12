// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl items-center justify-center bg-white rounded-md p-8 shadow-lg">
        <h1 className="text-2xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-4">
          Words Countdown
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-lg mx-auto leading-relaxed px-4">
          You have <span className="font-semibold text-blue-600">1 minute</span> to find as many words as possible using the given set of randomly generated letters
          <br />
          <br />
          Your goal is to score <span className="font-bold text-purple-600 text-xl">20 points</span>
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold text-lg">Game Rules:</h3>
        <ul className="list-disc pl-5">
          <li>Form words using the letters displayed.</li>
          <li>Each valid word scores points based on its length.</li>
          <li>You have 60 seconds to enter as many words as possible.</li>
          <li>Words must be at least 3 letters long.</li>
        </ul>
        <h3 className="font-semibold text-lg mt-2">Scoring:</h3>
        <p>Your score increases with each valid word entered, calculated as the sum of the lengths of all valid words.</p>
        <p>The graph shows the number of words entered over time, reflecting your progress in the game. click new game to start</p>
      </div>
        <div className="text-center my-8">
          <button
            onClick={() => navigate('/singleplayer')}
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold shadow-md mx-2 mt-6 hover:bg-green-600 transform transition duration-200 hover:scale-105"
          >
            Start Game
          </button>
          <button
            onClick={() => navigate('/multiplayer')}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md mx-2 mt-6 hover:bg-blue-600 transform transition duration-200 hover:scale-105"
          >
            Play with Friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
