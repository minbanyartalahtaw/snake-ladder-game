"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getBoardPosition } from "@/utils/gameLogic";

interface GameBoardProps {
  playerPosition: number;
  botPosition: number;
}

interface AnimatedPosition {
  x: number;
  y: number;
  isAnimating: boolean;
}

export default function GameBoard({
  playerPosition,
  botPosition,
}: GameBoardProps) {
  const [playerAnimPos, setPlayerAnimPos] = useState<AnimatedPosition>({
    x: 0,
    y: 9,
    isAnimating: false,
  });
  const [botAnimPos, setBotAnimPos] = useState<AnimatedPosition>({
    x: 0,
    y: 9,
    isAnimating: false,
  });

  // Animate player position changes
  useEffect(() => {
    const newCoords = getBoardPosition(playerPosition);
    setPlayerAnimPos((prev) => ({
      ...newCoords,
      isAnimating: prev.x !== newCoords.x || prev.y !== newCoords.y,
    }));

    // Reset animation state after animation completes
    const timer = setTimeout(() => {
      setPlayerAnimPos((prev) => ({ ...prev, isAnimating: false }));
    }, 800);

    return () => clearTimeout(timer);
  }, [playerPosition]);

  // Animate bot position changes
  useEffect(() => {
    const newCoords = getBoardPosition(botPosition);
    setBotAnimPos((prev) => ({
      ...newCoords,
      isAnimating: prev.x !== newCoords.x || prev.y !== newCoords.y,
    }));

    // Reset animation state after animation completes
    const timer = setTimeout(() => {
      setBotAnimPos((prev) => ({ ...prev, isAnimating: false }));
    }, 800);

    return () => clearTimeout(timer);
  }, [botPosition]);

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      <Image
        src="/boad.png"
        alt="Snake and Ladder Board"
        width={500}
        height={500}
        className="w-full h-auto max-w-[500px]"
        priority
      />

      {/* Player piece */}
      {playerPosition > 0 && (
        <div
          className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl z-10 ${
            playerAnimPos.isAnimating
              ? "transition-all duration-800 ease-in-out transform scale-110"
              : "transition-all duration-300 ease-in-out"
          }`}
          style={{
            left: `${playerAnimPos.x * 10 + 5}%`,
            top: `${playerAnimPos.y * 10 + 5}%`,
            transform: `translate(-50%, -50%) ${
              playerAnimPos.isAnimating
                ? "scale(1.2) rotate(10deg)"
                : "scale(1)"
            }`,
            filter: playerAnimPos.isAnimating
              ? "drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))"
              : "none",
          }}>
          <span className="animate-bounce">👤</span>
        </div>
      )}

      {/* Bot piece */}
      {botPosition > 0 && (
        <div
          className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl z-10 ${
            botAnimPos.isAnimating
              ? "transition-all duration-800 ease-in-out transform scale-110"
              : "transition-all duration-300 ease-in-out"
          }`}
          style={{
            left: `${botAnimPos.x * 10 + 5}%`,
            top: `${botAnimPos.y * 10 + 5}%`,
            transform: `translate(-50%, -50%) ${
              botAnimPos.isAnimating ? "scale(1.2) rotate(-10deg)" : "scale(1)"
            }`,
            filter: botAnimPos.isAnimating
              ? "drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))"
              : "none",
          }}>
          <span className="animate-bounce">🤖</span>
        </div>
      )}
    </div>
  );
}
