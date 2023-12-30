// for functions used in multiple places
//
//

/* Loads and draws the plaques images, sets the plaqueBounds to
  be used for interaction detection in other parts of the code. */

function drawPlaque(image, imageSrc, scale, position, bounds) {
  // Only set the source if it hasn't been set yet
  if (!image.src) {
    image.src = imageSrc;

    image.onload = () => {
      // Set bounds dimensions based on image size and scale factor
      bounds.x = position.x;
      bounds.y = position.y;
      bounds.width = image.width * scale;
      bounds.height = image.height * scale;

      // Draw the image
      ctx.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height);
    };
  } else {
    // If image already loaded, draw the image directly
    ctx.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height);
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
