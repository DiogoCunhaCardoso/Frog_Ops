import { appState as app } from "../app_state.js";
import { cState } from "../gameModes/Cardio/cardio_state.js";
import { ctx, canvas, scaleFactor } from "../main.js";
import { colors } from "../utils/style.js";
import {
  applyCanvasOpacity,
  drawButton,
  isClickWithinBounds,
  overlay,
} from "../utils/utils.js";

export const restart = (function () {
  ("use strict");

  const rState = {
    ui: {
      btnNextBounds: {},
    },
  };

  let arrowImage = new Image();
  arrowImage.src = "../images/restart/selectedIcon.svg";
  //
  let isYesSelected = true;
  let rectangles = []; // to interact with

  const highScores = {
    cardio: null,
    agility: null,
    strength: null,
  }; // not in use for now

  let cardioHighScore = "cardio_high_score";
  let currentCardioHighScore = parseInt(
    localStorage.getItem(cardioHighScore),
    10
  );

  // for drawPlaque()

  function init() {
    ctx.clearRect(0, 0, app.canvas.W, app.canvas.H);
    ctx.fillStyle = colors.bg_light;
    ctx.fillRect(0, 0, app.canvas.W, app.canvas.H);
    highScoreGroup({
      gameMode: cState.stats.gameOver.gameMode,
      highScore: currentCardioHighScore,
    });
    GameOverGroup({
      score: cState.stats.gameOver.score,
      maxScore: cState.stats.gameOver.maxScore,
    });
    PlayAgainGroup(isYesSelected, arrowImage);
    setHighScore();
    drawTouchButton();
    window.addEventListener("keydown", handleKeyPress, handleYesNoClick);
    window.addEventListener("click", handleClick);
  }

  function drawTouchButton() {
    const buttonHeight = 10 * scaleFactor;
    const margin = 16 * scaleFactor;
    const buttonWidth = 40 * scaleFactor;
    const buttonY = app.canvas.H - buttonHeight - margin;
    const buttonX = app.canvas.W - buttonWidth - margin;

    const bounds = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
    };

    rState.ui.btnNextBounds = bounds;
    drawButton({ text: "Next", ...bounds });
  }

  function toggleSelection() {
    isYesSelected = !isYesSelected;
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

  function highScoreGroup({ gameMode = "", highScore = 0 }) {
    ctx.save();

    //Global Stylings
    ctx.font = `${6 * scaleFactor}px RetroGaming`;
    ctx.lineWidth = 2 * scaleFactor;
    ctx.strokeStyle = colors.brown_disabled;

    // For Text Info
    ctx.fillStyle = colors.white_disabled;

    const marginX = 10 * scaleFactor;
    const marginY = 14 * scaleFactor;
    let highScoreText = `${gameMode.toUpperCase()} HI-SCORE :`;
    ctx.strokeText(highScoreText, marginX, marginY);
    ctx.fillText(highScoreText, marginX, marginY);

    // For Score Value
    ctx.fillStyle = colors.yellow_disabled;

    const TextWidth = ctx.measureText(highScoreText).width;
    const padding = 4 * scaleFactor;
    ctx.strokeText(highScore, marginX + padding + TextWidth, marginY);
    ctx.fillText(highScore, marginX + padding + TextWidth, marginY);
    ctx.restore();
  }

  function GameOverGroup({ score = 0, maxScore = 0 }) {
    ctx.save();

    //Global Stylings
    const marginX = 47 * scaleFactor;
    const centerY = app.canvas.H / 2;
    const paddingX = 4 * scaleFactor;
    const lineSpacing = 16 * scaleFactor;

    // For GameOver Text
    ctx.strokeStyle = colors.brown;
    ctx.font = `${12 * scaleFactor}px RetroGaming`;
    ctx.fillStyle = colors.white;
    ctx.lineWidth = 3 * scaleFactor;
    ctx.shadowColor = colors.brown;
    ctx.shadowOffsetY = 3 * scaleFactor;

    let gameOverText = "GAME OVER";
    ctx.strokeText(gameOverText, marginX, centerY);
    ctx.fillText(gameOverText, marginX, centerY);
    ctx.restore();

    // For Score
    ctx.save();
    ctx.strokeStyle = colors.brown;
    ctx.font = `${8 * scaleFactor}px RetroGaming`;
    ctx.fillStyle = colors.yellow;
    ctx.lineWidth = 2 * scaleFactor;

    let scoreText = "SCORE :";
    ctx.strokeText(scoreText, marginX, centerY + lineSpacing);
    ctx.fillText(scoreText, marginX, centerY + lineSpacing);

    // For Score Info
    const TextWidth = ctx.measureText(scoreText).width;
    let resultText = `${score} / `;
    ctx.strokeText(
      resultText,
      marginX + TextWidth + paddingX,
      centerY + lineSpacing
    );
    ctx.fillText(
      resultText,
      marginX + TextWidth + paddingX,
      centerY + lineSpacing
    );

    const ResultTextWidth = ctx.measureText(resultText).width;
    let maxScoreText = maxScore;
    ctx.strokeText(
      maxScoreText,
      marginX + TextWidth + paddingX + ResultTextWidth,
      centerY + lineSpacing
    );
    ctx.fillText(
      maxScoreText,
      marginX + TextWidth + paddingX + ResultTextWidth,
      centerY + lineSpacing
    );
    ctx.restore();
  }

  function PlayAgainGroup(isYesSelected = true, image) {
    ctx.save();

    //Global Stylings
    const marginX = 177 * scaleFactor;
    const centerY = app.canvas.H / 2;
    const paddingX = 14 * scaleFactor;
    const lineSpacing = 16 * scaleFactor;

    // For GameOver Text
    ctx.strokeStyle = colors.brown;
    ctx.font = `${12 * scaleFactor}px RetroGaming`;
    ctx.fillStyle = colors.white;
    ctx.lineWidth = 3 * scaleFactor;
    ctx.shadowColor = colors.brown;
    ctx.shadowOffsetY = 3 * scaleFactor;

    let playAgainText = "PLAY AGAIN?";
    ctx.strokeText(playAgainText, marginX, centerY);
    ctx.fillText(playAgainText, marginX, centerY);
    ctx.restore();

    // For Score
    ctx.save();

    const fontSize = 8 * scaleFactor;
    const lineWidth = (ctx.lineWidth = 2 * scaleFactor);
    ctx.font = `${fontSize}px RetroGaming`;
    ctx.fillStyle = isYesSelected ? colors.yellow : colors.yellow_disabled;
    ctx.strokeStyle = isYesSelected ? colors.brown : colors.brown_disabled;

    const yesText = "YES";
    const yesTextWidth = ctx.measureText(yesText).width;
    const yesTextY = centerY + lineSpacing;
    let yesRect = {
      x: marginX - lineWidth / 2,
      y: yesTextY - fontSize,
      width: yesTextWidth + lineWidth,
      height: fontSize + lineWidth,
    };
    if (rectangles.length < 2) rectangles.push(yesRect);
    ctx.strokeText(yesText, marginX, yesTextY);
    ctx.fillText(yesText, marginX, yesTextY);

    // For Score Info
    ctx.fillStyle = isYesSelected ? colors.yellow_disabled : colors.yellow;
    ctx.strokeStyle = isYesSelected ? colors.brown_disabled : colors.brown;
    const noText = "NO";
    const noTextWidth = ctx.measureText(noText).width;
    const noTextX = marginX + yesTextWidth + paddingX;
    const noTextY = centerY + lineSpacing;
    let noRect = {
      x: noTextX - lineWidth / 2,
      y: noTextY - fontSize,
      width: noTextWidth + lineWidth,
      height: fontSize + lineWidth,
    };
    if (rectangles.length < 2) rectangles.push(noRect);
    ctx.strokeText(noText, noTextX, noTextY);
    ctx.fillText(noText, noTextX, noTextY);

    // For Image Drawing

    const imageX = isYesSelected ? 169 * scaleFactor : 202 * scaleFactor;
    const imageY = 100 * scaleFactor;
    const imageWidth = image.width * scaleFactor;
    const imageHeight = image.height * scaleFactor;

    const drawSelectedImage = () => {
      ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    };

    if (image.complete) {
      drawSelectedImage();
    } else {
      // If the image is not yet loaded
      image.onload = () => {
        drawSelectedImage;
      };
    }
    ctx.restore();
  }

  function handleKeyPress(event) {
    if (app.initActive.restart) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        toggleSelection();
      } else if (event.key === "Enter") {
        if (isYesSelected) {
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
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handleYesNoClick(mouseX, mouseY);
    handleNextClick(mouseX, mouseY);
  }

  function handleYesNoClick(mouseX, mouseY) {
    const yesButtonBounds = rectangles[0];
    const noButtonBounds = rectangles[1];
    if (app.initActive.restart) {
      if (isClickWithinBounds(mouseX, mouseY, yesButtonBounds)) {
        isYesSelected = true;
      } else if (isClickWithinBounds(mouseX, mouseY, noButtonBounds)) {
        isYesSelected = false;
      }
    }
  }

  function handleNextClick(mouseX, mouseY) {
    if (app.initActive.restart) {
      if (isClickWithinBounds(mouseX, mouseY, rState.ui.btnNextBounds)) {
        if (isYesSelected) {
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

  return {
    init: init,
  };
})();
