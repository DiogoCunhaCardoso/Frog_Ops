import { gameWonStats as stats } from "../gameModes/cardio.js";
import {
  ctx,
  canvas,
  W,
  H,
  scaleFactor,
  ActiveInits,
  currentMode,
  Modes,
} from "../main.js";
import { colors, texts } from "../style.js";
import { overlay, applyCanvasOpacity, isClickWithinBounds } from "../utils.js";
export let success = (function () {
  ("use strict");

  let buttonBounds = {};

  function init() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "black";
    YouWonGroup({
      score: stats?.score,
      maxScore: stats?.score,
      gameName: stats?.gameMode,
    });
    buttonBounds = {
      x: W / 2 - (40 * scaleFactor) / 2,
      y: 132 * scaleFactor,
      width: 40 * scaleFactor,
      height: 10 * scaleFactor,
    };
    drawButton({
      text: "Gems",
      x: W / 2 - (40 * scaleFactor) / 2,
      y: 132,
      width: 40,
      height: 10,
    });
    canvas.addEventListener("click", handleClick);
  }

  function YouWonGroup({ score = 0, maxScore = 0, gameName = "disabled" }) {
    ctx.save();

    //Global Stylings
    const centerX = W / 2;
    const centerY = H / 2;
    const lineSpacing = 16 * scaleFactor;

    // 'For You Won' Text
    texts.highlightStyle.applyStyle(ctx, scaleFactor);

    const youWonText = "YOU WON";
    const youWonWidth = ctx.measureText(youWonText).width;
    const youWonTextX = centerX - youWonWidth / 2;
    ctx.strokeText(youWonText, youWonTextX, 105 * scaleFactor);
    ctx.fillText(youWonText, youWonTextX, 105 * scaleFactor);
    ctx.restore();

    drawSpecificgGem(gameName);

    // For Score Text
    ctx.save();
    texts.detailTextStyle.applyStyle(ctx, scaleFactor);

    let resultText = `SCORE: ${score} / ${maxScore}`;
    const totalWidth = ctx.measureText(resultText).width;
    const resultTextX = centerX - totalWidth / 2;
    const resultTextY = centerY + lineSpacing;

    ctx.strokeText(resultText, resultTextX, 122 * scaleFactor);
    ctx.fillText(resultText, resultTextX, 122 * scaleFactor);

    ctx.restore();
  }

  function drawSpecificgGem(gameName) {
    const gemImages = {
      cardioGem: "../images/gems/gem_cardio.svg",
      agilityGem: "../images/gems/gem_agility.svg",
      strengthGem: "../images/gems/gem_strength.svg",
      disabled: "../images/gems/gem_inactive.svg",
    };

    let imgSrc = gemImages[gameName];
    let gemImage = new Image();

    gemImage.src = imgSrc;
    ctx.drawImage(
      gemImage,
      W / 2 - (gemImage.width * scaleFactor) / 2,
      32 * scaleFactor,
      gemImage.width * scaleFactor,
      gemImage.height * scaleFactor
    );
  }

  function drawButton({ text, x, y, width, height }) {
    ctx.save();
    // Draw the button background
    ctx.lineWidth = 2 * scaleFactor;
    ctx.strokeStyle = colors.brown;
    ctx.shadowColor = colors.brown;
    ctx.fillStyle = colors.yellow;
    ctx.shadowOffsetY = 1 * scaleFactor;
    ctx.strokeRect(
      x,
      y * scaleFactor,
      width * scaleFactor,
      height * scaleFactor
    );
    ctx.fillRect(x, y * scaleFactor, width * scaleFactor, height * scaleFactor);
    ctx.restore();

    // Draw the top part of the button
    ctx.fillStyle = "#FFE380";
    ctx.fillRect(
      x,
      y * scaleFactor,
      width * scaleFactor,
      (height / 3) * scaleFactor
    );

    // Text styling
    ctx.save();
    const fontSize = 5 * scaleFactor;
    ctx.font = `${fontSize}px RetroGaming`;
    ctx.fillStyle = colors.white;
    ctx.strokeStyle = colors.brown;
    ctx.shadowColor = colors.brown;
    ctx.lineWidth = 1.2 * scaleFactor;
    ctx.shadowOffsetY = 0.6 * scaleFactor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Calculate text position for centering
    const textX = x + (width * scaleFactor) / 2;
    const textY = y * scaleFactor + (height * scaleFactor) / 2;
    // Draw the text
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
    ctx.restore();
  }

  // Handles click events on the canvas.
  function handleClick(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handleButtonClick(mouseX, mouseY);
  }

  function handleButtonClick(mouseX, mouseY) {
    if (!ActiveInits.isSuccessActive) {
      return;
    }
    if (isClickWithinBounds(mouseX, mouseY, buttonBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          currentMode.mode = Modes.GEMS;
          ActiveInits.isGemsActive = true;
          ActiveInits.isSuccessActive = false;
          overlay.opacity = 0;
        },
      });
    }
  }

  return {
    init: init,
  };
})();
