import { ctx, W, H } from "../main.js";

export let strength = (function () {
  "use strict";

  function init() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "white";
    drawCenteredText("Strength");
  }

  function drawCenteredText(text) {
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let centerX = W / 2;
    let centerY = H / 2;

    ctx.fillText(text, centerX, centerY);
  }

  return {
    init: init,
  };
})();
