import { ctx, canvas, W, H, ActiveInits, currentMode, Modes } from "../main.js";
import { overlay, applyCanvasOpacity, drawPlaque } from "../utils/utils.js";

export let strength = (function () {
  ("use strict");

  // for drawPlaque()
  let goBackPlaque = new Image();
  let backPlaqueBounds = {};

  function init() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "black";
    drawCenteredText("Strength Soon");

    drawPlaque(
      goBackPlaque,
      "../images/plaque_back.svg",
      { x: 0, y: 0 },
      backPlaqueBounds,
      () => {
        backPlaqueBounds.x = backPlaqueBounds.width / 2;
        backPlaqueBounds.y = 0;
      }
    );
    canvas.addEventListener("click", handleClick);
  }

  function drawCenteredText(text) {
    ctx.save();
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let centerX = W / 2;
    let centerY = H / 2;

    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  }

  function handleClick(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handlePlaqueClick(mouseX, mouseY);
  }

  function handlePlaqueClick(mouseX, mouseY) {
    if (!ActiveInits.isStrengthActive) {
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
          currentMode.mode = Modes.STARTING_MENU;
          ActiveInits.isStartingMenuActive = true;
          ActiveInits.isStrengthActive = false;
          overlay.opacity = 0;
        },
      });
    }
  }

  return {
    init: init,
  };
})();
