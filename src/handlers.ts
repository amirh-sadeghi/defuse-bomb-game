import { DIFFICULTY_CONFIG } from "./config";
import {
  generateSecretCode,
  getBestScore,
  getFeedbackByDifficulty,
  isCorrectGuess,
  saveBestScore,
} from "./logic";
import { gameState } from "./state";
import {
  hideEndOverlay,
  renderAttempts,
  renderDifficultyBadge,
  renderHistory,
  renderSlots,
  renderStatusMessage,
  renderTimer,
  showEndOverlay,
  triggerSlotsShake,
  triggerWinSlotsGlow,
  updateControlButtonsState,
} from "./ui";
import type { Difficulty } from "./types";

const keypad = document.querySelector<HTMLDivElement>("#keypad");
const enterBtn = document.querySelector<HTMLButtonElement>("#enter-btn");
const deleteBtn = document.querySelector<HTMLButtonElement>("#delete-btn");
const restartBtn = document.querySelector<HTMLButtonElement>("#restart-btn");
const soundToggleBtn =
  document.querySelector<HTMLButtonElement>("#sound-toggle-btn");

const startScreen = document.querySelector<HTMLDivElement>("#start-screen");
const startBtn = document.querySelector<HTMLButtonElement>("#start-btn");
const startHint = document.querySelector<HTMLParagraphElement>("#start-hint");
const bestScoreDisplay =
  document.querySelector<HTMLParagraphElement>("#best-score-display");
const startDifficultyButtons =
  document.querySelectorAll<HTMLButtonElement>(".mode-card");

const playAgainBtn =
  document.querySelector<HTMLButtonElement>("#play-again-btn");
const changeDifficultyBtn =
  document.querySelector<HTMLButtonElement>("#change-difficulty-btn");

let hasSelectedDifficulty = false;
let hasPlayedCountdown = false;

function playSound(src: string, volume = 0.3) {
  if (!gameState.isSoundOn) return;

  const audio = new Audio(src);
  audio.volume = volume;

  audio.play().catch((error) => {
    console.error("Sound play failed:", src, error);
  });
}

const countdownAudio = new Audio("/countdown.wav");
countdownAudio.volume = 0.45;

function playCountdownAudio() {
  if (!gameState.isSoundOn) return;

  countdownAudio.currentTime = 0;
  countdownAudio.play().catch((error) => {
    console.error("Countdown play failed:", error);
  });
}

function stopCountdownAudio() {
  countdownAudio.pause();
  countdownAudio.currentTime = 0;
}

function addGuessToHistory(guess: number[], feedback: string) {
  const guessText = guess.join("");
  const historyItem = `
    <span>${guessText}</span>
    <span class="feedback">${feedback}</span>
  `;

  gameState.historyList.unshift(historyItem);
  renderHistory();
}

export function stopTimer() {
  if (gameState.timerIntervalId !== null) {
    clearInterval(gameState.timerIntervalId);
    gameState.timerIntervalId = null;
  }
}

export function startTimer() {
  stopTimer();
  hasPlayedCountdown = false;
  stopCountdownAudio();

  gameState.timerIntervalId = window.setInterval(() => {
    if (gameState.isGameOver) {
      stopTimer();
      stopCountdownAudio();
      return;
    }

    gameState.timeLeft--;
    renderTimer();

    if (gameState.timeLeft === 10 && !hasPlayedCountdown) {
      playCountdownAudio();
      renderStatusMessage("Final countdown initiated.", "danger");
      hasPlayedCountdown = true;
    }

    if (gameState.timeLeft <= 0) {
      gameState.timeLeft = 0;
      renderTimer();
      gameState.isGameOver = true;
      gameState.endState = "lose";

      stopCountdownAudio();
      playSound("/explosion.wav", 0.4);
      renderStatusMessage("Countdown expired. Device detonated.", "danger");
      stopTimer();
      showEndOverlay();
    }
  }, 1000);
}

export function handleNumberInput(num: number) {
  if (gameState.isGameOver) return;
  if (gameState.currentGuess.length >= 5) return;

  playSound("/beep.wav", 0.2);
  renderStatusMessage("");
  gameState.currentGuess.push(num);
  renderSlots();
  updateControlButtonsState();
}

export function handleDelete() {
  if (gameState.isGameOver) return;

  gameState.currentGuess.pop();
  renderSlots();
  updateControlButtonsState();
}

export function handleSubmitGuess() {
  if (gameState.isGameOver) return;
  if (gameState.currentGuess.length < 5) return;

  const guessCopy = [...gameState.currentGuess];
  const guessedCorrectly = isCorrectGuess(guessCopy, gameState.secretCode);
  const feedback = getFeedbackByDifficulty(guessCopy, gameState.secretCode);

  addGuessToHistory(guessCopy, feedback);

  if (guessedCorrectly) {
    gameState.isGameOver = true;
    gameState.endState = "win";
    stopCountdownAudio();
    playSound("/success.wav", 0.3);

    saveBestScore(gameState.currentDifficulty, gameState.timeLeft);

    renderStatusMessage("Bomb defused successfully.", "success");
    stopTimer();
    gameState.currentGuess.length = 0;
    renderSlots();
    triggerWinSlotsGlow();
    updateControlButtonsState();
    showEndOverlay();
    return;
  }

  triggerSlotsShake();

  gameState.attemptsLeft = gameState.attemptsLeft - 1;
  renderAttempts();

  const penalty = DIFFICULTY_CONFIG[gameState.currentDifficulty].penalty;

  if (penalty > 0) {
    gameState.timeLeft = Math.max(0, gameState.timeLeft - penalty);
    renderTimer();
  }

  const lostByAttempts = gameState.attemptsLeft === 0;
  const lostByTime = gameState.timeLeft === 0;

  if (lostByAttempts || lostByTime) {
    gameState.isGameOver = true;
    gameState.endState = "lose";
    stopCountdownAudio();
    playSound("/explosion.wav", 0.4);

    if (lostByAttempts) {
      renderStatusMessage(
        `No attempts remaining. Detonation triggered. Code was ${gameState.secretCode.join("")}.`,
        "danger"
      );
    } else {
      renderStatusMessage(
        `Countdown expired. Code was ${gameState.secretCode.join("")}.`,
        "danger"
      );
    }

    stopTimer();
    gameState.currentGuess.length = 0;
    renderSlots();
    updateControlButtonsState();
    showEndOverlay();
    return;
  }

  playSound("/error.wav", 0.25);

  if (penalty > 0) {
    renderStatusMessage(
      `Incorrect code. Penalty applied: -${penalty} seconds.`,
      "warning"
    );
  } else {
    renderStatusMessage("Incorrect code. Try again.", "warning");
  }

  gameState.currentGuess.length = 0;
  renderSlots();
  updateControlButtonsState();
}

export function resetGame() {
  const config = DIFFICULTY_CONFIG[gameState.currentDifficulty];

  gameState.attemptsLeft = config.attempts;
  gameState.initialAttempts = config.attempts;
  gameState.timeLeft = config.time;
  gameState.isGameOver = false;

  hasPlayedCountdown = false;
  stopCountdownAudio();

  gameState.currentGuess.length = 0;
  gameState.historyList.length = 0;

  gameState.secretCode = generateSecretCode();
  console.log("Secret code:", gameState.secretCode.join(""));

  hideEndOverlay();
  renderSlots();
  renderAttempts();
  renderTimer();
  renderHistory();
  renderDifficultyBadge();
  renderStatusMessage("Mission started. Awaiting code input.");
  updateControlButtonsState();

  startTimer();
}

function showStartScreen() {
  stopTimer();
  stopCountdownAudio();
  gameState.isGameOver = true;
  hideEndOverlay();

  if (startScreen) {
    startScreen.style.display = "flex";
  }
}

function renderBestScorePreview() {
  if (!bestScoreDisplay) return;

  const bestScore = getBestScore(gameState.currentDifficulty);

  if (bestScore === null) {
    bestScoreDisplay.textContent = "Best score: --";
    return;
  }

  const minutes = Math.floor(bestScore / 60);
  const seconds = bestScore % 60;

  const minutesText = minutes.toString().padStart(2, "0");
  const secondsText = seconds.toString().padStart(2, "0");

  bestScoreDisplay.textContent = `Best score: ${minutesText}:${secondsText} remaining`;
}

export function setupStartScreen() {
  if (startBtn) {
    startBtn.disabled = true;
  }
  renderBestScorePreview();

  startDifficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedDifficulty =
        button.dataset.startDifficulty as Difficulty;

      gameState.currentDifficulty = selectedDifficulty;
      hasSelectedDifficulty = true;

      startDifficultyButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      if (startBtn) {
        startBtn.disabled = false;
      }

      if (startHint) {
        startHint.textContent = `Selected difficulty: ${selectedDifficulty.toUpperCase()}`;
      }
      renderBestScorePreview();
    });
  });

  startBtn?.addEventListener("click", () => {
    if (!hasSelectedDifficulty) {
      if (startHint) {
        startHint.textContent = "Select a difficulty first.";
      }
      return;
    }

    if (startScreen) {
      startScreen.classList.add("start-screen-hide");

      setTimeout(() => {
        startScreen.style.display = "none";
        startScreen.classList.remove("start-screen-hide");
      }, 350);
    }

    resetGame();
  });
}

export function setupKeypad() {
  if (!keypad) return;

  keypad.innerHTML = "";

  for (let i = 1; i <= 9; i++) {
    const button = document.createElement("button");
    button.textContent = i.toString();

    button.addEventListener("click", () => {
      handleNumberInput(i);
    });

    keypad.appendChild(button);
  }

  const zeroButton = document.createElement("button");
  zeroButton.textContent = "0";

  zeroButton.addEventListener("click", () => {
    handleNumberInput(0);
  });

  keypad.appendChild(zeroButton);
}

export function setupControlButtons() {
  deleteBtn?.addEventListener("click", () => {
    handleDelete();
  });

  enterBtn?.addEventListener("click", () => {
    handleSubmitGuess();
  });

  restartBtn?.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Restart mission and return to difficulty selection?"
    );

    if (!confirmed) return;

    showStartScreen();
    renderStatusMessage("");
  });
}

export function setupKeyboardControls() {
  document.addEventListener("keydown", (event) => {
    if (startScreen && startScreen.style.display !== "none") {
      return;
    }

    if (gameState.isGameOver) {
      return;
    }

    if (event.key >= "0" && event.key <= "9") {
      handleNumberInput(Number(event.key));
      return;
    }

    if (event.key === "Backspace") {
      handleDelete();
      return;
    }

    if (event.key === "Enter") {
      handleSubmitGuess();
    }
  });
}

export function setupSoundToggle() {
  if (!soundToggleBtn) return;

  function renderSoundButton() {
    soundToggleBtn.textContent = gameState.isSoundOn
      ? "🔊 SOUND ON"
      : "🔇 SOUND OFF";

    soundToggleBtn.classList.remove("sound-on", "sound-off");

    if (gameState.isSoundOn) {
      soundToggleBtn.classList.add("sound-on");
    } else {
      soundToggleBtn.classList.add("sound-off");
      stopCountdownAudio();
    }
  }

  renderSoundButton();

  soundToggleBtn.addEventListener("click", () => {
    gameState.isSoundOn = !gameState.isSoundOn;
    renderSoundButton();
  });
}

export function setupEndOverlayButtons() {
  playAgainBtn?.addEventListener("click", () => {
    resetGame();
  });

  changeDifficultyBtn?.addEventListener("click", () => {
    showStartScreen();
  });
}