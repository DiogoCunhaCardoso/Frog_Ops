import { appState as app } from "../../app_state.js";
import { ctx, canvas } from "../../main.js";
import {
  drawBackPlaque,
  drawCenteredText,
  handlePlaqueClick,
  initBounds,
  initImages,
} from "./agility_ui.js";
import { agilityState as aState } from "./agility_state.js";

export const agility = (function () {
  ("use strict");

  function init() {
    if (!aState.isGameReseted) {
      initImages();
      initBounds();
      canvas.addEventListener("click", handleClick);
      aState.isGameReseted = true;
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
    drawCenteredText("Agility Soon");
  }

  // INTERACTIVITY

  function handleClick(event) {
    if (app.initActive.agility) {
      let mouseX = event.clientX - canvas.getBoundingClientRect().left;
      let mouseY = event.clientY - canvas.getBoundingClientRect().top;

      handlePlaqueClick(mouseX, mouseY);
    }
  }
  return {
    init: init,
  };
})();
