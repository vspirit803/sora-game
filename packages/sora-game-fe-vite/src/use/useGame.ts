import { Game } from 'sora-game-core';

export function useGame(): Game {
  return Game.getInstence();
}
