import {
  applyCanvasOpacity,
  isClickWithinBounds,
  overlay,
} from "../../utils/utils.js";
import { ctx, scaleFactor } from "../../main.js";
import { Sprite } from "../../classes/Sprite.js";
import { appState as app } from "../../app_state.js";
import { agilityState as aState } from "./agility_state.js";

// U.I.

export function drawCenteredText(text) {
  ctx.save();
  ctx.fillStyle = "black";
  const FontSize = 12 * scaleFactor;
  ctx.font = `${FontSize}px RetroGaming`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let centerX = app.canvas.W / 2;
  let centerY = app.canvas.H / 2;

  ctx.fillText(text, centerX, centerY);
  ctx.restore();
}

// Images

export function initImages() {
  aState.plaque.image = new Sprite({
    position: { x: 8 * scaleFactor, y: 0 },
    imageSrc: "../images/plaque_back.svg",
  });
}

export function initBounds() {
  aState.plaque.bounds = {
    x: 8 * scaleFactor,
    y: 7 * scaleFactor,
    width: 20 * scaleFactor,
    height: 13 * scaleFactor,
  };
}

export function drawBackPlaque() {
  aState.plaque.image.drawSprite();
}

// Interactivity

export function handlePlaqueClick(mouseX, mouseY) {
  if (isClickWithinBounds(mouseX, mouseY, aState.plaque.bounds)) {
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.2,
      onUpdate: applyCanvasOpacity,
      onComplete: () => {
        app.modes.current = app.modes.all.STARTING_MENU;
        app.initActive.startingMenu = true;
        app.initActive.agility = false;
        overlay.opacity = 0;
        aState.isGameReseted = false;
      },
    });
  }
}
