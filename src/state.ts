import { DIFFICULTY_CONFIG } from "./config";
import type { Difficulty } from "./types";

export const gameState = {
  currentDifficulty: "training" as Difficulty,
  attemptsLeft: DIFFICULTY_CONFIG.training.attempts as number,
  timeLeft: DIFFICULTY_CONFIG.training.time as number,
  initialAttempts: DIFFICULTY_CONFIG.training.attempts as number,
  isGameOver: false,
  timerIntervalId: null as number | null,
  currentGuess: [] as number[],
  historyList: [] as string[],
  secretCode: [] as number[],
  isSoundOn: true,
  endState: "win" as "win" | "lose",
};