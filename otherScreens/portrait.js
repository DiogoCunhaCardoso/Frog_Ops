const portrait = (function () {
  ("use strict");

  const spaceBetween = 12;

  function init() {
    ctx.fillStyle = "#EDEDED";
    ctx.fillRect(0, 0, W, H);
    drawImage();
    drawText();
  }

  function drawText() {
    ctx.save();

    const posYOffsets = [
      spaceBetween * scaleFactor,
      spaceBetween * 2 * scaleFactor,
    ];
    const textLines = ["PLEASE ROTATE", "YOUR DEVICE"];

    for (let i = 0; i < textLines.length; i++) {
      const fontSize = 8 * scaleFactor;

      // Set font size and style
      ctx.font = `${fontSize}px RetroGaming`;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#5F5F5F";

      // Center the text horizontally and vertically
      const x = W / 2;
      const y = H / 2 + posYOffsets[i];

      // Draw the text
      ctx.fillText(textLines[i], x, y + rotateImage.height / 2);
    }

    ctx.restore();
  }

  let rotateImage = new Image();
  rotateImage.src = "../images/portrait/rotatePhone.svg";

  function drawImage() {
    const x = (W - rotateImage.width * scaleFactor) / 2;
    const y =
      H / 2 - rotateImage.height * scaleFactor + spaceBetween * scaleFactor;

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