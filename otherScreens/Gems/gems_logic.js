// Imports
import { ctx, canvas, scaleFactor } from "../../main.js";
import { colors, texts } from "../../utils/style.js";
import { drawBackPlaque, handlePlaqueClick, initBounds, initImages } from "./gems_ui.js";
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

  // Checks if a specific gem is acquired (stored in localStorage)
  function hasGem(gemName) {
    return localStorage.getItem(gemName) === "true";
  }

  // Draws the gem images and their corresponding labels
  function drawGemsAndText() {
    ctx.save();
    let hasGems = {
      cardioGem: hasGem("cardioGem"),
      agilityGem: hasGem("agilityGem"),
      strengthGem: hasGem("strengthGem"),
    };

    const gemImages = {
      cardioGem: "../images/gems/gem_cardio.svg",
      agilityGem: "../images/gems/gem_agility.svg",
      strengthGem: "../images/gems/gem_strength.svg",
      inactiveGem: "../images/gems/gem_inactive.svg",
    };

    texts.gemsStyle.applyStyle(ctx, scaleFactor);

    // Conditionally change Images and colors
    for (let i = 0; i < gState.gems.names.length; i++) {
      let gemImage = new Image();
      let borderColor;
      let color;

      switch (gState.gems.names[i]) {
        case "CARDIO":
          gemImage.src = hasGems.cardioGem
            ? gemImages.cardioGem
            : gemImages.inactiveGem;
          borderColor = hasGems.cardioGem
            ? colors.gem_blue
            : colors.dark_gray_disabled;
          color = hasGems.cardioGem ? colors.white : colors.gray_disabled;
          break;
        case "AGILITY":
          gemImage.src = hasGems.agilityGem
            ? gemImages.agilityGem
            : gemImages.inactiveGem;
          borderColor = hasGems.agilityGem
            ? colors.gem_pink
            : colors.dark_gray_disabled;
          color = hasGems.agilityGem ? colors.white : colors.gray_disabled;
          break;
        case "STRENGTH":
          gemImage.src = hasGems.strengthGem
            ? gemImages.strengthGem
            : gemImages.inactiveGem;
          borderColor = hasGems.strengthGem
            ? colors.gem_purple
            : colors.dark_gray_disabled;
          color = hasGems.strengthGem ? colors.white : colors.gray_disabled;
          break;
        default:
          gemImage.src = gemImages.inactiveGem;
          borderColor = colors.dark_gray_disabled;
          color = colors.gray_disabled;
      }

      // Set the style for the text
      ctx.fillStyle = color;
      ctx.strokeStyle = borderColor;
      ctx.shadowColor = borderColor;

      // Position & Draw Images
      const separation = 16 * scaleFactor;
      const rectPosXOffsets = [-76 * scaleFactor, 0, 76 * scaleFactor];
      const gemX =
        app.canvas.W / 2 -
        (gemImage.width * scaleFactor) / 2 +
        rectPosXOffsets[i];
      const gemY =
        app.canvas.H / 2 -
        (gemImage.height * scaleFactor) / 2 -
        separation / 2 -
        (texts.gemsStyle.fontSize * scaleFactor) / 2;

      ctx.drawImage(
        gemImage,
        gemX,
        gemY,
        gemImage.width * scaleFactor,
        gemImage.height * scaleFactor
      );

      // Position & Draw Text
      const textY = gemY + gemImage.height * scaleFactor + separation;
      const textX = gemX + (gemImage.width / 2) * scaleFactor;
      ctx.strokeText(gState.gems.names[i], textX, textY);
      ctx.fillText(
        gState.gems.names[i],
        gemX + (gemImage.width / 2) * scaleFactor,
        textY
      );
    }

    ctx.restore();
  }

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
