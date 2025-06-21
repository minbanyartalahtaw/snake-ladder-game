"use client";

import CustomButton from "@/components/CustomButton";
import GameBoard from "@/components/GameBoard";
import { useState, useEffect, use } from "react";
import { rollDice, animatePlayerMovement } from "@/utils/gameLogic";

interface Player {
  id: number;
  position: number;
  color: string;
  icon: string;
  isBot: boolean;
}

interface MultiPlayerGameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  gameStatus: "playing" | "won";
  winnerId: number | null;
  isRolling: boolean;
}

const PLAYER_CONFIGS = [
  { color: "#00a3c4", icon: "🔥" },
  { color: "#f56565", icon: "🤖" },
  { color: "#805ad5", icon: "👾" },
  { color: "#1a202c", icon: "🏴‍☠️" },
];

export default function PlayWithFriends({
  params,
}: {
  params: Promise<{ playerNumber: string }>;
}) {
  const resolvedParams = use(params);
  const playerNumber = parseInt(resolvedParams.playerNumber);
  const isSinglePlayer = playerNumber === 1;

  const [gameState, setGameState] = useState<MultiPlayerGameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    gameStatus: "playing",
    winnerId: null,
    isRolling: false,
  });

  // Initialize players based on playerNumber
  useEffect(() => {
    const players: Player[] = [];

    for (let i = 0; i < Math.max(2, playerNumber); i++) {
      players.push({
        id: i + 1,
        position: 0,
        color: PLAYER_CONFIGS[i % PLAYER_CONFIGS.length].color,
        icon: PLAYER_CONFIGS[i % PLAYER_CONFIGS.length].icon,
        isBot: isSinglePlayer ? i > 0 : false,
      });
    }

    setGameState((prev) => ({
      ...prev,
      players,
    }));
  }, [playerNumber, isSinglePlayer]);

  const handleRoll = async () => {
    if (gameState.isRolling || gameState.gameStatus !== "playing") return;

    setGameState((prev) => ({ ...prev, isRolling: true }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dice = rollDice();
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // Set dice value first
    setGameState((prev) => ({
      ...prev,
      diceValue: dice,
      isRolling: false,
    }));

    // Animate movement step by step
    const finalPosition = await animatePlayerMovement(
      currentPlayer.position,
      dice,
      (position) => {
        setGameState((prev) => ({
          ...prev,
          players: prev.players.map((player, index) =>
            index === prev.currentPlayerIndex ? { ...player, position } : player
          ),
        }));
      },
      1000
    );

    const won = finalPosition === 100;

    // Add a small delay to show the final position (especially for snakes/ladders)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update final game state
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((player, index) =>
        index === prev.currentPlayerIndex
          ? { ...player, position: finalPosition }
          : player
      );

      return {
        ...prev,
        players: updatedPlayers,
        currentPlayerIndex: won
          ? prev.currentPlayerIndex
          : (prev.currentPlayerIndex + 1) % prev.players.length,
        gameStatus: won ? "won" : "playing",
        winnerId: won ? currentPlayer.id : null,
      };
    });

    // If it's a bot's turn and game is still playing, auto-roll after a delay
    if (!won && currentPlayer.isBot && gameState.gameStatus === "playing") {
      setTimeout(() => {
        handleRoll();
      }, 2000);
    }
  };

  const resetGame = () => {
    const players = gameState.players.map((player) => ({
      ...player,
      position: 0,
    }));

    setGameState({
      players,
      currentPlayerIndex: 0,
      diceValue: null,
      gameStatus: "playing",
      winnerId: null,
      isRolling: false,
    });
  };

  const getCurrentPlayerColor = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    return currentPlayer?.color || "#00a3c4";
  };

  if (gameState.players.length === 0) {
    return <div>Loading...</div>;
  }

  const isCurrentPlayerBot =
    gameState.players[gameState.currentPlayerIndex]?.isBot;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Players Section */}
      <div className="bg-white shadow-sm  p-6">
        <div className="max-w-6xl mx-auto">
          <div className={`grid grid-cols-${playerNumber > 2 ? 2 : 1} gap-4`}>
            {gameState.players
              .slice(0, Math.ceil(gameState.players.length / 2))
              .map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    gameState.currentPlayerIndex === player.id - 1 &&
                    gameState.gameStatus === "playing"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                      style={{ backgroundColor: player.color }}>
                      <span className="text-white font-semibold text-3xl">
                        {player.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-slate-800">
                        {player.isBot
                          ? `Bot ${player.id}`
                          : `Player ${player.id}`}
                      </p>
                      <p className="text-sm text-slate-500">
                        Position: {player.position}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Game Board - Middle */}
      <div className="flex-1 flex items-center justify-center p-1">
        <div className="max-w-2xl w-full flex flex-col items-center gap-8">
          <GameBoard players={gameState.players} />

          {gameState.gameStatus === "won" && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                🎉{" "}
                {gameState.players.find((p) => p.id === gameState.winnerId)
                  ?.isBot
                  ? "Bot"
                  : "Player"}{" "}
                {gameState.winnerId} Wins!
              </h2>
              <CustomButton onClick={resetGame}>New Game</CustomButton>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Players Section */}
      <div className="bg-white shadow-sm  p-6">
        <div className="max-w-6xl mx-auto">
          <div className={`grid grid-cols-${playerNumber > 3 ? 2 : 1} gap-4`}>
            {gameState.players
              .slice(Math.ceil(gameState.players.length / 2))
              .map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    gameState.currentPlayerIndex === player.id - 1 &&
                    gameState.gameStatus === "playing"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                        gameState.currentPlayerIndex === player.id - 1 &&
                        gameState.gameStatus === "playing"
                          ? "border-2 border-blue-500 bg-blue-50"
                          : ""
                      }`}
                      style={{ backgroundColor: player.color }}>
                      <span className="text-white font-semibold text-3xl">
                        {player.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-slate-800">
                        {player.isBot
                          ? `Bot ${player.id}`
                          : `Player ${player.id}`}
                      </p>
                      <p className="text-sm text-slate-500">
                        Position: {player.position}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Dice and Roll Button - Center */}
          <div className="flex items-center justify-center gap-6 mt-5">
            <div className="text-center">
              <CustomButton
                onClick={handleRoll}
                disabled={
                  gameState.isRolling ||
                  gameState.gameStatus !== "playing" ||
                  isCurrentPlayerBot
                }
                style={{
                  backgroundColor: getCurrentPlayerColor(),
                  borderColor: getCurrentPlayerColor(),
                }}>
                {gameState.isRolling
                  ? "Rolling..."
                  : isCurrentPlayerBot
                  ? "Bot's Turn"
                  : `Player ${gameState.currentPlayerIndex + 1} Roll`}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
