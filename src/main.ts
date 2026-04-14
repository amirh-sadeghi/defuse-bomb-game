import "./style.css";
import {
  setupControlButtons,
  setupEndOverlayButtons,
  setupKeyboardControls,
  setupKeypad,
  setupSoundToggle,
  setupStartScreen,
} from "./handlers";

setupKeypad();
setupControlButtons();
setupKeyboardControls();
setupSoundToggle();
setupStartScreen();
setupEndOverlayButtons();