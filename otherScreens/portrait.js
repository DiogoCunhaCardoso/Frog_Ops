const portrait = (function () {
  ("use strict");

  function init() {
    ctx.fillStyle = "#EDEDED";
    ctx.fillRect(0, 0, W, H);
    drawText();
  }

  function drawText() {
    ctx.save();

    const posYOffsets = [0, 12 * scaleFactor];
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
      ctx.fillText(textLines[i], x, y);
    }

    ctx.restore();
  }

  return {
    init: init,
  };
})();
