// src/utils/soundManager.ts
import { Howl } from 'howler';

const sounds = {
  submit: new Howl({ src: ['/sounds/submit.mp3'] }),
  newGame: new Howl({ src: ['/sounds/new-game.mp3'] }),
};

export const playSound = (soundName: keyof typeof sounds) => {
  sounds[soundName].play();
};