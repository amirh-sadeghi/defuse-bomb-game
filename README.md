# Code Red: Defuse Protocol

A browser-based puzzle game where the player must defuse a bomb by guessing a 5-digit code before time runs out.

Built with HTML, CSS, and TypeScript using Vite and vanilla JavaScript.

---

## Gameplay

The player is presented with a locked device that requires a 5-digit code.
The objective is to guess the correct code within the available time and attempt limits.

Each guess provides feedback:

* Correct digit in the correct position
* Correct digit in the wrong position
* Digit not present in the code

This feedback allows the player to logically deduce the correct combination.

---

## Difficulty Modes

### Training

* Time: 2 minutes
* Attempts: 10
* No duplicate digits
* Full feedback
* No penalties

Designed for learning and understanding the system.

---

### Tactical

* Time: 3 minutes
* Attempts: 10
* Duplicate digits allowed
* Full feedback
* No penalties

Balanced difficulty with full information.

---

### Critical

* Time: 4 minutes
* Attempts: 20
* Duplicate digits allowed
* Partial feedback only
* 10-second penalty for each incorrect guess

Designed for high-pressure gameplay with limited information.

---

## Features

* Input via keyboard and on-screen keypad
* Sound system with toggle control
* Countdown audio in the final seconds
* Explosion sound on failure
* Attempt history with feedback
* Dynamic UI behavior (buttons enable/disable based on state)
* Different rules depending on difficulty
* Best score stored using localStorage
* End-game overlay with statistics:

  * Revealed code
  * Attempts used
  * Remaining time

---

## Game Mechanics

* The code is randomly generated for each round
* In Training mode, digits cannot repeat
* In Tactical and Critical modes, repetition is allowed
* The game ends when:

  * The correct code is guessed
  * Attempts reach zero
  * Time expires

---

## Tech Stack

* Vite
* TypeScript
* Vanilla JavaScript (DOM API)
* CSS (no frameworks)

---

## Getting Started

```bash
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## Project Structure

```
src/
├── main.ts        # Application entry point
├── handlers.ts    # Game logic and event handling
├── ui.ts          # UI rendering
├── logic.ts       # Core game rules
├── state.ts       # Global state management
├── config.ts      # Difficulty configuration
├── types.ts       # Type definitions
```

---

## Development Notes

For debugging purposes, you can log the secret code:

```ts
console.log("Secret code:", gameState.secretCode.join(""));
```

Remove this line before production.

---

## Future Improvements

* Difficulty-based visual themes
* Leaderboard system
* Improved mobile experience
* Enhanced animations
* Custom sound options

---

## License

This project is open source and free to use.

---

## Author

Amir
