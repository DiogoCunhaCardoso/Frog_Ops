import { ctx, canvas, H, W, ActiveInits, currentMode } from "../main.js";
import { overlay, applyCanvasOpacity, drawPlaque } from "../utils.js";
import { Player } from "../classes/Player.js";
import { CollisionBlock } from "../classes/CollisionBlock.js";

export let cardio = (function () {
  ("use strict");
  let allPlatforms = [];

  let goBackPlaque = new Image();
  let backPlaqueBounds = {};

  let player;

  function init() {
    player = new Player({
      x: 75,
      y: 0,
    });

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
    player.update();

    canvas.addEventListener("click", handleClick);
  }

  // BACKGROUND
  let isBgLoaded = false;
  let backgroundImage = null;
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

  function getRandomBlockX() {
    return Math.round(
      Math.random() * (H - CollisionBlock.height - 2 * 100) + 100
    );
  }

  function createRandomPlatforms() {
    createRandomPlatforms();
    allPlatforms.push(
      new CollisionBlock({
        x: getRandomBlockX(),
        y: 50,
      })
    );
    setTimeout(createRandomPlatforms, 2000);
  }

  function updatePlatforms() {
    allPlatforms.forEach((platform, i) => {
      platform.update();

      if (platform.position.y > 642 - platform.height * 2) {
        allPlatforms.splice(i, 1);
      }
    });
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
      player.isRotating = !player.isRotating;
    }

    // jump
    if (player.getIsInAir === false) {
      switch (e.code) {
        case "Digit1":
        case "Numpad1":
          player.jump(-3);
          break;
        case "Digit2":
        case "Numpad2":
          player.jump(-5);
          break;
        case "Digit3":
        case "Numpad3":
          player.jump(-6);
          break;
        case "Digit4":
        case "Numpad4":
          player.jump(-7);
          break;
        case "Digit5":
        case "Numpad5":
          player.jump(-9);
          break;
        case "Digit6":
        case "Numpad6":
          player.jump(-10);
          break;
        case "Digit7":
        case "Numpad7":
          player.jump(-11);
          break;
        case "Digit8":
        case "Numpad8":
          player.jump(-12);
          break;
        case "Digit9":
        case "Numpad9":
          player.jump(-13);
          break;
        case "Digit0":
        case "Numpad0":
          player.jump(-14);
          break;
      }
    }
  });

  return {
    init: init,
  };
})();
