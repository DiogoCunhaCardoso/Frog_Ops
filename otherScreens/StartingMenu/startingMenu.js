import {
  ctx,
  W,
  H,
  scaleFactor,
  canvas,
  ActiveInits,
  currentMode,
  Modes,
} from "../../main.js";
import {
  drawPlaque,
  overlay,
  applyCanvasOpacity,
  isClickWithinBounds,
} from "../../utils/utils.js";
import { texts } from "../../utils/style.js";
import { startingMenuState as state } from "./startingMenu_state.js";
import { Sprite } from "../../classes/Sprite.js";

export let startingMenu = (function () {
  ("use strict");

  // BACKGROUND
  let isBgLoaded = false;

  /* Initializes other functions
  all in one place to be called as 'init' */

  function init() {
/*     if (!state.isPageReseted) {
      initImages();
      //initBounds();
      canvas.addEventListener("click", handleClick);
      state.isPageReseted = true;
    } */
    updatePage();
    canvas.addEventListener("click", handleClick);
  }

/*   function initImages() {
    state.background.image = new Sprite({
      position: { x: 0, y: 0 },
      imageSrc: "../images/startingMenu/bg.svg",
    });
    state.plaque.nextImage = new Sprite({
      position: { x: 0 * scaleFactor, y: 0 },
      imageSrc: "../images/startingMenu/plaque.svg",
    });
    state.plaque.gemImage = new Sprite({
      position: { x: 14 * scaleFactor, y: 0 },
      imageSrc: "../images/startingMenu/plaqueGems.svg",
    });
  }

  function drawBgImage() {
    state.background.image.drawSprite();
  }
  function drawNextPlaque() {
    state.plaque.nextImage.drawSprite();
  }
  function drawGemsPlaque() {
    state.plaque.gemImage.drawSprite();
  } */

  function updatePage() {
    //Clear canvas after each frame
    ctx.clearRect(0, 0, W, H);
    //Draw background Image
    drawBgImage();
/*     drawNextPlaque();
    drawGemsPlaque(); */
    //

    drawGameName();
    drawOptions();
    drawPlaque(
      state.plaque.gemImage,
      "../images/startingMenu/plaqueGems.svg",
      { x: 14 * scaleFactor, y: 0 }, // y is temporary
      state.plaque.gemBounds,
      () => {
        state.plaque.gemBounds.y =
          H - state.plaque.gemBounds.height - 10 * scaleFactor;
      }
    );
    drawPlaque(
      state.plaque.nextImage,
      "../images/startingMenu/plaque.svg",
      { x: 0 * scaleFactor, y: 0 },
      state.plaque.nextBounds,
      () => {
        state.plaque.nextBounds.x =
          W - state.plaque.nextBounds.width - 20 * scaleFactor;
        state.plaque.nextBounds.y =
          H - state.plaque.nextBounds.height - 10 * scaleFactor;
      }
    );
    updateSpriteAndAnimation();
    if (ActiveInits.isStartingMenuActive) {
      window.addEventListener("keydown", handleKeysPress);
    }
  }

  /* Animates the sprite by cycling through frames. The function draws a portion 
   of the sprite image corresponding to the current frame, then advances 
   the frame index at a rate controlled by 'staggerFrames'. */

  function spriteAnimation(lastFrame, staggerFrames) {
    ctx.drawImage(
      state.sprite.props.image,
      state.sprite.props.currentFrame * state.sprite.props.size,
      0,
      state.sprite.props.size,
      state.sprite.props.size,
      40 * scaleFactor + state.sprite.props.size, // X position
      H - state.sprite.props.size * scaleFactor * 2.4, // Y position
      state.sprite.props.size * scaleFactor * 2.4,
      state.sprite.props.size * scaleFactor * 2.4
    );
    if (state.sprite.props.frameCount % staggerFrames == 0) {
      if (state.sprite.props.currentFrame < lastFrame - 1)
        state.sprite.props.currentFrame++;
      else state.sprite.props.currentFrame = 0;
    }

    state.sprite.props.frameCount++;
  }

  /* Switches between different sprites and their respective
  animations as per the user's selected game mode */

  function updateSpriteAndAnimation() {
    const data = state.sprite.all[state.options.selectedIndex];
    if (data) {
      state.sprite.props.image.src = data.imagePath;
      spriteAnimation(data.totalFrames, data.speed);
    } else {
      console.error(
        `data doesn't exist for index ${state.options.selectedIndex}`
      );
    }
  }

  /* Draws the background image. Loads the image if not already loaded, 
   and sets a flag once the image is available for rendering. */

    function drawBgImage() {
    if (!isBgLoaded) {
      state.background.image = new Image();
      state.background.image.src = "../images/startingMenu/bg.svg";

      state.background.image.onload = function () {
        ctx.drawImage(state.background.image, 0, 0, W, H);
        isBgLoaded = true;
      };
    } else {
      ctx.drawImage(state.background.image, 0, 0, W, H);
    }
  }

  /* Draws the text of the game name 
   using shadow effects for the look */

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

  /* Draws the text on center of its invisible hitbox 
   for menu options and applies styles based on selection. */

  function setTextAndHitboxProperties(index) {
    ctx.save();
    let rect = state.options.allBounds[index];
    let text = state.options.all[index];

    // Apply styles based on selection
    let isSelected = index === state.options.selectedIndex;
    texts.menuOptionStyle.applyStyle(ctx, scaleFactor, isSelected);

    // Center of the rectangle
    let textX = rect.x + rect.width / 2;
    let textY = rect.y + rect.height / 2;

    // Draw text
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);

    ctx.restore();
  }

  /* Draws and styles the text for a menu option, aligning it to 
  the center of its corresponding invisible hitbox. */

  function drawOptions() {
    ctx.save();
    ctx.font = `${texts.menuOptionStyle.fontSize * scaleFactor}px ${
      texts.menuOptionStyle.fontFamily
    }`;

    //draw Rectangles
    for (let i = 0; i < state.options.all.length; i++) {
      const lineHeight = 24 * scaleFactor;
      const rectHeight = texts.menuOptionStyle.fontSize * scaleFactor;
      const rectWidth = ctx.measureText(state.options.all[i]).width;
      const yCenter = H / 2;

      let rectPosY = yCenter - rectHeight / 2 + [-lineHeight, 0, lineHeight][i];
      const xTwoThirds = W - W / 3 - rectWidth / 2;
      const rectPosX = xTwoThirds;

      state.options.allBounds[i] = {
        x: rectPosX,
        y: rectPosY,
        width: rectWidth,
        height: 50,
      };

      setTextAndHitboxProperties(i);

      // to draw SOON text
      if (
        state.options.all[i] === "AGILITY" ||
        state.options.all[i] === "STRENGTH"
      ) {
        const optionTextWidth = ctx.measureText(state.options.all[i]).width;
        drawSoonText(
          rectPosX + optionTextWidth - rectWidth + rectWidth / 1.2,
          rectPosY - rectHeight / 1.4,
          i
        );
      }
    }
    ctx.restore();
  }

  // Will be removed when Game Modes are done
  function drawSoonText(x, y) {
    ctx.save();
    // Styles
    ctx.font = `${8 * scaleFactor}px RetroGaming`;
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#FF8B21";
    ctx.shadowColor = "#FF8B21";
    ctx.lineWidth = 1.5 * scaleFactor;
    ctx.shadowOffsetY = 1 * scaleFactor;
    ctx.strokeText("Soon", x, y + texts.menuOptionStyle.fontSize * scaleFactor);
    ctx.fillText("Soon", x, y + texts.menuOptionStyle.fontSize * scaleFactor);
    ctx.restore();
  }

  /* Handles mouse click events */

  function handleClick(event) {
    if (ActiveInits.isStartingMenuActive) {
      let mouseX = event.clientX - canvas.getBoundingClientRect().left;
      let mouseY = event.clientY - canvas.getBoundingClientRect().top;

      handlePlaqueClick(mouseX, mouseY);
      handleRectangleClick(mouseX, mouseY);
    }
  }

  /* Determines which menu option's hitbox was clicked, updates the selected 
   option, and redraws the menu to reflect the new selection. */

  function handleRectangleClick(mouseX, mouseY) {
    for (let i = 0; i < state.options.allBounds.length; i++) {
      let rect = state.options.allBounds[i];
      if (isClickWithinBounds(mouseX, mouseY, rect)) {
        state.options.selectedIndex = i; // Update the selected index
        drawOptions(); // Redraw options with the new selection
        return;
      }
    }
  }

  /* Handles clicks on the plaques. On click, it initiates a transition to 
   either the selected game mode (determined by 'handleRectangleClick') 
   or the gems page. */

  function handlePlaqueClick(mouseX, mouseY) {
    // Plaque | Game Mode
    if (!ActiveInits.isStartingMenuActive || state.options.selectedIndex < 0) {
      return;
    }
    if (isClickWithinBounds(mouseX, mouseY, state.plaque.nextBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          if (state.options.selectedIndex === 0) {
            ActiveInits.isCardioActive = true;
          } else if (state.options.selectedIndex === 1) {
            ActiveInits.isAgilityActive = true;
          } else if (state.options.selectedIndex === 2) {
            ActiveInits.isStrengthActive = true;
          }

          currentMode.mode = state.options.selectedIndex + 1;
          ActiveInits.isStartingMenuActive = false;
          overlay.opacity = 0;
        },
      });
    }
    // Plaque | Gems
    if (isClickWithinBounds(mouseX, mouseY, state.plaque.gemBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          currentMode.mode = Modes.GEMS;
          ActiveInits.isStartingMenuActive = false;
          ActiveInits.isGemsActive = true;
          overlay.opacity = 0;
        },
      });
    }
  }

  function handleKeysPress(event) {
    const keyAction = state.keys.actions[event.key];
    if (keyAction) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        state.options.selectedIndex = keyAction(state);
        drawOptions();
      } else if (event.key === "Enter") {
        keyAction(state);
      }
    }
  }

  return {
    init: init,
  };
})();

/* window.addEventListener("resize", function () {
  scaleFactor = window.innerWidth / baseWidth;
}); */
