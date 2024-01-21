import { appState as app } from "../app_state.js";
import { ctx, scaleFactor } from "../main.js";
import { colors } from "./style.js";

// THIS FILE IS FOR FUNCTIONS USED IN VARIOUS PLACES

export function drawPlaque(image, imageSrc, position, bounds, callback) {
  // Only set the source if it hasn't been set yet
  if (!image.src) {
    image.src = imageSrc;

    image.onload = () => {
      // Set bounds dimensions based on image size and scale factor
      bounds.width = (image.width * scaleFactor) / 1.4;
      bounds.height = (image.height * scaleFactor) / 1.4;
      bounds.x = position.x;
      bounds.y = position.y - bounds.height; // Adjust Y position based on image height

      // Draw the image
      ctx.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height);

      // Call the callback function
      if (callback) {
        callback();
      }
    };
  } else {
    // If image already loaded, draw the image directly
    ctx.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height);
    if (callback) {
      callback();
    }
  }
}

export let overlay = {
  opacity: 0,
  y: 0,
};

export function applyCanvasOpacity() {
  ctx.save();
  ctx.globalAlpha = overlay.opacity;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, app.canvas.W, app.canvas.H);
  ctx.restore();
}

export function applyCanvasSlideOut(init, nextInit) {
  ctx.clearRect(0, 0, app.canvas.W, app.canvas.H);
  nextInit();
  ctx.save();
  ctx.translate(0, -overlay.y);
  init();
  ctx.restore();
}

export function isClickWithinBounds(mouseX, mouseY, bounds) {
  return (
    mouseX >= bounds.x &&
    mouseX <= bounds.x + bounds.width &&
    mouseY >= bounds.y &&
    mouseY <= bounds.y + bounds.height
  );
}

export function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

export function drawButton({
  text,
  x,
  y,
  width,
  height,
  dark = colors.yellow,
  light = colors.yellow_light,
}) {
  ctx.save();
  // Draw the button background
  ctx.lineWidth = 2 * scaleFactor;
  ctx.strokeStyle = colors.brown;
  ctx.shadowColor = colors.brown;
  ctx.fillStyle = dark;
  ctx.shadowOffsetY = 1 * scaleFactor;
  ctx.strokeRect(x, y, width, height);
  ctx.fillRect(x, y, width, height);
  ctx.restore();

  // Draw the top part of the button
  ctx.fillStyle = light;
  ctx.fillRect(x, y, width, height / 3);

  // Text styling
  ctx.save();
  const fontSize = 5 * scaleFactor;
  ctx.font = `${fontSize}px RetroGaming`;
  ctx.fillStyle = colors.white;
  ctx.strokeStyle = colors.brown;
  ctx.shadowColor = colors.brown;
  ctx.lineWidth = 1.2 * scaleFactor;
  ctx.shadowOffsetY = 0.6 * scaleFactor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Calculate text position for centering
  const textX = x + width / 2;
  const textY = y + height / 2;
  // Draw the text
  ctx.strokeText(text, textX, textY);
  ctx.fillText(text, textX, textY);
  ctx.restore();
}

export function NewGemAquired(gem) {
  localStorage.setItem(gem, true);
}
