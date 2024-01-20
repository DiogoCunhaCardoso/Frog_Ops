// Imports
import { ctx, canvas, scaleFactor } from "../../main.js";
import { colors, texts } from "../../utils/style.js";
import {
  drawBackPlaque,
  handlePlaqueClick,
  initBounds,
  initImages,
} from "./gems_ui.js";
import { appState as app } from "../../app_state.js";
import { gemsState as gState } from "./gems_state.js";

// Module
export const gems = (function () {
  ("use strict");

  // Initializes the gems module
  function init() {
    if (!gState.isGemsReseted) {
      initImages();
      initBounds();
      canvas.addEventListener("click", handleClick);
      gState.isGemsReseted = true;
    }
    updateGame();
  }

  // LOOP

  function updateGame() {
    const canvas = [0, 0, app.canvas.W, app.canvas.H];
    ctx.clearRect(...canvas);
    ctx.fillStyle = colors.bg_light;
    ctx.fillRect(...canvas);
    drawBackPlaque();
    drawGemsAndText();
  }

  function hasGem(gemName) {
    return localStorage.getItem(gemName) === "true";
  }

  //
  //
  //
  //
  //
  //
  // RE CHECK IN FUTURE

  function drawGemsAndText() {
    ctx.save();

    let hasGems = {
      cardioGem: hasGem("cardioGem"),
      agilityGem: hasGem("agilityGem"),
      strengthGem: hasGem("strengthGem"),
    };

    texts.gemsStyle.applyStyle(ctx, scaleFactor);

    const fontSize = texts.gemsStyle.fontSize;
    const gap = 16;
    const OffsetX = [-76, 0, 76];

    gState.gems.names.forEach((gemName, i) => {
      let isActive = hasGems[gemName.toLowerCase() + "Gem"];

      let borderColor = isActive
        ? colors[gState.gems.colors[i]]
        : colors.dark_gray_disabled;
      let color = isActive ? colors.white : colors.gray_disabled;

      let gemImage = isActive
        ? gState.gems.all[i].image
        : gState.gems.all[3].image;
      gemImage.src = isActive
        ? gState.gems.all[i].imagePath
        : gState.gems.all[3].imagePath;

      ctx.fillStyle = color;
      ctx.strokeStyle = borderColor;
      ctx.shadowColor = borderColor;

      // Position & Draw Images
      const gemX =
        app.canvas.W / 2 -
        (gemImage.width * scaleFactor) / 2 +
        OffsetX[i] * scaleFactor;
      const gemY =
        app.canvas.H / 2 -
        (gemImage.height * scaleFactor) / 2 -
        (gap * scaleFactor) / 2 -
        (fontSize * scaleFactor) / 2;

      ctx.drawImage(
        gemImage,
        gemX,
        gemY,
        gemImage.width * scaleFactor,
        gemImage.height * scaleFactor
      );

      // Position & Draw Text
      const textY = gemY + gemImage.height * scaleFactor + gap * scaleFactor;
      const textX = gemX + (gemImage.width * scaleFactor) / 2;
      ctx.strokeText(gemName, textX, textY);
      ctx.fillText(gemName, textX, textY);
    });

    ctx.restore();
  }

  //
  //
  //
  //
  //
  //
  //

  // Handles click events on the canvas.
  function handleClick(event) {
    if (app.initActive.gems) {
      let mouseX = event.clientX - canvas.getBoundingClientRect().left;
      let mouseY = event.clientY - canvas.getBoundingClientRect().top;

      handlePlaqueClick(mouseX, mouseY);
    }
  }

  return {
    init: init,
  };
})();
