"use client";

import CustomButton from "@/components/CustomButton";
import GameBoard from "@/components/GameBoard";
import { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import { rollDice, animatePlayerMovement } from "@/utils/gameLogic";

export default function PlayWithBot() {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: "player",
    playerPosition: 0,
    botPosition: 0,
    diceValue: null,
    gameStatus: "playing",
    isRolling: false,
  });

  const handlePlayerRoll = async () => {
    if (gameState.currentPlayer !== "player" || gameState.isRolling) return;

    setGameState((prev) => ({ ...prev, isRolling: true }));

    // Simulate dice rolling animation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dice = rollDice();
    
    // Set dice value first
    setGameState((prev) => ({
      ...prev,
      diceValue: dice,
      isRolling: false,
    }));

    // Animate movement step by step
    const finalPosition = await animatePlayerMovement(
      gameState.playerPosition,
      dice,
      (position) => {
        setGameState((prev) => ({
          ...prev,
          playerPosition: position,
        }));
      },
      400
    );

    // Update final game state
    setGameState((prev) => ({
      ...prev,
      playerPosition: finalPosition,
      currentPlayer: finalPosition === 100 ? "player" : "bot",
      gameStatus: finalPosition === 100 ? "won" : "playing",
    }));
  };

  const handleBotTurn = async () => {
    if (gameState.currentPlayer !== "bot" || gameState.gameStatus !== "playing")
      return;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const dice = rollDice();
    
    // Set dice value first
    setGameState((prev) => ({
      ...prev,
      diceValue: dice,
    }));

    // Animate bot movement step by step
    const finalPosition = await animatePlayerMovement(
      gameState.botPosition,
      dice,
      (position) => {
        setGameState((prev) => ({
          ...prev,
          botPosition: position,
        }));
      },
      400
    );

    // Update final game state
    setGameState((prev) => ({
      ...prev,
      botPosition: finalPosition,
      currentPlayer: finalPosition === 100 ? "bot" : "player",
      gameStatus: finalPosition === 100 ? "lost" : "playing",
    }));
  };

  useEffect(() => {
    if (
      gameState.currentPlayer === "bot" &&
      gameState.gameStatus === "playing"
    ) {
      handleBotTurn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetGame = () => {
    setGameState({
      currentPlayer: "player",
      playerPosition: 0,
      botPosition: 0,
      diceValue: null,
      gameStatus: "playing",
      isRolling: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Bot Status - Top */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold">🤖</span>
            </div>
            <div>
              <p className="font-semibold text-lg text-slate-800">Computer</p>
              <p className="text-sm text-slate-500">
                Position: {gameState.botPosition}
              </p>
            </div>
          </div>
          <div className="text-right">
            {gameState.currentPlayer === "bot" && (
              <p className="text-red-500 font-medium animate-pulse">
                Thinking...
              </p>
            )}
            {gameState.currentPlayer === "bot" && gameState.diceValue && (
              <p className="text-lg font-semibold text-slate-700">
                Rolled: {gameState.diceValue}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Game Board - Middle */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full flex flex-col items-center gap-8">
          <GameBoard
            playerPosition={gameState.playerPosition}
            botPosition={gameState.botPosition}
          />

          {gameState.gameStatus !== "playing" && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                {gameState.gameStatus === "won"
                  ? "🎉 You Win!"
                  : "🤖 Bot Wins!"}
              </h2>
              <CustomButton onClick={resetGame}>New Game</CustomButton>
            </div>
          )}
        </div>
      </div>

      {/* Player Controls - Bottom */}
      <div className="bg-white shadow-sm border-t p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold">👤</span>
            </div>
            <div>
              <p className="font-semibold text-lg text-slate-800">You</p>
              <p className="text-sm text-slate-500">
                Position: {gameState.playerPosition}
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

            <CustomButton
              onClick={handlePlayerRoll}
              disabled={
                gameState.currentPlayer !== "player" ||
                gameState.isRolling ||
                gameState.gameStatus !== "playing"
              }>
              {gameState.isRolling ? "Rolling..." : "Roll Dice"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}
