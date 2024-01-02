import { ctx, W, H, scaleFactor } from "./main.js";
// for functions used in multiple places
//
//

/* Loads and draws the plaques images, sets the plaqueBounds to
  be used for interaction detection in other parts of the code. */

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

/* Draws the opacity rectangle with the 
  variable to be changed later with GSAP */

export let overlay = {
  opacity: 0,
};

export function applyCanvasOpacity() {
  ctx.save();
  ctx.globalAlpha = overlay.opacity;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function isClickWithinBounds(mouseX, mouseY, bounds) {
  return (
    mouseX >= bounds.x &&
    mouseX <= bounds.x + bounds.width &&
    mouseY >= bounds.y &&
    mouseY <= bounds.y + bounds.height
  );
}

function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}
