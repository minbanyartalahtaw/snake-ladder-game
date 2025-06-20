import { SNAKES, LADDERS } from "@/types/game";

export const rollDice = (): number => {
  return Math.floor(Math.random() * 6) + 1;
};

export const calculateNewPosition = (
  currentPosition: number,
  diceValue: number
): number => {
  let newPosition = currentPosition + diceValue;

  // Don't go beyond 100
  if (newPosition > 100) {
    return currentPosition;
  }

  // Check for snakes
  if (SNAKES[newPosition]) {
    newPosition = SNAKES[newPosition];
  }

  // Check for ladders
  if (LADDERS[newPosition]) {
    newPosition = LADDERS[newPosition];
  }

  return newPosition;
};

export const getBoardPosition = (
  position: number
): { x: number; y: number } => {
  if (position === 0) return { x: 0, y: 9 };

  const row = Math.floor((position - 1) / 10);
  const col = (position - 1) % 10;

  // Snake and ladder boards alternate direction each row
  const isEvenRow = row % 2 === 0;
  const actualCol = isEvenRow ? col : 9 - col;

  return {
    x: actualCol,
    y: 9 - row,
  };
};

export const getPositionFromCoords = (x: number, y: number): number => {
  const row = 9 - y;
  const isEvenRow = row % 2 === 0;
  const col = isEvenRow ? x : 9 - x;

  return row * 10 + col + 1;
};

export const animatePlayerMovement = async (
  currentPosition: number,
  diceValue: number,
  onPositionUpdate: (position: number) => void,
  stepDelay: number = 300
): Promise<number> => {
  return new Promise((resolve) => {
    let step = 0;
    const animate = () => {
      if (step < diceValue) {
        step++;
        const newPos = currentPosition + step;
        
        // Don't animate beyond 100
        if (newPos > 100) {
          resolve(currentPosition);
          return;
        }
        
        onPositionUpdate(newPos);
        setTimeout(animate, stepDelay);
      } else {
        // Apply snakes and ladders after movement animation completes
        const finalPosition = currentPosition + diceValue;
        if (finalPosition > 100) {
          resolve(currentPosition);
          return;
        }
        
        let actualFinalPosition = finalPosition;
        
        // Check for snakes
        if (SNAKES[finalPosition]) {
          actualFinalPosition = SNAKES[finalPosition];
          setTimeout(() => onPositionUpdate(actualFinalPosition), stepDelay);
        }
        
        // Check for ladders
        if (LADDERS[finalPosition]) {
          actualFinalPosition = LADDERS[finalPosition];
          setTimeout(() => onPositionUpdate(actualFinalPosition), stepDelay);
        }
        
        resolve(actualFinalPosition);
      }
    };
    animate();
  });
};
