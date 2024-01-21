import { Sprite } from "../../classes/Sprite.js";
import { appState as app } from "../../app_state.js";
import { skinsState as skState } from "./skins_state.js";
import { ctx, scaleFactor } from "../../main.js";
import { drawButton } from "../../utils/utils.js";
import { colors } from "../../utils/style.js";

// IMAGES

export function initImages() {
  const bg = skState.ui.background;
  bg.image = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: bg.imagePath,
  });
  const coin = skState.ui.coin;
  coin.image = new Sprite({
    position: { x: 25 * scaleFactor, y: 14 * scaleFactor },
    imageSrc: coin.imagePath,
  });
  const close = skState.ui.closeIcon;
  close.image = new Sprite({
    position: { x: app.canvas.W - 23 * scaleFactor, y: 12 * scaleFactor },
    imageSrc: close.imagePath,
  });
}

export function drawBgImage() {
  skState.ui.background.image.drawSprite();
}

export function drawUI() {
  ctx.save();
  const FontSize = 5 * scaleFactor;
  ctx.font = `${FontSize}px RetroGaming`;
  ctx.fillStyle = "black";
  ctx.fillText("100", 12 * scaleFactor, 19 * scaleFactor);

  // Draw other UI elements
  skState.ui.coin.image.drawSprite();
  skState.ui.closeIcon.image.drawSprite();
  ctx.restore();
}

// BUTTONS FOR NOW

export function drawActionButton() {
  const buttonHeight = 12 * scaleFactor;
  const buttonWidth = 48 * scaleFactor;
  const buttonY = 132 * scaleFactor;
  const buttonX = app.canvas.W / 2 - buttonWidth / 2;

  skState.ui.btn.bounds = {
    x: buttonX,
    y: buttonY,
    width: buttonWidth,
    height: buttonHeight,
  };

  // Draw the button (assuming you have a drawButton function)
  if (skState.skins.currentlyUsingIndex === skState.skins.selectedIndex) {
    drawButton({
      text: "EQUIPPED",
      ...skState.ui.btn.bounds,
      light: colors.army_green_light,
      dark: colors.army_green,
    });
  } else drawButton({ text: "BUY", ...skState.ui.btn.bounds });
}
