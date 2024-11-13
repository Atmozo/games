// src/pages/Multiplayer.tsx
import React, {  useState } from 'react';

import GameBoardMultiplayer from '../components/GameBoardMultiplayer';

interface Player {
  id: string;
  name: string;
  score: number;
}

const Multiplayer: React.FC = () => {
  const [players] = useState<Player[]>([
    { id: '1', name: 'Player 1', score: 0 },
    { id: '2', name: 'Player 2', score: 0 },
  ]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-purple-600">Multiplayer Mode</h2>
        <div className="flex flex-col items-center mb-4">
          {players.map((player) => (
            <div key={player.id} className="flex justify-between w-full max-w-md p-4 mb-2 bg-gray-200 rounded-md">
              <span className="font-semibold">{player.name}</span>
              <span className="text-blue-600 font-semibold">Score: {player.score}</span>
            </div>
          ))}
        </div>
        <GameBoardMultiplayer />
      </div>
    </div>
  );
};

export default Multiplayer;
