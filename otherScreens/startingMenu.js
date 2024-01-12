import {
  ctx,
  W,
  H,
  scaleFactor,
  canvas,
  ActiveInits,
  currentMode,
  Modes,
} from "../main.js";
import {
  drawPlaque,
  overlay,
  applyCanvasOpacity,
  isClickWithinBounds,
} from "../utils/utils.js";
import { texts } from "../utils/style.js";

export let startingMenu = (function () {
  ("use strict");

  /* 
  Global Variables
  */

  const options = ["CARDIO", "AGILITY", "STRENGTH"];
  let selectedIndex = 0;
  let rectangles = []; // to interact with

  // PLAQUES
  let gemsPlaqueImage = new Image();
  let gemsPlaqueBounds = {};
  let plaqueImage = new Image();
  let plaqueBounds = {};

  // BACKGROUND
  let isBgLoaded = false;
  let backgroundImage = null;

  let sprite = {
    image: new Image(),
    size: 32,
    currentFrame: 0,
    frameCount: 0,
  };

  /* Initializes other functions
  all in one place to be called as 'init' */

  function init() {
    //Clear canvas after each frame
    ctx.clearRect(0, 0, W, H);
    //Draw background Image
    drawBgImage();
    //
    if (isBgLoaded == true) {
      drawGameName();
      drawOptions();
      drawPlaque(
        gemsPlaqueImage,
        "../images/startingMenu/plaqueGems.svg",
        { x: 14 * scaleFactor, y: 0 }, // y is temporary
        gemsPlaqueBounds,
        () => {
          gemsPlaqueBounds.y = H - gemsPlaqueBounds.height - 10 * scaleFactor;
        }
      );
      drawPlaque(
        plaqueImage,
        "../images/startingMenu/plaque.svg",
        { x: 0 * scaleFactor, y: 0 },
        plaqueBounds,
        () => {
          plaqueBounds.x = W - plaqueBounds.width - 20 * scaleFactor;
          plaqueBounds.y = H - plaqueBounds.height - 10 * scaleFactor;
        }
      );
      updateSpriteAndAnimation();
      window.addEventListener("keydown", handleKeyPress);
    }
    //

    canvas.addEventListener("click", handleClick);
  }

  /* Animates the sprite by cycling through frames. The function draws a portion 
   of the sprite image corresponding to the current frame, then advances 
   the frame index at a rate controlled by 'staggerFrames'. */

  function spriteAnimation(lastFrame, staggerFrames) {
    ctx.drawImage(
      sprite.image,
      sprite.currentFrame * sprite.size,
      0,  
      sprite.size,
      sprite.size,
      40 * scaleFactor + sprite.size, // X position
      H - sprite.size * scaleFactor * 2.4, // Y position
      sprite.size * scaleFactor * 2.4,
      sprite.size * scaleFactor * 2.4
    );
    if (sprite.frameCount % staggerFrames == 0) {
      if (sprite.currentFrame < lastFrame - 1) sprite.currentFrame++;
      else sprite.currentFrame = 0;
    }

    sprite.frameCount++;
  }

  /* Switches between different sprites and their respective
  animations as per the user's selected game mode */

  function updateSpriteAndAnimation() {
    switch (selectedIndex) {
      case 0:
        sprite.image.src = "../images/startingMenu/sprite_cardio.svg";
        spriteAnimation(4, 24);
        break;
      case 1:
        sprite.image.src = "../images/startingMenu/sprite_agility.svg";
        spriteAnimation(10, 30);
        break;
      case 2:
        sprite.image.src = "../images/startingMenu/sprite_strength.svg";
        spriteAnimation(10, 30);
        break;
    }
  }

  /* Draws the background image. Loads the image if not already loaded, 
   and sets a flag once the image is available for rendering. */

  function drawBgImage() {
    if (!isBgLoaded) {
      backgroundImage = new Image();
      backgroundImage.src = "../images/startingMenu/bg.svg";

      backgroundImage.onload = function () {
        ctx.drawImage(backgroundImage, 0, 0, W, H);
        isBgLoaded = true;
      };
    } else {
      ctx.drawImage(backgroundImage, 0, 0, W, H);
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
    let rect = rectangles[index];
    let text = options[index];

    // Apply styles based on selection
    let isSelected = index === selectedIndex;
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
    for (let i = 0; i < options.length; i++) {
      const lineHeight = 24 * scaleFactor;
      const rectHeight = texts.menuOptionStyle.fontSize * scaleFactor;
      const rectWidth = ctx.measureText(options[i]).width;
      const yCenter = H / 2;

      let rectPosY = yCenter - rectHeight / 2 + [-lineHeight, 0, lineHeight][i];
      const xTwoThirds = W - W / 3 - rectWidth / 2;
      const rectPosX = xTwoThirds;

      rectangles[i] = {
        x: rectPosX,
        y: rectPosY,
        width: rectWidth,
        height: 50,
      };

      setTextAndHitboxProperties(i);

      // to draw SOON text
      if (options[i] === "AGILITY" || options[i] === "STRENGTH") {
        const optionTextWidth = ctx.measureText(options[i]).width;
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
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handlePlaqueClick(mouseX, mouseY);
    handleRectangleClick(mouseX, mouseY);
  }

  /* Determines which menu option's hitbox was clicked, updates the selected 
   option, and redraws the menu to reflect the new selection. */

  function handleRectangleClick(mouseX, mouseY) {
    for (let i = 0; i < rectangles.length; i++) {
      let rect = rectangles[i];
      if (isClickWithinBounds(mouseX, mouseY, rect)) {
        selectedIndex = i; // Update the selected index
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
    if (!ActiveInits.isStartingMenuActive || selectedIndex < 0) {
      return;
    }
    if (isClickWithinBounds(mouseX, mouseY, plaqueBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1,
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          if (selectedIndex === 0) {
            ActiveInits.isCardioActive = true;
          } else if (selectedIndex === 1) {
            ActiveInits.isAgilityActive = true;
          } else if (selectedIndex === 2) {
            ActiveInits.isStrengthActive = true;
          }

          currentMode.mode = selectedIndex + 1;
          ActiveInits.isStartingMenuActive = false;
          overlay.opacity = 0;
        },
      });
    }
    // Plaque | Gems
    if (isClickWithinBounds(mouseX, mouseY, gemsPlaqueBounds)) {
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

  function handleKeyPress(event) {
    if (ActiveInits.isStartingMenuActive) {
      if (event.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % options.length; // THIS IS GENIUS :o
        drawOptions();
      } else if (event.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        drawOptions();
      } else if (event.key === "Enter") {
        switch (selectedIndex) {
          case 0:
            ActiveInits.isCardioActive = true;
            break;
          case 1:
            ActiveInits.isAgilityActive = true;
            break;
          case 2:
            ActiveInits.isStrengthActive = true;
            break;
        }
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.5,
          onUpdate: applyCanvasOpacity,
          onComplete: () => {
            currentMode.mode = selectedIndex + 1;
            ActiveInits.isStartingMenuActive = false;
            overlay.opacity = 0;
          },
        });
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
