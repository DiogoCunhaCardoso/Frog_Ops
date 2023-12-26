const startingMenu = (function () {
  let optionSelected = null;
  function init() {
    selectOptions();
  }

  function selectOptions() {
    const width = 250;
    const height = H / 24;
    const posX = W - width - W / 5;
    const posYOffsets = [-100, 0, 100]; // Offsets for posY
    posYOffsets.forEach((offset) => {
      const posY = H / 2 - height / 2 + offset;

      ctx.beginPath();
      ctx.rect(posX, posY, width, height);
      ctx.stroke();
    });
  }

  return {
    init: init,
  };
})();
