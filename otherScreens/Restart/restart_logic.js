import { appState as app } from "../../app_state.js";
import { cState } from "../../gameModes/Cardio/cardio_state.js";
import { ctx, canvas, scaleFactor } from "../../main.js";
import { colors } from "../../utils/style.js";
import {
  applyCanvasOpacity,
  isClickWithinBounds,
  overlay,
} from "../../utils/utils.js";
import { restartState as rState } from "./restart_state.js";
import {
  GameOverGroup,
  PlayAgainGroup,
  drawNextButton,
  highScoreText,
} from "./restart_ui.js";

//
//
// IMPROVE IN FUTURE -> To use all restart_state.js
//
//

export const restart = (function () {
  ("use strict");

  rState.options.arrow.image.src = "../images/restart/selectedIcon.svg";

  let cardioHighScore = "cardio_high_score";
  let currentCardioHighScore = parseInt(
    localStorage.getItem(cardioHighScore),
    10
  );

  // for drawPlaque()

  function init() {
    if (!rState.isRestartReseted) {
      window.addEventListener("keydown", handleKeyPress, handleYesNoClick);
      window.addEventListener("click", handleClick);
      rState.isRestartReseted = true;
    }
    updateGame();
  }

  function updateGame() {
    const canvas = [0, 0, app.canvas.W, app.canvas.H];
    ctx.clearRect(...canvas);
    ctx.fillStyle = colors.bg_light;
    ctx.fillRect(...canvas);
    GameOverGroup({
      score: cState.stats.gameOver.score,
      maxScore: cState.stats.gameOver.maxScore,
    });
    highScoreText({
      gameMode: cState.stats.gameOver.gameMode,
      highScore: currentCardioHighScore,
    });
    PlayAgainGroup(rState.options.isYesSelected, rState.options.arrow.image);
    setHighScore();
    drawNextButton();
  }

  function toggleSelection() {
    rState.options.isYesSelected = !rState.options.isYesSelected;
  }

  function setHighScore() {
    if (cState.stats.gameOver.score > currentCardioHighScore) {
      localStorage.setItem(
        cardioHighScore,
        cState.stats.gameOver.score.toString()
      );
      currentCardioHighScore = cState.stats.gameOver.score;
    } else if (isNaN(currentCardioHighScore)) {
      currentCardioHighScore = 0;
      localStorage.setItem(cardioHighScore, "0");
    }
  }

  function handleKeyPress(event) {
    if (app.initActive.restart) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        toggleSelection();
      } else if (event.key === "Enter") {
        if (rState.options.isYesSelected) {
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.5,
            onUpdate: applyCanvasOpacity,
            onComplete: () => {
              app.modes.current = app.modes.all.CARDIO;
              app.initActive.cardio = true;
              app.initActive.restart = false;
              overlay.opacity = 0;
            },
          });
        } else {
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.5,
            onUpdate: applyCanvasOpacity,
            onComplete: () => {
              app.modes.current = app.modes.all.STARTING_MENU;
              app.initActive.startingMenu = true;
              app.initActive.restart = false;
              overlay.opacity = 0;
            },
          });
        }
      }
    }
  }

  /* Handles mouse click events */

  function handleClick(event) {
    if (app.initActive.restart) {
      let mouseX = event.clientX - canvas.getBoundingClientRect().left;
      let mouseY = event.clientY - canvas.getBoundingClientRect().top;

      handleYesNoClick(mouseX, mouseY);
      handleNextClick(mouseX, mouseY);
    }
  }

  function handleYesNoClick(mouseX, mouseY) {
    const yesButtonBounds = rState.options.bounds[0];
    const noButtonBounds = rState.options.bounds[1];

    if (isClickWithinBounds(mouseX, mouseY, yesButtonBounds)) {
      rState.options.isYesSelected = true;
    } else if (isClickWithinBounds(mouseX, mouseY, noButtonBounds)) {
      rState.options.isYesSelected = false;
    }
  }

  function handleNextClick(mouseX, mouseY) {
    if (isClickWithinBounds(mouseX, mouseY, rState.button.bounds)) {
      if (rState.options.isYesSelected) {
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.5,
          onUpdate: applyCanvasOpacity,
          onComplete: () => {
            app.modes.current = app.modes.all.CARDIO;
            app.initActive.cardio = true;
            app.initActive.restart = false;
            overlay.opacity = 0;
          },
        });
      } else {
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.5,
          onUpdate: applyCanvasOpacity,
          onComplete: () => {
            app.modes.current = app.modes.all.STARTING_MENU;
            app.initActive.startingMenu = true;
            app.initActive.restart = false;
            overlay.opacity = 0;
          },
        });
      }
    }
  }

  return {
    init: init,
  };
})();
