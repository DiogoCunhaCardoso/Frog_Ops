// Imports
import {
  ctx,
  canvas,
  W,
  H,
  scaleFactor,
  ActiveInits,
  currentMode,
  Modes,
} from "../main.js";
import {
  overlay,
  applyCanvasOpacity,
  drawPlaque,
  isClickWithinBounds,
} from "../utils/utils.js";
import { colors, texts } from "../utils/style.js";

// Module
export let gems = (function () {
  ("use strict");

  // Stores the status through LocalStorage.
  let hasGems = {
    cardioGem: hasGem("cardioGem"),
    agilityGem: hasGem("agilityGem"),
    strengthGem: hasGem("strengthGem"),
  };

  const modes = ["CARDIO", "AGILITY", "STRENGTH"];
  let goBackPlaque = new Image();
  let backPlaqueBounds = {};

  // Initializes the gems module
  function init() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = colors.bg_light;
    ctx.fillRect(0, 0, W, H);
    drawGemsAndText();
    drawPlaque(
      goBackPlaque,
      "../images/gems/plaque_back.svg",
      { x: 0, y: 0 },
      backPlaqueBounds,
      () => {
        backPlaqueBounds.x = backPlaqueBounds.width / 2;
        backPlaqueBounds.y = 0;
      }
    );
    canvas.addEventListener("click", handleClick);
  }

  // Checks if a specific gem is acquired (stored in localStorage)
  function hasGem(gemName) {
    return localStorage.getItem(gemName) !== null;
  }

  // Draws the gem images and their corresponding labels
  function drawGemsAndText() {
    ctx.save();
    const gemImages = {
      cardioGem: "../images/gems/gem_cardio.svg",
      agilityGem: "../images/gems/gem_agility.svg",
      strengthGem: "../images/gems/gem_strength.svg",
      inactiveGem: "../images/gems/gem_inactive.svg",
    };

    texts.gemsStyle.applyStyle(ctx, scaleFactor);
    // Conditionally change Images and colors
    for (let i = 0; i < modes.length; i++) {
      let gemImage = new Image();
      let borderColor;
      let color;

      switch (modes[i]) {
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
        W / 2 - (gemImage.width * scaleFactor) / 2 + rectPosXOffsets[i];
      const gemY =
        H / 2 -
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
      ctx.strokeText(modes[i], textX, textY);
      ctx.fillText(modes[i], gemX + (gemImage.width / 2) * scaleFactor, textY);
    }

    ctx.restore();
  }

  // Handles click events on the canvas.
  function handleClick(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handlePlaqueClick(mouseX, mouseY);
  }

  // Check if the click is within the bounds of the back plaque.
  // If so, animates the overlay and switches back to the 'StartingMenu'.
  function handlePlaqueClick(mouseX, mouseY) {
    if (!ActiveInits.isGemsActive) {
      return;
    }
    if (isClickWithinBounds(mouseX, mouseY, backPlaqueBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          currentMode.mode = Modes.STARTING_MENU;
          ActiveInits.isStartingMenuActive = true;
          ActiveInits.isGemsActive = false;
          overlay.opacity = 0;
        },
      });
    }
  }

  return {
    init: init,
  };
})();
