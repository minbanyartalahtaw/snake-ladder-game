"use client";

import CustomButton from "@/components/CustomButton";
import GameBoard from "@/components/GameBoard";
import { useState } from "react";
import { rollDice, calculateNewPosition } from "@/utils/gameLogic";

interface FriendGameState {
  currentPlayer: 1 | 2;
  player1Position: number;
  player2Position: number;
  diceValue: number | null;
  gameStatus: "playing" | "player1-won" | "player2-won";
  isRolling: boolean;
}

export default function PlayWithFriend() {
  const [gameState, setGameState] = useState<FriendGameState>({
    currentPlayer: 1,
    player1Position: 0,
    player2Position: 0,
    diceValue: null,
    gameStatus: "playing",
    isRolling: false,
  });

  const handleRoll = async () => {
    if (gameState.isRolling || gameState.gameStatus !== "playing") return;

    setGameState((prev) => ({ ...prev, isRolling: true }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dice = rollDice();
    const currentPosition =
      gameState.currentPlayer === 1
        ? gameState.player1Position
        : gameState.player2Position;
    const newPosition = calculateNewPosition(currentPosition, dice);

    const won = newPosition === 100;

    setGameState((prev) => ({
      ...prev,
      diceValue: dice,
      ...(gameState.currentPlayer === 1
        ? { player1Position: newPosition }
        : { player2Position: newPosition }),
      currentPlayer: won
        ? prev.currentPlayer
        : prev.currentPlayer === 1
        ? 2
        : 1,
      gameStatus: won
        ? gameState.currentPlayer === 1
          ? "player1-won"
          : "player2-won"
        : "playing",
      isRolling: false,
    }));
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: 1,
      player1Position: 0,
      player2Position: 0,
      diceValue: null,
      gameStatus: "playing",
      isRolling: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Player 2 Status - Top */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold">👤</span>
            </div>
            <div>
              <p className="font-semibold text-lg text-slate-800">Player 2</p>
              <p className="text-sm text-slate-500">
                Position: {gameState.player2Position}
              </p>
            </div>
          </div>
          <div className="text-right">
            {gameState.currentPlayer === 2 &&
              gameState.gameStatus === "playing" && (
                <p className="text-red-500 font-medium animate-pulse">
                  Your Turn
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Game Board - Middle */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full flex flex-col items-center gap-8">
          <GameBoard
            playerPosition={gameState.player1Position}
            botPosition={gameState.player2Position}
          />

          {gameState.gameStatus !== "playing" && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                {gameState.gameStatus === "player1-won"
                  ? "🎉 Player 1 Wins!"
                  : "🎉 Player 2 Wins!"}
              </h2>
              <CustomButton onClick={resetGame}>New Game</CustomButton>
            </div>
          )}
        </div>
      </div>

      {/* Player 1 Controls - Bottom */}
      <div className="bg-white shadow-sm border-t p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold">👤</span>
            </div>
            <div>
              <p className="font-semibold text-lg text-slate-800">Player 1</p>
              <p className="text-sm text-slate-500">
                Position: {gameState.player1Position}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-lg shadow-md border flex items-center justify-center mb-2">
                <span className="text-2xl">
                  {gameState.isRolling ? "🎲" : gameState.diceValue || "❔"}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">DICE</p>
            </div>

            <div className="text-center">
              <CustomButton
                onClick={handleRoll}
                disabled={
                  gameState.isRolling || gameState.gameStatus !== "playing"
                }>
                {gameState.isRolling
                  ? "Rolling..."
                  : `Player ${gameState.currentPlayer} Roll`}
              </CustomButton>
              <p className="text-xs mt-2 font-medium text-slate-600">
                {gameState.currentPlayer === 1 ? "P1 Turn" : "P2 Turn"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
