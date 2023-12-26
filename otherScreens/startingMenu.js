const startingMenu = (function () {
  const options = ["CARDIO", "AGILITY", "STRENGTH"];
  let selectedIndex = -1; // -1 means, none selected
  const rectangles = []; // all rectangles
  const c_gray = "#C9C9C9";
  const c_darkGray = "#939393";

  function init() {
    ctx.clearRect(0, 0, W, H);

    // Options placement & proportions
    const rectHeights = 50;
    const rectPosYOffsets = [-100, 0, 100];
    const rectWidths = [180, 205, 250];

    // Draw rectangles
    for (let i = 0; i < options.length; i++) {
      const posY = H / 2 - rectHeights / 2 + rectPosYOffsets[i];
      const rectWidth = rectWidths[i];
      const rectPosX = W - W / 4 - rectWidth / 2 - 50; // Calculate x position based on width

      rectangles[i] = {
        x: rectPosX,
        y: posY,
        width: rectWidth,
        height: rectHeights,
      };

      drawTextAndRect(i); // Initial drawing of rectangles
    }

    canvas.addEventListener("click", handleClick);
  }

  function drawTextAndRect(index, color, borderColor) {
    const rect = rectangles[index];
    const text = options[index];

    // Draw rectangle without shadow
    ctx.shadowColor = "transparent"; // Disable shadow for rectangle
    ctx.fillStyle = "white";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    // Text style settings
    ctx.fillStyle = index === selectedIndex ? color : c_gray;
    ctx.font = "40px RetroGaming";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Enable shadow for text
    ctx.shadowColor = index === selectedIndex ? borderColor : c_darkGray;
    ctx.shadowOffsetY = 4;
    ctx.shadowOffsetX = 2;

    // Calculate text position
    const textX = rect.x + rect.width / 2;
    const textY = rect.y + rect.height / 2;

    // Draw text
    ctx.fillText(text, textX, textY);
  }

  function handleClick(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i];
      if (
        mouseX >= rect.x &&
        mouseX <= rect.x + rect.width &&
        mouseY >= rect.y &&
        mouseY <= rect.y + rect.height
      ) {
        // Non selected properties
        if (selectedIndex >= 0) {
          drawTextAndRect(selectedIndex, c_gray, c_darkGray);
        }

        // Update the selected index
        selectedIndex = i;
        console.log(selectedIndex);

        // Selected properties
        drawTextAndRect(i, "#FFD43E", "#2A2900");

        // Example: renderGameMode(options[i].toLowerCase());
        return;
      }
    }
  }

  return {
    init: init,
  };
})();
