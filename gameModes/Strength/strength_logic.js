import { appState as app } from "../../app_state.js";
import { ctx, canvas } from "../../main.js";
import {
  drawBackPlaque,
  drawCenteredText,
  handlePlaqueClick,
  initBounds,
  initImages,
} from "./strength_ui.js";
import { strengthState as sState } from "./strength_state.js";

export const strength = (function () {
  ("use strict");

  function init() {
    if (!sState.isGameReseted) {
      initImages();
      initBounds();
      canvas.addEventListener("click", handleClick);
      sState.isGameReseted = true;
    }
    updateGame();
  }

  // LOOP

  function updateGame() {
    const canvas = [0, 0, app.canvas.W, app.canvas.H];
    ctx.clearRect(...canvas);
    ctx.fillStyle = "white";
    ctx.fillRect(...canvas);
    drawBackPlaque();
    drawCenteredText("Strength Soon");
  }

  // INTERACTIVITY

  function handleClick(event) {
    if (app.initActive.strength) {
      let mouseX = event.clientX - canvas.getBoundingClientRect().left;
      let mouseY = event.clientY - canvas.getBoundingClientRect().top;

      handlePlaqueClick(mouseX, mouseY);
    }
  }
  return {
    init: init,
  };
})();
