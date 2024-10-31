import { appState as app } from "../app_state.js";
import { ctx, canvas, scaleFactor } from "../main.js";
import {
  overlay,
  applyCanvasOpacity,
  isClickWithinBounds,
  drawButton,
} from "../utils/utils.js";
export const optionsMenu = (function () {
  ("use strict");

  let buttonGemsBounds = {};
  let buttonSkinsBounds = {};
  let buttonCloseBounds = {};

  function init() {
    ctx.clearRect(0, 0, app.canvas.W, app.canvas.H);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, app.canvas.W, app.canvas.H);
    document.addEventListener("click", handleClicks);
    drawGemsButton();
    drawSkinsButton();
    drawCloseButton();
  }

  /* DRAW U.I. */

  function drawGemsButton() {
    const bounds = {
      x: app.canvas.W / 2 - (40 * scaleFactor) / 2,
      y: 71 * scaleFactor,
      width: 40 * scaleFactor,
      height: 10 * scaleFactor,
    };

    buttonGemsBounds = bounds;
    drawButton({ text: "Gems", ...bounds });
  }

  function drawSkinsButton() {
    const bounds = {
      x: app.canvas.W / 2 - (40 * scaleFactor) / 2,
      y: 94 * scaleFactor,
      width: 40 * scaleFactor,
      height: 10 * scaleFactor,
    };

    buttonSkinsBounds = bounds;
    drawButton({ text: "Skins", ...bounds });
  }

  function drawCloseButton() {
    const bounds = {
      x: 187 * scaleFactor,
      y: 54 * scaleFactor,
      width: 10 * scaleFactor,
      height: 10 * scaleFactor,
    };

    buttonCloseBounds = bounds;
    drawButton({ text: "X", ...bounds });
  }

  /* INTERACTIVITY */

  function handleClicks(event) {
    if (app.initActive.optionsMenu) {
      let mouseX = event.clientX - canvas.getBoundingClientRect().left;
      let mouseY = event.clientY - canvas.getBoundingClientRect().top;

      handleButtonClicks(mouseX, mouseY);
    }
  }

  function handleButtonClicks(mouseX, mouseY) {
    // Plaque | Gems
    if (isClickWithinBounds(mouseX, mouseY, buttonGemsBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.2,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          app.modes.current = app.modes.all.GEMS;
          app.initActive.optionsMenu = false;
          app.initActive.gems = true;
          overlay.opacity = 0;
        },
      });
    }

    // Plaque | Skins
    if (isClickWithinBounds(mouseX, mouseY, buttonSkinsBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.2,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          app.modes.current = app.modes.all.SKINS;
          app.initActive.optionsMenu = false;
          app.initActive.skins = true;
          overlay.opacity = 0;
        },
      });
    }

    // Button Close

    if (isClickWithinBounds(mouseX, mouseY, buttonCloseBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.2,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          app.modes.current = app.modes.all.STARTING_MENU;
          app.initActive.optionsMenu = false;
          app.initActive.startingMenu = true;
          overlay.opacity = 0;
        },
      });
    }
  }

  return {
    init: init,
  };
})();
