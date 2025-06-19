export interface GameState {
  currentPlayer: "player" | "bot";
  playerPosition: number;
  botPosition: number;
  diceValue: number | null;
  gameStatus: "playing" | "won" | "lost";
  isRolling: boolean;
}

export interface BoardPosition {
  x: number;
  y: number;
}

export const SNAKES: Record<number, number> = {
  21: 3,
  24: 7,
  35: 9,
  50: 11,
  53: 15,
  60: 23,
  75: 44,
  89: 48,
  93: 25,
  97: 65,
  99: 58,
};

export const LADDERS: Record<number, number> = {
  4: 16,
  12: 33,
  18: 22,
  26: 37,
  42: 61,
  49: 51,
  55: 74,
  82: 98,
  85: 95,
  88: 92,
};
