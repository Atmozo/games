// src/pages/SinglePlayer.tsx
import React from 'react';
import GameBoard from '../components/GameBoard';

const SinglePlayer: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Single Player Mode</h2>
        <GameBoard />
      </div>
    </div>
  );
};

export default SinglePlayer;
