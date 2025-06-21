"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getBoardPosition } from "@/utils/gameLogic";

interface Player {
  id: number;
  position: number;
  color: string;
  icon: string;
  isBot: boolean;
}

interface GameBoardProps {
  players: Player[];

}

interface AnimatedPosition {
  x: number;
  y: number;
  isAnimating: boolean;
}

export default function GameBoard({ players }: GameBoardProps) {
  const [playerAnimPositions, setPlayerAnimPositions] = useState<
    Record<number, AnimatedPosition>
  >({});

  // Initialize animation positions for all players
  useEffect(() => {
    const initialPositions: Record<number, AnimatedPosition> = {};
    players.forEach((player) => {
      const coords = getBoardPosition(player.position);
      initialPositions[player.id] = {
        x: coords.x,
        y: coords.y,
        isAnimating: false,
      };
    });
    setPlayerAnimPositions(initialPositions);
  }, []);

  // Animate player position changes
  useEffect(() => {
    const timers: Record<number, NodeJS.Timeout> = {};

    players.forEach((player) => {
      const newCoords = getBoardPosition(player.position);
      const prevPos = playerAnimPositions[player.id];

      // Only animate if position actually changed
      if (prevPos && (prevPos.x !== newCoords.x || prevPos.y !== newCoords.y)) {
        setPlayerAnimPositions((prev) => ({
          ...prev,
          [player.id]: {
            ...newCoords,
            isAnimating: true,
          },
        }));

        // Clear any existing timer for this player
        if (timers[player.id]) {
          clearTimeout(timers[player.id]);
        }

        // Reset animation state after animation completes
        timers[player.id] = setTimeout(() => {
          setPlayerAnimPositions((prev) => ({
            ...prev,
            [player.id]: { ...prev[player.id], isAnimating: false },
          }));
        }, 800);
      } else if (!prevPos) {
        // Initialize position without animation
        setPlayerAnimPositions((prev) => ({
          ...prev,
          [player.id]: {
            ...newCoords,
            isAnimating: false,
          },
        }));
      }
    });

    // Cleanup timers on unmount or when players change
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [players, playerAnimPositions]);

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      <Image
        src="/boad.png"
        alt="Snake and Ladder Board"
        width={500}
        height={500}
        className={`w-full h-auto max-w-[500px] brightness-95`}
        priority
      />

      {/* Player pieces */}
      {players.map((player) => {
        if (player.position <= 0) return null;

        const animPos = playerAnimPositions[player.id];
        if (!animPos) return null;

        return (
          <div
            key={player.id}
            className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl z-10 ${animPos.isAnimating
              ? "transition-all duration-800 ease-in-out transform scale-110"
              : "transition-all duration-300 ease-in-out"
              }`}
            style={{
              left: `${animPos.x * 10 + 5}%`,
              top: `${animPos.y * 10 + 5}%`,
              transform: `translate(-50%, -50%) ${animPos.isAnimating
                ? "scale(1.2) "
                : "scale(1) rotate(0deg)"
                }`,
              filter: animPos.isAnimating
                ? `drop-shadow(0 0 10px ${player.color}80)`
                : "none",
            }}>
            <span className="animate-bounce">{player.icon}</span>
          </div>
        );
      })}
    </div>
  );
}
