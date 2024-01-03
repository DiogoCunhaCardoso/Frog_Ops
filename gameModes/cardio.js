import { ctx, canvas, W, H, ActiveInits, currentMode } from "../main.js";
import { overlay, applyCanvasOpacity, drawPlaque } from "../utils.js";
import { Player } from "../classes/Player.js";
import { CollisionBlock } from "../classes/CollisionBlock.js";

export let cardio = (function () {
  ("use strict");

  // for player.update()
  let players = [];

  // for createRandomPlatforms()
  let allPlatforms = [];
  let lastPlatformCreationTime = Date.now();
  const PLATFORM_CREATION_INTERVAL = 2000;

  // for drawPlaque()
  let goBackPlaque = new Image();
  let backPlaqueBounds = {};

  // for drawBgImage()
  let isBgLoaded = false;
  let backgroundImage = null;

  function init() {
    ctx.clearRect(0, 0, W, H);
    // defining player here
    players.push(
      new Player({
        position: { x: 400, y: 75 },
        allPlatforms,
      })
    );

    /* players[0].position.x = 0 + players[0].width / 2; */
    /* player.position.y = H - player.height; */

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
    players[0].update();
    // platforms
    createRandomPlatforms();
    updatePlatforms();

    canvas.addEventListener("click", handleClick);
  }

  function getRandomBlockX() {
    let block = new CollisionBlock({ x: 0, y: 0 });
    return (
      Math.round(Math.random() * (W - block.width - block.width * 2)) +
      block.width
    );
  }

  function createRandomPlatforms() {
    let block = new CollisionBlock({ x: 0, y: 0 });
    const currentTime = Date.now();
    if (currentTime - lastPlatformCreationTime > PLATFORM_CREATION_INTERVAL) {
      allPlatforms.push(
        new CollisionBlock({
          x: getRandomBlockX(),
          y: 0 - block.height,
        })
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
    if (
      mouseX >= backPlaqueBounds.x &&
      mouseX <= backPlaqueBounds.x + backPlaqueBounds.width &&
      mouseY >= backPlaqueBounds.y &&
      mouseY <= backPlaqueBounds.y + backPlaqueBounds.height
    ) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1, // duration of the fade in seconds
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          currentMode.mode = 0;
          ActiveInits.isStartingMenuActive = true;
          ActiveInits.isCardioActive = false;
          overlay.opacity = 0;
        },
      });
    }
  }

  window.addEventListener("keydown", (e) => {
    // rotate

    if (e.code === "KeyR") {
      players[0].isRotating = !players[0].isRotating;
    }

    // jump
    if (players[0].isInAir === false) {
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
  };
})();
