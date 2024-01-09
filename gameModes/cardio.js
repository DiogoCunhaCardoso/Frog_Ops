import {
  ctx,
  canvas,
  W,
  H,
  ActiveInits,
  currentMode,
  Modes,
  scaleFactor,
} from "../main.js";
import {
  overlay,
  applyCanvasOpacity,
  drawPlaque,
  isClickWithinBounds,
} from "../utils.js";
import { Player } from "../classes/Player.js";
import { CollisionBlock } from "../classes/CollisionBlock.js";
import { colors } from "../style.js";

export let gameOverStats;
let isGameInitialized = false;

export let cardio = (function () {
  ("use strict");

  // for player.update()
  let players = []; // state

  // for createRandomPlatforms()
  let allPlatforms = []; // state
  let lastPlatformCreationTime = Date.now();
  let PLATFORM_CREATION_INTERVAL = 1500;

  //for createRandomBirds()
  let allBirds = []; // state
  let lastBirdCreationTime = Date.now();
  let BIRD_CREATION_INTERVAL = 4500;

  // for drawPlaque()
  let goBackPlaque = new Image();
  let backPlaqueBounds = {};

  // for drawBgImage()
  let isBgLoaded = false;
  let backgroundImage = null;

  // INITIALIZATION
  function init() {
    if (!isGameInitialized) {
      resetGame(); // resets game states
      canvas.addEventListener("click", handleClick);
      isGameInitialized = true;
    }
    updateGame();
  }

  // GAME MANAGEMENT
  function updateGame() {
    ctx.clearRect(0, 0, W, H);
    drawBgImage();
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
    // player
    players[0]?.update();
    // platform
    createRandomPlatforms();
    updatePlatforms();
    // birds
    createRandomBirds();
    updateBirds();
    // U.I.
    renderUI();
  }

  function resetGame() {
    players = [];
    allPlatforms = [];
    allBirds = [];
    initPlayer();
    lastPlatformCreationTime = Date.now();
    lastBirdCreationTime = Date.now();
    movingRectWidth = 45 / 2;
    directionInc = -0.25;
  }

  function initPlayer() {
    if (players.length === 0) {
      let object = new Player({ x: 0, y: 0 });
      let player = new Player({
        position: {
          x: 24 * scaleFactor - object.width / 2,
          y: 0 + object.height,
        },
        allPlatforms,
        allBirds,
        getStats: sendGameOverStats,
      });
      players.push(player);
    }
  }

  function sendGameOverStats() {
    ctx.save();
    gameOverStats = {
      gameMode: "Cardio",
      score: players[0]?.score,
      maxScore: 25,
    };
    isGameInitialized = false;
    ctx.restore;
  }

  // U.I.
  let movingRectWidth = 45 / 2;
  let directionInc = -0.25;

  function renderUI() {
    ctx.save();
    ctx.fillStyle = colors.brown;
    const FontSize = 7 * scaleFactor;
    ctx.font = `${FontSize}px RetroGaming`;
    ctx.textAlign = "right";

    //
    const padding = 8 * scaleFactor;
    const rectWidth = 45 * scaleFactor;
    const rectHeight = 6 * scaleFactor;

    // Calculate and draw Score
    const scoreText = "SCORE " + players[0].score;
    const scoreTextWidth = ctx.measureText(scoreText).width;
    ctx.fillText(
      scoreText,
      W - padding * 2,
      padding + rectHeight / 2 + FontSize
    );

    const rectangleXPosition = W - padding * 3 - scoreTextWidth - rectWidth;
    const rectangleyPosition = padding + FontSize / 2 + 1 * scaleFactor;

    // Draw lightColor Rect
    ctx.fillStyle = colors.white;
    ctx.fillRect(rectangleXPosition, rectangleyPosition, rectWidth, rectHeight);

    // Draw Moving Rectangle
    ctx.fillStyle = colors.yellow;
    ctx.fillRect(
      rectangleXPosition,
      rectangleyPosition,
      movingRectWidth * scaleFactor,
      rectHeight
    );

    // Draw border of rectangle
    ctx.strokeStyle = colors.brown;
    ctx.lineWidth = 1 * scaleFactor;
    ctx.strokeRect(
      rectangleXPosition,
      rectangleyPosition,
      rectWidth,
      rectHeight
    );

    // Calculate and draw Rotation
    ctx.fillStyle = colors.brown;
    const rotationText = "ROT. " + Math.round(players[0].rotation);
    ctx.fillText(
      rotationText,
      W - scoreTextWidth - rectWidth - padding * 3 - padding / 2, // x
      padding + rectHeight / 2 + FontSize // y
    );

    if (players[0].isRotating) {
      movingRectWidth += directionInc;

      // Reverse the change direction at limits
      if (movingRectWidth <= 0 || movingRectWidth >= 45) {
        directionInc *= -1;
      }
    }
    ctx.restore();
  }

  // PLATFORMS

  function getRandomBlockX() {
    let block = new CollisionBlock({ x: 0, y: 0 });
    let xRange =
      Math.random() * (W - block.width - block.width * 2) + block.width;
    return Math.round(xRange);
  }

  function createRandomPlatforms() {
    let block = new CollisionBlock({ x: 0, y: 0 });
    const currentTime = Date.now();

    if (currentTime - lastPlatformCreationTime > PLATFORM_CREATION_INTERVAL) {
      let newX;

      if (allPlatforms.length > 0) {
        let lastPlatform = allPlatforms[allPlatforms.length - 1];
        let minRange = lastPlatform.position.x - block.width;
        let maxRange = lastPlatform.position.x + block.width;

        do {
          newX = getRandomBlockX();
        } while (newX >= minRange && newX <= maxRange);
      } else {
        newX = getRandomBlockX(); // For the first platform
      }

      allPlatforms.push(
        new CollisionBlock(
          { position: { x: newX, y: 0 - block.height } },
          "platform"
        )
      );
      lastPlatformCreationTime = currentTime;
    }
  }

  function updatePlatforms() {
    allPlatforms.forEach((platform, i) => {
      platform.update();

      if (platform.position.y > H) {
        allPlatforms.splice(i, 1);
      }
    });
  }

  // BIRDS

  function getRandomBirdY() {
    let bird = new CollisionBlock({ x: 0, y: 0 });
    let yRange =
      Math.random() * (H - bird.height - bird.height * 2) + bird.height;
    return Math.round(yRange);
  }

  function createRandomBirds() {
    let bird = new CollisionBlock({ x: 0, y: 0 });
    const currentTime = Date.now();

    if (currentTime - lastBirdCreationTime > BIRD_CREATION_INTERVAL) {
      let newY;

      if (allBirds.length > 0) {
        let lastBird = allBirds[allBirds.length - 1];
        let minRange = lastBird.position.y - lastBird.height;
        let maxRange = lastBird.position.y + lastBird.height;

        do {
          newY = getRandomBirdY();
        } while (newY >= minRange && newY <= maxRange);
      } else {
        newY = getRandomBirdY(); // For the first bird
      }

      allBirds.push(
        new CollisionBlock({ position: { x: 0 - bird.width, y: newY } }, "bird")
      );
      lastBirdCreationTime = currentTime;
    }
  }

  function updateBirds() {
    allBirds.forEach((bird, i) => {
      bird.update();

      if (bird.position.x > W) {
        allBirds.splice(i, 1);
      }
    });
  }

  //
  //
  //

  function drawBgImage() {
    if (!isBgLoaded) {
      backgroundImage = new Image();
      backgroundImage.src = "../images/cardio/bg.svg";

      backgroundImage.onload = function () {
        ctx.drawImage(backgroundImage, 0, 0, W, H);
        isBgLoaded = true;
      };
    } else {
      ctx.drawImage(backgroundImage, 0, 0, W, H);
    }
  }

  function handleClick(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handlePlaqueClick(mouseX, mouseY);
  }

  function handlePlaqueClick(mouseX, mouseY) {
    if (!ActiveInits.isCardioActive) {
      return;
    }
    if (isClickWithinBounds(mouseX, mouseY, backPlaqueBounds)) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1, // duration of the fade in seconds
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          currentMode.mode = Modes.STARTING_MENU;
          ActiveInits.isStartingMenuActive = true;
          ActiveInits.isCardioActive = false;
          overlay.opacity = 0;
        },
      });
    }
  }

  /* Used to change rectSize from Player.js page */
  function setMovingRectWidthToHalf() {
    movingRectWidth = 45 / 2;
  }

  function resetRotation() {
    players[0].rotation = 0;
    players[0].rotationDirection = -1;
    movingRectWidth = 45 / 2;
  }

  window.addEventListener("keydown", (e) => {
    // rotate

    if (e.code === "KeyR" && ActiveInits.isCardioActive) {
      players[0].isRotating = !players[0].isRotating;

      // reset position when stopping to rotate
      if (!players[0].isRotating) {
        resetRotation();
      }
    }

    // jump
    if (players[0]?.isInAir === false) {
      switch (e.code) {
        case "Digit1":
        case "Numpad1":
          players[0].jump(-3);
          break;
        case "Digit2":
        case "Numpad2":
          players[0].jump(-5);
          break;
        case "Digit3":
        case "Numpad3":
          players[0].jump(-6);
          break;
        case "Digit4":
        case "Numpad4":
          players[0].jump(-7);
          break;
        case "Digit5":
        case "Numpad5":
          players[0].jump(-9);
          break;
        case "Digit6":
        case "Numpad6":
          players[0].jump(-10);
          break;
        case "Digit7":
        case "Numpad7":
          players[0].jump(-11);
          break;
        case "Digit8":
        case "Numpad8":
          players[0].jump(-12);
          break;
        case "Digit9":
        case "Numpad9":
          players[0].jump(-13);
          break;
        case "Digit0":
        case "Numpad0":
          players[0].jump(-14);
          break;
      }
    }
  });

  return {
    init: init,
    setMovingRectWidthToHalf: setMovingRectWidthToHalf,
  };
})();
