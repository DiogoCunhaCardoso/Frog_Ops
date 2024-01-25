import { Sprite } from "../../classes/Sprite.js";
import { appState as app } from "../../app_state.js";
import { skinsState as skState } from "./skins_state.js";
import { ctx, scaleFactor } from "../../main.js";
import { drawButton } from "../../utils/utils.js";
import { colors } from "../../utils/style.js";
import { skins } from "./skins_logic.js";

// IMAGES

export function initImages() {
  const coinCountLength = ctx.measureText(skState.coinCount).width;
  //
  const bg = skState.ui.background;
  bg.image = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: bg.imagePath,
  });
  const coin = skState.ui.coin;
  coin.image = new Sprite({
    position: {
      x: 12 * scaleFactor + coinCountLength * scaleFactor,
      y: 14 * scaleFactor,
    },
    imageSrc: coin.imagePath,
  });
  const close = skState.ui.closeIcon;
  close.image = new Sprite({
    position: { x: app.canvas.W - 23 * scaleFactor, y: 12 * scaleFactor },
    imageSrc: close.imagePath,
  });
}

export function initBounds() {
  skState.ui.btn.closebounds = {
    x: app.canvas.W - 23 * scaleFactor,
    y: 12 * scaleFactor,
    width: 11 * scaleFactor,
    height: 11 * scaleFactor,
  };
}

export function drawBgImage() {
  skState.ui.background.image.drawSprite();
}

export function drawUI() {
  ctx.save();
  const FontSize = 5 * scaleFactor;
  ctx.font = `${skState.buyFail ? FontSize * 1.2 : FontSize}px RetroGaming`;
  ctx.fillStyle = skState.buyFail ? "red" : "black";
  ctx.fillText(
    skState.coinCount,
    skState.buyFail ? 11 * scaleFactor : 12 * scaleFactor,
    skState.buyFail ? 19.5 * scaleFactor : 19 * scaleFactor
  );

  // Draw other UI elements
  skState.ui.coin.image.drawSprite();
  skState.ui.closeIcon.image.drawSprite();
  ctx.restore();
}

// BUTTONS FOR NOW

export function drawActionButton() {
  ctx.save();
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

  const index = skState.skins.selectedIndex;
  let btnText, btnColors;
  if (skState.skins.currentlyUsingIndex === index) {
    btnText = "EQUIPPED";
    btnColors = {
      light: colors.army_green_light,
      dark: colors.army_green,
    };
  } else if (skins.isSkinPurchased(index)) {
    btnText = "EQUIP";
  } else {
    btnText = "BUY";
  }

  drawButton({
    text: btnText,
    ...skState.ui.btn.bounds,
    ...(btnColors || {}),
  });
  ctx.restore();
}
