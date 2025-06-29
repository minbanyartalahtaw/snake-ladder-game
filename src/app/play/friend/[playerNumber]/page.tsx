"use client";

import CustomButton from "@/components/CustomButton";
import GameBoard from "@/components/GameBoard";
import { useState, useEffect, use } from "react";
import { rollDice, animatePlayerMovement } from "@/utils/gameLogic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, House } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isOnlyEmojis } from "@/utils/isOnlyEmoji";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Player {
  id: number;
  name: string;
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
  { color: "#00a3c4", icon: "🪼" },
  { color: "#f56565", icon: "🦀" },
  { color: "#805ad5", icon: "👾" },
  { color: "#1a202c", icon: "🕷️" },
];

export default function PlayWithFriends({
  params,
}: {
  params: Promise<{ playerNumber: string }>;
}) {
  const resolvedParams = use(params);
  const playerNumber = parseInt(resolvedParams.playerNumber);
  const isSinglePlayer = playerNumber === 1;
  const [boardBrigntness, setBoardBrightness] = useState<number[]>([0.7]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [gameState, setGameState] = useState<MultiPlayerGameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    gameStatus: "playing",
    winnerId: null,
    isRolling: false,
  });
  const router = useRouter();

  // Initialize players based on playerNumber
  useEffect(() => {
    const players: Player[] = [];

    for (let i = 0; i < Math.max(2, playerNumber); i++) {
      players.push({
        id: i + 1,
        name: isSinglePlayer && i === 1 ? "Computer" : `Player ${i + 1}`,
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

    const randomDelay = 2000 + Math.floor(Math.random() * 2000);

    await new Promise((resolve) => setTimeout(resolve, randomDelay));

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
        diceValue: null,
      };
    });
  };

  const handleChangeBrightness = (newSize: number[]) => {
    console.log(newSize[0]);
    setBoardBrightness(newSize);
  };

  // Handle bot turns with useEffect
  useEffect(() => {
    if (
      gameState.gameStatus === "playing" &&
      !gameState.isRolling &&
      gameState.players.length > 0 &&
      gameState.players[gameState.currentPlayerIndex]?.isBot
    ) {
      const timer = setTimeout(() => {
        handleRoll();
      }, 2000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameState.currentPlayerIndex,
    gameState.gameStatus,
    gameState.isRolling,
    gameState.players,
  ]);

  const resetGame = () => {
    const players = gameState.players.map((player) => ({
      ...player,
      position: 0,
    }));

    setGameState({
      players,
      currentPlayerIndex: 0,
      diceValue: 0,
      gameStatus: "playing",
      winnerId: null,
      isRolling: false,
    });
  };

  if (gameState.players.length === 0 || !imageLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Image
          src="/logo.png"
          alt="Snake and Ladder Board"
          width={100}
          height={100}
          className="w-full h-auto max-w-[100px] brightness-95 rounded-full  animate-spin"
          priority
          onLoad={() => setImageLoaded(true)}
        />
        <p className="text-xl font-bold text-slate-800">Loading...</p>
      </div>
    );
  }

  //console.log(gameState.players[gameState.currentPlayerIndex].color)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Players Section */}
      <motion.div
        className="bg-white shadow-sm  p-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="max-w-6xl mx-auto">
          <div className={`grid grid-cols-${playerNumber > 3 ? 2 : 1}  gap-4 `}>
            {gameState.players
              .slice(Math.ceil(gameState.players.length / 2))
              .map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 md:p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                    gameState.currentPlayerIndex === player.id - 1 &&
                    gameState.gameStatus === "playing"
                      ? "border-green-600 bg-green-100"
                      : "border-gray-200"
                  }`}>
                  <div className="flex items-center gap-2 sm:gap-4 md:gap-6 w-full">
                    {/* Player icon  */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center`}>
                      <span className="text-xl sm:text-2xl md:text-4xl">
                        {player.icon}
                      </span>
                    </div>

                    {/* Player Name and Details */}
                    <div className="flex justify-between items-center w-full">
                      <div className="space-y-0.5 sm:space-y-1">
                        <p
                          className={`text-[${player.color}] font-semibold text-sm sm:text-lg md:text-xl  truncate max-w-[100px] sm:max-w-full`}>
                          {player.isBot ? `Computer` : player.name}
                        </p>
                        <p className="text-xs md:text-sm hidden sm:flex text-slate-500">
                          Position: {player.position}
                        </p>
                      </div>

                      <div className="ml-2 sm:ml-4  flex items-center">
                        {gameState.currentPlayerIndex === player.id - 1 &&
                        gameState.gameStatus === "playing" ? (
                          <div
                            className="flex items-center gap-2  cursor-pointer"
                            onClick={handleRoll}>
                            <div
                              className={`text-xl scale-150 md:scale-200 ${
                                gameState.isRolling ? "animate-spin" : ""
                              }`}>
                              {gameState.diceValue === null
                                ? "🎲"
                                : gameState.diceValue}
                            </div>
                          </div>
                        ) : (
                          <Popover>
                            <PopoverTrigger>
                              <div
                                className={`p-1  sm:p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                                  isSinglePlayer ? "hidden" : ""
                                }`}>
                                <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 cursor-pointer" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] sm:w-80">
                              <div className="space-y-4 sm:space-y-6">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`name-${player.id}`}
                                    className="text-xs sm:text-sm font-medium">
                                    Name
                                  </Label>
                                  <Input
                                    id={`name-${player.id}`}
                                    defaultValue={player.name}
                                    className="h-8 sm:h-9 text-sm"
                                    onChange={(e) => {
                                      setGameState((prev) => ({
                                        ...prev,
                                        players: prev.players.map((p) =>
                                          p.id === player.id
                                            ? { ...p, name: e.target.value }
                                            : p
                                        ),
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`emoji-${player.id}`}
                                    className="text-xs sm:text-sm font-medium mt-5">
                                    Emoji
                                  </Label>
                                  <Input
                                    id={`emoji-${player.id}`}
                                    defaultValue={player.icon}
                                    className="h-8 sm:h-9 text-sm"
                                    onChange={(e) => {
                                      if (isOnlyEmojis(e.target.value)) {
                                        setGameState((prev) => ({
                                          ...prev,
                                          players: prev.players.map((p) =>
                                            p.id === player.id
                                              ? { ...p, icon: e.target.value }
                                              : p
                                          ),
                                        }));
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Dice and Roll Button - Center */}
        </div>
      </motion.div>

      {/* Game Board - Middle */}
      <div className="flex-1 flex items-center justify-center p-1">
        <div className="max-w-2xl w-full flex flex-col items-center gap-8">
          <GameBoard
            players={gameState.players}
            brightness={boardBrigntness[0]}
          />
          <div className="w-full  flex justify-around items-center">
            <button
              onClick={() => router.push("/")}
              className="p-3 rounded-lg border-1 border-gray-300  text-slate  flex items-center gap-2">
              <House className="w-5 h-5" />
            </button>
            <Slider
              defaultValue={boardBrigntness}
              max={1.17}
              step={0.01}
              className={cn("w-[60%]")}
              onValueChange={handleChangeBrightness}
            />
          </div>
          {gameState.gameStatus === "won" && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                🎉{" "}
                {gameState.players.find((p) => p.id === gameState.winnerId)
                  ?.isBot
                  ? "Computer Wins!"
                  : isSinglePlayer
                  ? "You Win!"
                  : `Player ${gameState.winnerId} Wins!`}
              </h2>
              <CustomButton onClick={resetGame}>New Game</CustomButton>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Players Section */}
      <motion.div
        className="bg-white shadow-sm  p-6"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="bg-white shadow-sm  p-6">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-${playerNumber > 2 ? 2 : 1} gap-4`}>
              {gameState.players
                .slice(0, Math.ceil(gameState.players.length / 2))
                .map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 md:p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                      gameState.currentPlayerIndex === player.id - 1 &&
                      gameState.gameStatus === "playing"
                        ? "border-green-600 bg-green-100"
                        : "border-gray-200"
                    }`}>
                    <div className="flex items-center gap-2 sm:gap-4 md:gap-6 w-full">
                      {/* Player icon  */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center`}>
                        <span className="text-xl sm:text-2xl md:text-4xl">
                          {player.icon}
                        </span>
                      </div>

                      {/* Player Name and Details */}
                      <div className="flex justify-between items-center w-full">
                        <div className="space-y-0.5 sm:space-y-1">
                          <p
                            className={`text-[${player.color}] font-semibold text-sm sm:text-lg md:text-xl  truncate max-w-[100px] sm:max-w-full`}>
                            {player.isBot ? `Computer` : player.name}
                          </p>
                          <p className="text-xs md:text-sm hidden sm:flex text-slate-500">
                            Position: {player.position}
                          </p>
                        </div>

                        <div className="ml-2 sm:ml-4  flex items-center">
                          {gameState.currentPlayerIndex === player.id - 1 &&
                          gameState.gameStatus === "playing" ? (
                            <div
                              className="flex items-center gap-2  cursor-pointer"
                              onClick={handleRoll}>
                              <div
                                className={`text-xl scale-150 md:scale-200 ${
                                  gameState.isRolling ? "animate-spin" : ""
                                }`}>
                                {gameState.diceValue === null
                                  ? "🎲"
                                  : gameState.diceValue}
                              </div>
                            </div>
                          ) : (
                            <Popover>
                              <PopoverTrigger>
                                <div className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                  <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 cursor-pointer" />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-[280px] sm:w-80">
                                <div className="space-y-4 sm:space-y-6">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`name-${player.id}`}
                                      className="text-xs sm:text-sm font-medium">
                                      Name
                                    </Label>
                                    <Input
                                      id={`name-${player.id}`}
                                      defaultValue={player.name}
                                      className="h-8 sm:h-9 text-sm"
                                      onChange={(e) => {
                                        setGameState((prev) => ({
                                          ...prev,
                                          players: prev.players.map((p) =>
                                            p.id === player.id
                                              ? { ...p, name: e.target.value }
                                              : p
                                          ),
                                        }));
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`emoji-${player.id}`}
                                      className="text-xs sm:text-sm font-medium mt-5">
                                      Emoji
                                    </Label>
                                    <Input
                                      id={`emoji-${player.id}`}
                                      defaultValue={player.icon}
                                      className="h-8 sm:h-9 text-sm"
                                      onChange={(e) => {
                                        if (isOnlyEmojis(e.target.value)) {
                                          setGameState((prev) => ({
                                            ...prev,
                                            players: prev.players.map((p) =>
                                              p.id === player.id
                                                ? { ...p, icon: e.target.value }
                                                : p
                                            ),
                                          }));
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
