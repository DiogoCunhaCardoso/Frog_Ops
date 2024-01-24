import { canvas, ctx, scaleFactor } from "../../main.js";
import { appState as app } from "../../app_state.js";
import { skinsState as skState } from "./skins_state.js";
import {
  drawBgImage,
  drawActionButton,
  drawUI,
  initImages,
  initBounds,
} from "./skins_ui.js";
import {
  applyCanvasOpacity,
  isClickWithinBounds,
  overlay,
} from "../../utils/utils.js";
import { texts } from "../../utils/style.js";

export const skins = (function () {
  "use strict";

  let coinImage = new Image();
  coinImage.src = "../../images/coin.svg";

  function init() {
    app.initActive.skins = true;
    if (!skState.isSkinsReseted) {
      initImages();
      initBounds();
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
    drawUI();
    drawActionButton();
  }

  function selectSkin() {
    ctx.save();
    // SKIN DIMENSIONS & POSITIONS
    const selectedImgW = 69 * scaleFactor;
    const selectedImgH = 51 * scaleFactor;

    const scaleDown = 0.65;
    const nonSelectedImgW = selectedImgW * scaleDown;
    const nonSelectedImgH = selectedImgH * scaleDown;
    const gap = 36 * scaleFactor;

    const skinPositions = [
      {
        name: "previous",
        bounds: [
          app.canvas.W / 2 - selectedImgW / 2 - gap - nonSelectedImgW,
          app.canvas.H / 2 - nonSelectedImgH / 2,
          nonSelectedImgW,
          nonSelectedImgH,
        ],
      },
      {
        name: "selected",
        bounds: [
          app.canvas.W / 2 - selectedImgW / 2,
          app.canvas.H / 2 - selectedImgH / 2,
          selectedImgW,
          selectedImgH,
        ],
      },
      {
        name: "next",
        bounds: [
          app.canvas.W / 2 + selectedImgW / 2 + gap,
          app.canvas.H / 2 - nonSelectedImgH / 2,
          nonSelectedImgW,
          nonSelectedImgH,
        ],
      },
    ];

    // FETCH OF SKIN OBJECTS ACCORDING TO POSITION
    const skins = skState.skins.all;
    const skinObjects = [
      skins[skState.actions.GetPrevIndex(skState)],
      skins[skState.skins.selectedIndex],
      skins[skState.actions.GetNextIndex(skState)],
    ];

    // DRAWING SKINS ACCORDING TO POSITION
    skinPositions.forEach((skinPos, i) => {
      const skin = skinObjects[i];
      const isSelectedSkin = skinPos.name === "selected";

      // CHECK IF 1ST SKIN OR LAST SKIN TO NOT DRAW IT
      if (
        (i === 0 && !skState.actions.IsPrevSkinAvailable(skState)) ||
        (i === skinPositions.length - 1 &&
          !skState.actions.IsNextSkinAvailable(skState))
      ) {
        return;
      }

      // DRAW
      _drawSkinGroup(skin, skinPos, isSelectedSkin);
    });

    // SET BOUNDS FOR SKINS TO BE CLICKABLE
    skState.skins.bounds = skinPositions.map((pos) => ({
      name: pos.name,
      bounds: {
        x: pos.bounds[0],
        y: pos.bounds[1],
        width: pos.bounds[2],
        height: pos.bounds[3],
      },
    }));

    ctx.restore();
  }

  // HELPER FUNCTION

  function _drawSkinGroup(skin, skinPos, isSelectedSkin) {
    const currentScale = isSelectedSkin ? 1 : 0.65;
    ctx.fillStyle = skin.color;
    ctx.fillRect(...skinPos.bounds);

    _drawSkinName(skin, skinPos, currentScale, isSelectedSkin);
    _drawSkinPrice(skin, skinPos, currentScale, isSelectedSkin);
  }

  function _drawSkinName(skin, skinPos, currentScale, isSelectedSkin) {
    // TEXT STYLE
    texts.skinNamesStyle.applyStyle(
      ctx,
      scaleFactor * currentScale,
      isSelectedSkin
    );
    // TEXT POSITION
    const centerX = skinPos.bounds[0] + skinPos.bounds[2] / 2;
    const textYOffset = 25 * scaleFactor * currentScale;
    const textY = skinPos.bounds[1] - textYOffset;

    if (skin.name) {
      ctx.strokeText(skin.name, centerX, textY);
      ctx.fillText(skin.name, centerX, textY);
    }
  }

  function _drawSkinPrice(skin, skinPos, currentScale, isSelectedSkin) {
    // TEXT STYLE
    texts.valueStyle.applyStyle(
      ctx,
      scaleFactor * currentScale,
      isSelectedSkin
    );

    // PRICE TEXT POSITION
    const centerX = skinPos.bounds[0] + skinPos.bounds[2] / 2;
    const priceYOffset = 12 * scaleFactor * currentScale;
    const priceY = skinPos.bounds[1] - priceYOffset;

    // DRAW PRICE & COIN
    if (skin.price) {
      const textWidth = ctx.measureText(skin.price).width;
      const textX = centerX;
      const padding = 2 * scaleFactor;
      const imageWidth = coinImage.width * scaleFactor * currentScale;
      const imageX = textX + textWidth / 2 + padding;

      ctx.strokeText(skin.price, textX, priceY);
      ctx.fillText(skin.price, textX, priceY);

      // DRAW COIN
      ctx.save();
      ctx.globalAlpha = isSelectedSkin ? 1 : 0.6;
      ctx.drawImage(
        coinImage,
        imageX,
        priceY - (coinImage.height * scaleFactor * currentScale) / 2,
        imageWidth * 0.8,
        coinImage.height * scaleFactor * currentScale * 0.8
      );
      ctx.restore();
    }
  }

  // INTERACTIVITY

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
    handleUseSkin(mouseX, mouseY);
    handleCloseButton(mouseX, mouseY);
  }

  function handleUseSkin(mouseX, mouseY) {
    if (isClickWithinBounds(mouseX, mouseY, skState.ui.btn.bounds)) {
      skState.skins.currentlyUsingIndex = skState.skins.selectedIndex;
    }
  }

  function handleCloseButton(mouseX, mouseY) {
    if (isClickWithinBounds(mouseX, mouseY, skState.ui.btn.closebounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.2,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          app.modes.current = app.modes.all.STARTING_MENU;
          app.initActive.skins = false;
          app.initActive.startingMenu = true;
          overlay.opacity = 0;
          skState.skins.selectedIndex = 0;
        },
      });
    }
  }

  function handleKeyPress(event) {
    const isPrevKey = event.key === skState.keys.all[0];
    const isNextKey = event.key === skState.keys.all[1];

    if (isPrevKey && skState.actions.IsPrevSkinAvailable(skState)) {
      skState.actions.ChangeToPrevIndex(skState);
    } else if (isNextKey && skState.actions.IsNextSkinAvailable(skState)) {
      skState.actions.ChangeToNextIndex(skState);
    }
  }

  return {
    init: init,
  };
})();
