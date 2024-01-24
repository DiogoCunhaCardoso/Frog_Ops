import { ctx, scaleFactor, canvas } from "../../main.js";
import {
  overlay,
  applyCanvasOpacity,
  isClickWithinBounds,
} from "../../utils/utils.js";
import { texts } from "../../utils/style.js";
import {
  handleNextPage,
  startingMenuState as state,
} from "./startingMenu_state.js";
import { Sprite } from "../../classes/Sprite.js";
import { appState as app } from "../../app_state.js";
import { skinsState as skState } from "../Skins/skins_state.js";

export const startingMenu = (function () {
  ("use strict");

  // GENERAL INIT

  function init() {
    if (!state.isPageReseted) {
      initSprites();
      initFrogSprites();
      initBounds();

      document.addEventListener("click", handleClicks);
      document.addEventListener("keydown", handleKeysPress);

      state.isPageReseted = true;
    }
    updatePage();
    console.log(skState.skins.currentlyUsingIndex);
  }

  // INITS

  function initSprites() {
    // BG
    const bgSprite = state.background.bg;
    bgSprite.image = new Sprite({
      position: { x: 0, y: 0 },
      imageSrc: bgSprite.imagePath,
    });

    const snowSprite = state.background.snow;
    snowSprite.image = new Sprite({
      position: { x: 0, y: 0 },
      imageSrc: snowSprite.imagePath,
      frameRate: snowSprite.totalFrames,
      frameBuffer: snowSprite.speed,
    });

    //Plaques
    const gemsPSprite = state.plaque.gem;
    gemsPSprite.image = new Sprite({
      position: { x: 14 * scaleFactor, y: 142 * scaleFactor },
      imageSrc: gemsPSprite.imagePath,
    });
    const nextPSprite = state.plaque.next;
    nextPSprite.image = new Sprite({
      position: { x: 271 * scaleFactor, y: 142 * scaleFactor },
      imageSrc: nextPSprite.imagePath,
    });
  }

  function initFrogSprites() {
    if (
      skState.skins.currentlyUsingIndex >= 0 &&
      skState.skins.currentlyUsingIndex < state.sprite.all.length
    ) {
      state.sprite.all.forEach((data, i) => {
        const sprite = new Sprite({
          position: { x: 44 * scaleFactor, y: 97 * scaleFactor },
          imageSrc: data.imagePath[skState.skins.currentlyUsingIndex],
          frameRate: data.totalFrames,
          frameBuffer: data.speed,
          scale: 2.6,
        });
        state.sprite.all[i].image = sprite;
      });
    } else {
      console.error(
        `No skins ImagePath for Index: ${skState.skins.currentlyUsingIndex}`
      );
    }
  }

  function initBounds() {
    state.plaque.nextBounds = {
      x: 271 * scaleFactor,
      y: 142 * scaleFactor,
      width: 28 * scaleFactor,
      height: 18 * scaleFactor,
    };

    state.plaque.gemBounds = {
      x: 14 * scaleFactor,
      y: 142 * scaleFactor,
      width: 18 * scaleFactor,
      height: 18 * scaleFactor,
    };
  }

  // DRAW SPRITES

  function drawBgImage() {
    state.background.bg.image.drawSprite();
  }

  function drawNextPlaque() {
    state.plaque.next.image.drawSprite();
  }

  function drawGemsPlaque() {
    state.plaque.gem.image.drawSprite();
  }

  function drawSnow() {
    const snowSprite = state.background.snow;
    snowSprite.image.drawSprite();
    snowSprite.image.updateFrames();
  }

  // UPDATES

  function updateFrogSprites() {
    ctx.save();
    const selectedIndex = state.options.selectedIndex;
    const selectedSpriteData = state.sprite.all[selectedIndex];

    if (selectedSpriteData) {
      selectedSpriteData.image.drawSprite();
      selectedSpriteData.image.updateFrames();
    } else {
      console.error(`Data doesn't exist for index ${selectedIndex}`);
    }
    ctx.restore();
  }

  function updatePage() {
    ctx.save();
    ctx.clearRect(0, 0, app.canvas.W, app.canvas.H);
    drawBgImage();
    drawGemsPlaque();
    drawNextPlaque();
    drawGameName();
    drawOptionsTextAndBounds();
    updateFrogSprites();
    drawSnow();
    ctx.restore();
  }

  // DRAW U.I.

  function drawGameName() {
    ctx.save();
    // Styles
    let fontSize = texts.logoStyle.fontSize * scaleFactor;
    texts.logoStyle.applyStyle(ctx, scaleFactor);
    const marginX = 10 * scaleFactor;
    const marginY = 8 * scaleFactor;
    const lineHeight = 4 * scaleFactor;
    // Draw text
    ctx.strokeText("FROG", marginX, marginY + fontSize);
    ctx.fillText("FROG", marginX, marginY + fontSize);
    ctx.strokeText("OPS", marginX, marginY + fontSize * 2 + lineHeight);
    ctx.fillText("OPS", marginX, marginY + fontSize * 2 + lineHeight);
    //
    ctx.restore();
  }

  function drawOptionsTextAndBounds() {
    ctx.save();
    const allOptText = state.options.all;
    const allBounds = (state.options.allBounds = []); // resets after every loop
    const gap = 26 * scaleFactor;
    const yOffset = [-gap, 0, gap];

    for (let i = 0; i < allOptText.length; i++) {
      // Apply the style
      let isSelected = i === state.options.selectedIndex;
      texts.menuOptionStyle.applyStyle(ctx, scaleFactor, isSelected);

      // Calculate text position
      const textX = 220 * scaleFactor;
      const textY = app.canvas.H / 2 + yOffset[i];

      // Draw text
      ctx.strokeText(allOptText[i], textX, textY);
      ctx.fillText(allOptText[i], textX, textY);

      // Calculate and store bounds
      const textWidth = ctx.measureText(allOptText[i]).width;
      const textHeight = texts.menuOptionStyle.fontSize * scaleFactor;
      const bounds = {
        x: textX - textWidth / 2,
        y: textY - textHeight / 2,
        width: textWidth,
        height: textHeight,
      };
      allBounds.push(bounds);

      // Draw 'soon' text
      if (allOptText[i] === "AGILITY" || allOptText[i] === "STRENGTH") {
        const soonYOffset = 6 * scaleFactor;
        drawSoonText(textX + textWidth / 2, textY - soonYOffset);
      }
    }

    ctx.restore();
  }

  function drawSoonText(x, y) {
    ctx.save();
    // Styles
    ctx.font = `${8 * scaleFactor}px RetroGaming`;
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#FF8B21";
    ctx.shadowColor = "#FF8B21";
    ctx.lineWidth = 1.5 * scaleFactor;
    ctx.shadowOffsetY = 1 * scaleFactor;
    ctx.strokeText("Soon", x, y);
    ctx.fillText("Soon", x, y);
    ctx.restore();
  }

  //HANDLE EVENTS

  function handleClicks(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handlePlaqueClicks(mouseX, mouseY);
    handleOptionsClick(mouseX, mouseY);
  }

  function handleOptionsClick(mouseX, mouseY) {
    for (let i = 0; i < state.options.allBounds.length; i++) {
      let bound = state.options.allBounds[i];
      if (isClickWithinBounds(mouseX, mouseY, bound)) {
        state.options.selectedIndex = i; // Update the selected index
        return;
      }
    }
  }

  function handlePlaqueClicks(mouseX, mouseY) {
    // Plaque | Game Mode
    if (!app.initActive.startingMenu || state.options.selectedIndex < 0) {
      return;
    }
    if (isClickWithinBounds(mouseX, mouseY, state.plaque.nextBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          handleNextPage(state);
        },
      });
    }
    // Plaque | Gems
    if (isClickWithinBounds(mouseX, mouseY, state.plaque.gemBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.2,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          app.modes.current = app.modes.all.OPTIONS_MENU;
          app.initActive.startingMenu = false;
          app.initActive.optionsMenu = true;
          overlay.opacity = 0;
          state.isPageReseted = false;
        },
      });
    }
  }

  function handleKeysPress(event) {
    const keyAction = state.keys.actions[event.key];
    if (keyAction) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        state.options.selectedIndex = keyAction(state);
      } else if (event.key === "Enter") {
        keyAction(state);
      }
    }
  }

  return {
    init: init,
  };
})();
