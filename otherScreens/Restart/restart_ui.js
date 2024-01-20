import { ctx, scaleFactor } from "../../main.js";
import { drawButton } from "../../utils/utils.js";
import { appState as app } from "../../app_state.js";
import { restartState as rState } from "./restart_state.js";
import { colors, texts } from "../../utils/style.js";

// STATS

export function highScoreText({ gameMode = "", highScore = 0 }) {
  ctx.save();
  // GLOBAL STYLES
  ctx.font = `${6 * scaleFactor}px RetroGaming`;
  ctx.lineWidth = 2 * scaleFactor;
  ctx.strokeStyle = colors.brown_disabled;

  // INFO TEXT
  ctx.fillStyle = colors.white_disabled;
  const marginX = 10 * scaleFactor;
  const marginY = 14 * scaleFactor;
  let highScoreText = `${gameMode.toUpperCase()} HI-SCORE :`;

  ctx.strokeText(highScoreText, marginX, marginY);
  ctx.fillText(highScoreText, marginX, marginY);

  // SCORE TEXT
  ctx.fillStyle = colors.yellow_disabled;
  const TextWidth = ctx.measureText(highScoreText).width;
  const padding = 4 * scaleFactor;
  const scoreMarginX = marginX + padding + TextWidth;

  ctx.strokeText(highScore, scoreMarginX, marginY);
  ctx.fillText(highScore, scoreMarginX, marginY);
  ctx.restore();
}

export function GameOverGroup({ score = 0, maxScore = 0 }) {
  ctx.save();
  // GLOBAL STYLES
  const marginX = 47 * scaleFactor;
  const centerY = app.canvas.H / 2;
  const paddingX = 4 * scaleFactor;
  const lineSpacing = 16 * scaleFactor;

  // GAME OVER TEXT
  texts.highlightStyle.applyStyle(ctx, scaleFactor);
  const gameOverText = "GAME OVER";

  ctx.strokeText(gameOverText, marginX, centerY);
  ctx.fillText(gameOverText, marginX, centerY);
  ctx.restore();

  // SCORE TEXT
  ctx.save();
  texts.detailTextStyle.applyStyle(ctx, scaleFactor);
  const scoreText = "SCORE :";
  const scoreY = centerY + lineSpacing;

  ctx.strokeText(scoreText, marginX, scoreY);
  ctx.fillText(scoreText, marginX, scoreY);

  // SCORE VALUE
  const TextWidth = ctx.measureText(scoreText).width;
  const scoreValueX = marginX + TextWidth + paddingX;
  let resultText = `${score} / `;

  ctx.strokeText(resultText, scoreValueX, scoreY);
  ctx.fillText(resultText, scoreValueX, scoreY);

  // MAX SCORE VALUE
  const ResultTextWidth = ctx.measureText(resultText).width;
  const maxScoreX = marginX + TextWidth + paddingX + ResultTextWidth;
  let maxScoreText = maxScore;
  ctx.strokeText(maxScoreText, maxScoreX, scoreY);
  ctx.fillText(maxScoreText, maxScoreX, scoreY);
  ctx.restore();
}

export function PlayAgainGroup(isYesSelected = true, image) {
  ctx.save();

  // GLOBAL STYLES
  const marginX = 177 * scaleFactor;
  const centerY = app.canvas.H / 2;
  const paddingX = 14 * scaleFactor;
  const lineSpacing = 16 * scaleFactor;

  // PLAY AGAIN TEXT
  texts.highlightStyle.applyStyle(ctx, scaleFactor);
  const playAgainText = "PLAY AGAIN?";
  
  ctx.strokeText(playAgainText, marginX, centerY);
  ctx.fillText(playAgainText, marginX, centerY);
  ctx.restore();

  // OPTION 'YES' TEXT
  ctx.save();
  const fontSize = texts.detailTextStyle.fontSize * scaleFactor;
  ctx.font = `${fontSize}px RetroGaming`;
  const lineWidth = (ctx.lineWidth = 2 * scaleFactor);

  let fillColor = isYesSelected ? colors.yellow : colors.yellow_disabled;
  let strokeColor = isYesSelected ? colors.brown : colors.brown_disabled;
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;

  const yesText = "YES";
  const yesTextWidth = ctx.measureText(yesText).width;
  const yesTextY = centerY + lineSpacing;
  let yesBounds = {
    x: marginX - lineWidth / 2,
    y: yesTextY - fontSize,
    width: yesTextWidth + lineWidth,
    height: fontSize + lineWidth,
  };

  if (rState.options.bounds.length < 1) rState.options.bounds.push(yesBounds);
  ctx.strokeText(yesText, marginX, yesTextY);
  ctx.fillText(yesText, marginX, yesTextY);

  // OPTION 'NO' TEXT
  fillColor = isYesSelected ? colors.yellow_disabled : colors.yellow;
  strokeColor = isYesSelected ? colors.brown_disabled : colors.brown;
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;

  const noText = "NO";
  const noTextWidth = ctx.measureText(noText).width;
  const noTextX = marginX + yesTextWidth + paddingX;
  const noTextY = centerY + lineSpacing;
  let noBounds = {
    x: noTextX - lineWidth / 2,
    y: noTextY - fontSize,
    width: noTextWidth + lineWidth,
    height: fontSize + lineWidth,
  };

  if (rState.options.bounds.length < 2) rState.options.bounds.push(noBounds);
  ctx.strokeText(noText, noTextX, noTextY);
  ctx.fillText(noText, noTextX, noTextY);

  // ARROW IMAGE

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

// BUTTON

export function drawNextButton() {
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

  rState.button.bounds = bounds;
  drawButton({ text: "Next", ...bounds });
}

// IMAGES

/* export function initImages() {
  // Arrow Selected
  const arrow = rState.options.arrow;
  arrow.image = new Sprite({
    position: { x: 0 * scaleFactor, y: 0 },
    imageSrc: arrow.imagePath,
  });
}

export function initBounds() {
  rState.button.bounds = {
    x: 8 * scaleFactor,
    y: 7 * scaleFactor,
    width: 20 * scaleFactor,
    height: 13 * scaleFactor,
  };
}

export function drawBackPlaque() {
  gState.plaque.image.drawSprite();
}

// INTERACTIVITY

export function handlePlaqueClick(mouseX, mouseY) {
  if (isClickWithinBounds(mouseX, mouseY, gState.plaque.bounds)) {
    gsap.to(overlay, {
      opacity: 1,
      duration: 1,
      onUpdate: applyCanvasOpacity,
      onComplete: () => {
        app.modes.current = app.modes.all.STARTING_MENU;
        app.initActive.startingMenu = true;
        app.initActive.gems = false;
        overlay.opacity = 0;
        gState.isGemsReseted = false;
      },
    });
  }
} */
