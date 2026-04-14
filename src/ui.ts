import { gameState } from "./state";
import { formatTime } from "./logic";

const slots = document.querySelector<HTMLDivElement>("#slots");
const attemptsEl = document.querySelector<HTMLDivElement>("#attempts");
const timerEl = document.querySelector<HTMLDivElement>("#timer");
const statusMessage = document.querySelector<HTMLDivElement>("#status-message");
const historyEl = document.querySelector<HTMLDivElement>("#history");
const difficultyBadge =
  document.querySelector<HTMLDivElement>("#difficulty-badge");
const enterBtn = document.querySelector<HTMLButtonElement>("#enter-btn");
const deleteBtn = document.querySelector<HTMLButtonElement>("#delete-btn");

const endOverlay = document.querySelector<HTMLDivElement>("#end-overlay");
const endTitle = document.querySelector<HTMLHeadingElement>("#end-title");
const endMessage = document.querySelector<HTMLParagraphElement>("#end-message");
const endDifficulty =
  document.querySelector<HTMLSpanElement>("#end-difficulty");
const endCode = document.querySelector<HTMLSpanElement>("#end-code");
const endAttemptsUsed =
  document.querySelector<HTMLSpanElement>("#end-attempts-used");
const endAttemptsLeft =
  document.querySelector<HTMLSpanElement>("#end-attempts-left");
const endTimeLeft =
  document.querySelector<HTMLSpanElement>("#end-time-left");

export function renderSlots() {
  if (!slots) return;

  slots.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");

    const digit = gameState.currentGuess[i];
    slot.textContent = digit !== undefined ? digit.toString() : "•";

    if (digit !== undefined) {
      slot.classList.add("slot-filled");
    }

    slots.appendChild(slot);
  }
}

export function renderAttempts() {
  if (!attemptsEl) return;
  attemptsEl.textContent = `${gameState.attemptsLeft}`;
}

export function updateTimerDangerState() {
  const timerBox = timerEl?.closest(".panel-box");
  if (!timerBox) return;

  if (gameState.timeLeft <= 30) {
    timerBox.classList.add("panel-danger");
  } else {
    timerBox.classList.remove("panel-danger");
  }
}

export function renderTimer() {
  if (!timerEl) return;
  timerEl.textContent = formatTime(gameState.timeLeft);
  updateTimerDangerState();
}

export function renderStatusMessage(
  message: string,
  type: "default" | "success" | "warning" | "danger" = "default"
) {
  if (!statusMessage) return;

  statusMessage.textContent = message;
  statusMessage.classList.remove(
    "status-success",
    "status-warning",
    "status-danger"
  );

  if (type === "success") {
    statusMessage.classList.add("status-success");
  }

  if (type === "warning") {
    statusMessage.classList.add("status-warning");
  }

  if (type === "danger") {
    statusMessage.classList.add("status-danger");
  }
}

export function renderHistory() {
  if (!historyEl) return;

  historyEl.innerHTML = "";

  for (const item of gameState.historyList) {
    const row = document.createElement("div");
    row.classList.add("history-row");
    row.innerHTML = item;
    historyEl.appendChild(row);
  }
}

export function renderDifficultyBadge() {
  if (!difficultyBadge) return;

  difficultyBadge.textContent = gameState.currentDifficulty.toUpperCase();

  difficultyBadge.classList.remove(
    "badge-training",
    "badge-tactical",
    "badge-critical"
  );

  if (gameState.currentDifficulty === "training") {
    difficultyBadge.classList.add("badge-training");
  }

  if (gameState.currentDifficulty === "tactical") {
    difficultyBadge.classList.add("badge-tactical");
  }

  if (gameState.currentDifficulty === "critical") {
    difficultyBadge.classList.add("badge-critical");
  }
}

export function triggerSlotsShake() {
  const slots = document.querySelector<HTMLDivElement>("#slots");
  if (!slots) return;

  slots.classList.remove("shake");
  void slots.offsetWidth;
  slots.classList.add("shake");
}

export function updateControlButtonsState() {
  if (enterBtn) {
    enterBtn.disabled = gameState.currentGuess.length < 5 || gameState.isGameOver;
  }

  if (deleteBtn) {
    deleteBtn.disabled = gameState.currentGuess.length === 0 || gameState.isGameOver;
  }
}

export function showEndOverlay() {
  if (
    !endOverlay ||
    !endTitle ||
    !endMessage ||
    !endDifficulty ||
    !endCode ||
    !endAttemptsLeft ||
    !endAttemptsUsed ||
    !endTimeLeft
  ) {
    return;
  }

  endOverlay.classList.remove("hidden");

  if (gameState.endState === "win") {
    endTitle.textContent = "Bomb Defused";
    endMessage.textContent = "Mission completed successfully.";
  } else {
    endTitle.textContent = "Detonation Triggered";
    endMessage.textContent = "Mission failed.";
  }

  endDifficulty.textContent = gameState.currentDifficulty.toUpperCase();
  endCode.textContent = gameState.secretCode.join("");
  endAttemptsLeft.textContent = String(gameState.attemptsLeft);
  endAttemptsUsed.textContent = String(
    gameState.initialAttempts - gameState.attemptsLeft
  );
  endTimeLeft.textContent = formatTime(gameState.timeLeft);
}

export function hideEndOverlay() {
  if (!endOverlay) return;
  endOverlay.classList.add("hidden");
}

export function triggerWinSlotsGlow() {
  if (!slots) return;

  const slotItems = slots.querySelectorAll<HTMLDivElement>(".slot");
  slotItems.forEach((slot) => {
    slot.classList.add("slot-win");
  });
}