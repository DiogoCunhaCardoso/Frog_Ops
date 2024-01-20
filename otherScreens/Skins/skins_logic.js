import { canvas, ctx, scaleFactor } from "../../main.js";
import { appState as app } from "../../app_state.js";
import { skinsState as skState } from "./skins_state.js";
import { drawBgImage, initImages } from "./skins_ui.js";
import { isClickWithinBounds } from "../../utils/utils.js";

export const skins = (function () {
  "use strict";

  function init() {
    app.initActive.skins = true;
    if (!skState.isSkinsReseted) {
      initImages();
      skState.isSkinsReseted = true;
    }
    canvas.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyPress);
    updateGame();
  }

  function updateGame() {
    ctx.clearRect(0, 0, app.canvas.W, app.canvas.H);
    drawBgImage();
    selectSkin();
  }

  function selectSkin() {
    const scale = 0.65;
    const selectedWidth = 69 * scaleFactor;
    const selectedHeight = 51 * scaleFactor;

    const scaledWidth = selectedWidth * scale;
    const scaledHeight = selectedHeight * scale;
    const gap = 36 * scaleFactor;

    const skinPositions = [
      {
        name: "previous",
        bounds: [
          app.canvas.W / 2 - selectedWidth / 2 - gap - scaledWidth,
          app.canvas.H / 2 - scaledHeight / 2,
          scaledWidth,
          scaledHeight,
        ],
      },
      {
        name: "selected",
        bounds: [
          app.canvas.W / 2 - selectedWidth / 2,
          app.canvas.H / 2 - selectedHeight / 2,
          selectedWidth,
          selectedHeight,
        ],
      },
      {
        name: "next",
        bounds: [
          app.canvas.W / 2 + selectedWidth / 2 + gap,
          app.canvas.H / 2 - scaledHeight / 2,
          scaledWidth,
          scaledHeight,
        ],
      },
    ];

    let displayColors = [
      skState.skins.colors[skState.actions.GetPrevIndex(skState)], // Previous
      skState.skins.colors[skState.skins.selectedIndex], // Selected
      skState.skins.colors[skState.actions.GetNextIndex(skState)], // Next
    ];

    skinPositions.forEach((skin, i) => {
      // DON'T DRAW IF NONE ON LEFT AND NONE ON RIGHT
      const isFirstSkin = i === 0;
      const isLastSkin = i === skinPositions.length - 1;

      if (
        (isFirstSkin && !skState.actions.IsPrevSkinAvailable(skState)) ||
        (isLastSkin && !skState.actions.IsNextSkinAvailable(skState))
      ) {
        return;
      }

      // DRAW
      ctx.fillStyle = displayColors[i];
      ctx.fillRect(...skin.bounds);
    });

    // Update skState.skins.bounds
    skState.skins.bounds = skinPositions.map((skin) => ({
      name: skin.name,
      bounds: {
        x: skin.bounds[0],
        y: skin.bounds[1],
        width: skin.bounds[2],
        height: skin.bounds[3],
      },
    }));
  }

  function handleClick(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    skState.skins.bounds.forEach((skin) => {
      if (isClickWithinBounds(mouseX, mouseY, skin.bounds)) {
        if (
          skin.name === "next" &&
          skState.actions.IsNextSkinAvailable(skState)
        ) {
          skState.actions.ChangeToNextIndex(skState);

        } else if (
          skin.name === "previous" &&
          skState.actions.IsPrevSkinAvailable(skState)
        ) {
          skState.actions.ChangeToPrevIndex(skState);

        }
      }
    });
  }

  function handleKeyPress(event) {
    const isPrevKey = event.key === skState.keys.all[0];
    const isNextKey = event.key === skState.keys.all[1];

    if (isPrevKey && skState.actions.IsPrevSkinAvailable(skState)) {
      skState.actions.ChangeToPrevIndex(skState);
      console.log(
        `Pressed ${event.key} - New selectedIndex: ${skState.skins.selectedIndex}`
      ); // Debugging
    } else if (isNextKey && skState.actions.IsNextSkinAvailable(skState)) {
      skState.actions.ChangeToNextIndex(skState);
      console.log(
        `Pressed ${event.key} - New selectedIndex: ${skState.skins.selectedIndex}`
      ); // Debugging
    }
  }

  return {
    init: init,
  };
})();
