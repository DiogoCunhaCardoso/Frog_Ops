import { appState as app } from "../app_state.js";
import { cState } from "../gameModes/Cardio/cardio_state.js";
import { ctx, canvas, scaleFactor } from "../main.js";
import { texts } from "../utils/style.js";
import {
  overlay,
  applyCanvasOpacity,
  isClickWithinBounds,
  drawButton,
} from "../utils/utils.js";

export const success = (function () {
  ("use strict");

  let buttonBounds = {};

  function init() {
    ctx.clearRect(0, 0, app.canvas.W, app.canvas.H);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, app.canvas.W, app.canvas.H);
    ctx.fillStyle = "black";
    YouWonGroup({
      score: cState.stats.gameWon.score,
      maxScore: cState.stats.gameWon.score,
      gameName: cState.stats.gameWon.gameMode,
    });
    drawGemsButton();
    drawGem();
    canvas.addEventListener("click", handleClick);
  }

  function drawGemsButton() {
    const bounds = {
      x: app.canvas.W / 2 - (40 * scaleFactor) / 2,
      y: 132 * scaleFactor,
      width: 40 * scaleFactor,
      height: 10 * scaleFactor,
    };

    buttonBounds = bounds;
    drawButton({ text: "Next", ...bounds });
  }

  function YouWonGroup({ score = 0, maxScore = 0, gameName = "disabled" }) {
    ctx.save();

    //Global Stylings
    const centerX = app.canvas.W / 2;

    // 'For You Won' Text
    texts.highlightStyle.applyStyle(ctx, scaleFactor);

    const youWonText = "YOU WON";
    const youWonWidth = ctx.measureText(youWonText).width;
    const youWonTextX = centerX - youWonWidth / 2;
    ctx.strokeText(youWonText, youWonTextX, 105 * scaleFactor);
    ctx.fillText(youWonText, youWonTextX, 105 * scaleFactor);
    ctx.restore();

    drawGem();

    // For Score Text
    ctx.save();
    texts.detailTextStyle.applyStyle(ctx, scaleFactor);

    let resultText = `SCORE: ${score} / ${maxScore}`;
    const totalWidth = ctx.measureText(resultText).width;
    const resultTextX = centerX - totalWidth / 2;

    ctx.strokeText(resultText, resultTextX, 122 * scaleFactor);
    ctx.fillText(resultText, resultTextX, 122 * scaleFactor);

    ctx.restore();
  }

  function drawGem(gameName = "cardioGem") {
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
      app.canvas.W / 2 - (gemImage.width * scaleFactor) / 2,
      32 * scaleFactor,
      gemImage.width * scaleFactor,
      gemImage.height * scaleFactor
    );
  }

  // Handles click events on the canvas.
  function handleClick(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handleButtonClick(mouseX, mouseY);
  }

  function handleButtonClick(mouseX, mouseY) {
    if (!app.initActive.success) {
      return;
    }
    if (isClickWithinBounds(mouseX, mouseY, buttonBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.2,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          app.modes.current = app.modes.all.GEMS;
          app.initActive.gems = true;
          app.initActive.success = false;
          overlay.opacity = 0;
        },
      });
    }
  }

  return {
    init: init,
  };
})();
