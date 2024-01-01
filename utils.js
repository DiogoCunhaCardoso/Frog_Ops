// for functions used in multiple places
//
//

/* Loads and draws the plaques images, sets the plaqueBounds to
  be used for interaction detection in other parts of the code. */

function drawPlaque(image, imageSrc, position, bounds, callback) {
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

const overlay = {
  opacity: 0,
};

function applyCanvasOpacity() {
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
