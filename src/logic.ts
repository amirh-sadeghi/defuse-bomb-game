import { gameState } from "./state";

export function generateSecretCode() {
  const code: number[] = [];
  const allowDuplicates = gameState.currentDifficulty !== "training";

  while (code.length < 5) {
    const randomDigit = Math.floor(Math.random() * 10);

    if (!allowDuplicates && code.includes(randomDigit)) {
      continue;
    }

    code.push(randomDigit);
  }

  return code;
}

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minutesText = minutes.toString().padStart(2, "0");
  const secondsText = seconds.toString().padStart(2, "0");

  return `${minutesText}:${secondsText}`;
}

export function isCorrectGuess(guess: number[], code: number[]) {
  return guess.join("") === code.join("");
}

export function getFullFeedback(guess: number[], code: number[]) {
  const result: string[] = [];
  const codeCopy = [...code];

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === code[i]) {
      result.push("🟢");
      codeCopy[i] = -1;
    } else {
      result.push("");
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "🟢") continue;

    const foundIndex = codeCopy.indexOf(guess[i]);

    if (foundIndex !== -1) {
      result[i] = "🟡";
      codeCopy[foundIndex] = -1;
    } else {
      result[i] = "🔴";
    }
  }

  return result.join(" ");
}

export function getPartialFeedback(guess: number[], code: number[]) {
  let correctPosition = 0;
  let wrongPosition = 0;

  const codeCopy = [...code];
  const guessCopy = [...guess];

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === code[i]) {
      correctPosition++;
      codeCopy[i] = -1;
      guessCopy[i] = -1;
    }
  }

  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] === -1) continue;

    const foundIndex = codeCopy.indexOf(guessCopy[i]);

    if (foundIndex !== -1) {
      wrongPosition++;
      codeCopy[foundIndex] = -1;
    }
  }

  return `Correct spot: ${correctPosition} | Wrong spot: ${wrongPosition}`;
}

export function getFeedbackByDifficulty(guess: number[], code: number[]) {
  if (gameState.currentDifficulty === "critical") {
    return getPartialFeedback(guess, code);
  }

  return getFullFeedback(guess, code);
}

export function saveBestScore(difficulty: string, timeLeft: number) {
  const storageKey = `best-score-${difficulty}`;
  const existingScore = localStorage.getItem(storageKey);

  if (!existingScore) {
    localStorage.setItem(storageKey, String(timeLeft));
    return;
  }

  const existingTime = Number(existingScore);

  if (timeLeft > existingTime) {
    localStorage.setItem(storageKey, String(timeLeft));
  }
}

export function getBestScore(difficulty: string) {
  const storageKey = `best-score-${difficulty}`;
  const saved = localStorage.getItem(storageKey);

  if (!saved) return null;

  return Number(saved);
}