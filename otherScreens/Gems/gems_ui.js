import { appState as app } from "../../app_state.js";
import { Sprite } from "../../classes/Sprite.js";
import { scaleFactor } from "../../main.js";
import {
  applyCanvasOpacity,
  isClickWithinBounds,
  overlay,
} from "../../utils/utils.js";
import { gemsState as gState } from "./gems_state.js";

// IMAGES

export function initImages() {
  gState.plaque.image = new Sprite({
    position: { x: 8 * scaleFactor, y: 0 },
    imageSrc: "../images/plaque_back.svg",
  });
}

export function initBounds() {
  gState.plaque.bounds = {
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
}
