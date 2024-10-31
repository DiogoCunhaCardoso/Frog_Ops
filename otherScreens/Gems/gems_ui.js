import { appState as app } from "../../app_state.js";
import { Sprite } from "../../classes/Sprite.js";
import { ctx, scaleFactor } from "../../main.js";
import { texts } from "../../utils/style.js";
import {
  applyCanvasOpacity,
  isClickWithinBounds,
  overlay,
} from "../../utils/utils.js";
import { gemsState as gState } from "./gems_state.js";

// IMAGES

export function initImages() {
  // PLAQUE
  gState.plaque.image = new Sprite({
    position: { x: 8 * scaleFactor, y: 0 },
    imageSrc: "../images/plaque_back.svg",
  });

  // GEMS
  /*  for (let i = 0; i < gState.gems.all.length; i++) {
    gState.gems.all[i].image = new Sprite({
      position: { x: 20 * scaleFactor, y: 0 },
      imageSrc: gState.gems.all[i].imagePath,
    });
  } */

  /* for (let i = 0; i < gState.gems.all.length; i++) {
    const gemWidth = 56;
    const gemHeight = 52;
    const gap = 24 * scaleFactor + gemHeight / 2;
    const offsetX = [-gap, 0, gap];
    const lineSpacing = 6 * scaleFactor;

    gState.gems.all[i].image = new Sprite({
      position: {
        x:
          app.canvas.W / 2 -
          (gemWidth / 2) * scaleFactor +
          offsetX[i] * scaleFactor,
        y: app.canvas.H / 2 - gemHeight - lineSpacing,
      },
      imageSrc: gState.gems.all[i].imagePath,
    });
  } */
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
      duration: 0.2,
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
