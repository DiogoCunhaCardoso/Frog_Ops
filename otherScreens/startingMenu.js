const startingMenu = (function () {
  ("use strict");
  /*
   * Global Variables
   */

  const options = ["CARDIO", "AGILITY", "STRENGTH"];
  let selectedIndex = 0; // none selected
  let rectangles = []; // to interact with
  const c_gray = "#C9C9C9";
  const c_darkGray = "#939393";

  // PLAQUES
  const gemsPlaqueImage = new Image();
  let gemsPlaqueBounds = {};
  const plaqueImage = new Image();
  let plaqueBounds = {};

  // BACKGROUND
  let isBgLoaded = false;
  let backgroundImage = null;

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
      drawOptions(); // not working
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
    }
    //

    canvas.addEventListener("click", handleClick);
  }

  /* Animates the sprite by drawing frames in a sequence.
  Gives num of frames & speed of frames as params */

  const sprite = {
    image: new Image(),
    size: 32,
    currentFrame: 0,
    frameCount: 0,
  };

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
        sprite.image.src = "../images/startingMenu/cardioSprite.svg";
        spriteAnimation(4, 24);
        break;
      case 1:
        sprite.image.src = "../images/startingMenu/agilitySprite.svg";
        spriteAnimation(9, 30);
        break;
      case 2:
        sprite.image.src = "../images/startingMenu/strengthSprite.svg";
        spriteAnimation(10, 30);
        break;
    }
  }

  /* Ensures the image is completely loaded to be drawn only after 
  and uses a flag to let other functions know */

  function drawBgImage() {
    if (!isBgLoaded) {
      backgroundImage = new Image();
      backgroundImage.src = "../images/startingMenu/bg.png";

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
    const shadowOffsets = [
      { x: 4, y: 4 },
      { x: -3, y: 4 },
      { x: -3, y: -3 },
      { x: 4, y: -3 },
    ];

    ctx.save();

    // Common Styles
    ctx.font = `${32}px RetroGaming`; // CHECK
    ctx.lineWidth = 32;
    ctx.fillStyle = "#4683DF"; // Text color
    ctx.strokeStyle = "#DCEAFF"; // Border color
    ctx.shadowColor = "#DCEAFF"; // Shadow color

    // Draw "FROG"
    shadowOffsets.forEach((offset) => {
      ctx.shadowOffsetX = offset.x;
      ctx.shadowOffsetY = offset.y;
      ctx.fillText("FROG", 40, 60 + scaleFactor);
    });

    // Draw "OPS"
    shadowOffsets.forEach((offset) => {
      ctx.shadowOffsetX = offset.x;
      ctx.shadowOffsetY = offset.y;
      ctx.fillText("OPS", 40, 120 + scaleFactor);
    });

    ctx.restore();
  }

  /* Draws the text and its corresponding 
   invisible hitbox for menu options. */

  function setTextAndHitboxProperties(index, color, borderColor) {
    const rect = rectangles[index];
    const text = options[index];

    ctx.save();

    // Disable properties on rectangle & draw it
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "transparent";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    // Text style settings
    ctx.fillStyle = index === selectedIndex ? color : c_gray;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Enable shadow for text
    ctx.shadowColor = index === selectedIndex ? borderColor : c_darkGray;
    ctx.shadowOffsetY = 4;
    ctx.shadowOffsetX = 2;
    // Calculate text position
    const textX = rect.x + rect.width / 2;
    const textY = rect.y + rect.height / 2;
    // Draw text
    ctx.fillText(text, textX, textY);
    ctx.restore();
  }

  /* Uses 'setTextAndHitboxProperties' to draw the interactive menu options.
  Sets up positioning and dimensions for each option. */

  function drawOptions() {
    ctx.save();
    ctx.font = `${10 * scaleFactor}px RetroGaming`;
    for (let i = 0; i < options.length; i++) {
      const posY = H / 2 - 50 / 2 + [-24 * scaleFactor, 0, 24 * scaleFactor][i];
      const textWidth = ctx.measureText(options[i]).width;
      const rectWidth = textWidth;
      const rectPosX = W - W / 3 - textWidth / 2; // SETS THE TEXT TO 2/3 OF THE SCREEN

      rectangles[i] = {
        x: rectPosX,
        y: posY,
        width: rectWidth,
        height: 50,
      };

      const color = i === selectedIndex ? "#FFD43E" : c_gray;
      const borderColor = i === selectedIndex ? "#2A2900" : c_darkGray;
      setTextAndHitboxProperties(i, color, borderColor);
    }
    ctx.restore();
  }

  /* Handles mouse click events */

  function handleClick(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handlePlaqueClick(mouseX, mouseY);
    handleRectangleClick(mouseX, mouseY);
  }

  /* Checks on which word the mouse is on, lets a 
  variable used on 'handlePlaqueClick' know and changes
  color of the selected one */

  function handleRectangleClick(mouseX, mouseY) {
    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i];
      if (
        mouseX >= rect.x &&
        mouseX <= rect.x + rect.width &&
        mouseY >= rect.y &&
        mouseY <= rect.y + rect.height
      ) {
        selectedIndex = i; // Update the selected index
        drawOptions(); // Redraw options with the new selection
        return;
      }
    }
  }

  /* Checks if mouse is on the plaques and on click sets a 
  transition into the mode selected by 'handleRectangleClick'
  or the gems page */

  function handlePlaqueClick(mouseX, mouseY) {
    // plaque for game modes

    if (!isStartingMenuActive) {
      return;
    }
    if (
      mouseX >= plaqueBounds.x &&
      mouseX <= plaqueBounds.x + plaqueBounds.width &&
      mouseY >= plaqueBounds.y &&
      mouseY <= plaqueBounds.y + plaqueBounds.height
    ) {
      // Check if a game option is selected
      if (selectedIndex >= 0) {
        gsap.to(overlay, {
          opacity: 1,
          duration: 1, // duration of the fade in seconds
          onUpdate: applyCanvasOpacity,
          onComplete: () => {
            if (selectedIndex === 0) {
              isCardioInitActive = true;
            } else if (selectedIndex === 1) {
              isAgilityInitActive = true;
            } else if (selectedIndex === 2) {
              isStrengthInitActive = true;
            }

            currentMode.mode = selectedIndex + 1;
            isStartingMenuActive = false;
            overlay.opacity = 0;
          },
        });
      }
    }

    // plaque for gems

    if (
      mouseX >= gemsPlaqueBounds.x &&
      mouseX <= gemsPlaqueBounds.x + gemsPlaqueBounds.width &&
      mouseY >= gemsPlaqueBounds.y &&
      mouseY <= gemsPlaqueBounds.y + gemsPlaqueBounds.height
    ) {
      // Check if a game option is selected
      if (selectedIndex >= 0) {
        gsap.to(overlay, {
          opacity: 1,
          duration: 1, // duration of the fade in seconds
          onUpdate: applyCanvasOpacity,
          onComplete: () => {
            currentMode.mode = 4;
            isStartingMenuActive = false;
            isGemsInitActive = true;
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
