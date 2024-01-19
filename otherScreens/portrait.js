import { appState as app } from "../app_state.js";
import { ctx, scaleFactor } from "../main.js";
import { colors } from "../utils/style.js";

export const portrait = (function () {
  ("use strict");

  let spaceBetween = 12;

  function init() {
    ctx.fillStyle = colors.bg_light;
    ctx.fillRect(0, 0, app.canvas.W, app.canvas.H);
    drawImage();
    drawText();
  }

  function drawText() {
    ctx.save();

    let posYOffsets = [
      spaceBetween * scaleFactor,
      spaceBetween * 2 * scaleFactor,
    ];
    let textLines = ["PLEASE ROTATE", "YOUR DEVICE"];

    for (let i = 0; i < textLines.length; i++) {
      let fontSize = 8 * scaleFactor;

      // Set font size and style
      ctx.font = `${fontSize}px RetroGaming`;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = colors.brown;

      // Center the text horizontally and vertically
      let x = app.canvas.W / 2;
      let y = app.canvas.H / 2 + posYOffsets[i];

      // Draw the text
      ctx.fillText(textLines[i], x, y + rotateImage.height / 2);
    }

    ctx.restore();
  }

  let rotateImage = new Image();
  rotateImage.src = "../images/portrait/rotatePhone.svg";

  function drawImage() {
    let x = (app.canvas.W - rotateImage.width * scaleFactor) / 2;
    let y =
      app.canvas.H / 2 -
      rotateImage.height * scaleFactor +
      spaceBetween * scaleFactor;

    ctx.drawImage(
      rotateImage,
      x,
      y,
      rotateImage.width * scaleFactor,
      rotateImage.height * scaleFactor
    );
  }

  return {
    init: init,
  };
})();
