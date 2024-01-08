import {
  ctx,
  canvas,
  W,
  H,
  scaleFactor,
  ActiveInits,
  currentMode,
  Modes
} from "../main.js";
import { colors } from "../style.js";

export let restart = (function () {
  ("use strict");

  let arrowImage = new Image();
  arrowImage.src = "../images/restart/selectedIcon.svg";

  // for drawPlaque()

  function init() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = colors.bg_light;
    ctx.fillRect(0, 0, W, H);
    highScoreInfo({ gameMode: "cardio", highScore: 0 });
    GameOverGroup({ score: 12, maxScore: 25 });
    PlayAgainGroup(true, arrowImage);
  }

  function highScoreInfo({ gameMode, highScore }) {
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

  function GameOverGroup({ score, maxScore }) {
    ctx.save();

    //Global Stylings
    const marginX = 47 * scaleFactor;
    const centerY = H / 2;
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
    const centerY = H / 2;
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
    ctx.font = `${8 * scaleFactor}px RetroGaming`;
    ctx.fillStyle = isYesSelected ? colors.yellow : colors.yellow_disabled;
    ctx.strokeStyle = isYesSelected ? colors.brown : colors.brown_disabled;
    ctx.lineWidth = 2 * scaleFactor;

    let yesText = "YES";
    ctx.strokeText(yesText, marginX, centerY + lineSpacing);
    ctx.fillText(yesText, marginX, centerY + lineSpacing);

    // For Score Info
    const TextWidth = ctx.measureText(yesText).width;
    ctx.fillStyle = isYesSelected ? colors.yellow_disabled : colors.yellow;
    ctx.strokeStyle = isYesSelected ? colors.brown_disabled : colors.brown;
    let noText = "NO";
    ctx.strokeText(
      noText,
      marginX + TextWidth + paddingX,
      centerY + lineSpacing
    );
    ctx.fillText(noText, marginX + TextWidth + paddingX, centerY + lineSpacing);

    // For Image Drawing

    const imageX = isYesSelected ? 169 : 202;
    const imageY = 100;
    const imageWidth = image.width * scaleFactor;
    const imageHeight = image.height * scaleFactor;

    const drawSelectedImage = () => {
      ctx.drawImage(
        image,
        imageX * scaleFactor,
        imageY * scaleFactor,
        imageWidth,
        imageHeight
      );
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

  return {
    init: init,
  };
})();
