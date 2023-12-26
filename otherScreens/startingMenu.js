const startingMenu = (function () {
  /*
   * Global Variables
   */

  const options = ["CARDIO", "AGILITY", "STRENGTH"];
  let selectedIndex = -1; // -1 means, none selected
  const rectangles = []; // all rectangles
  let plaqueBounds = {}; // plaque area
  const c_gray = "#C9C9C9";
  const c_darkGray = "#939393";

  function init() {
    ctx.clearRect(0, 0, W, H);
    drawBgImage(() => {
      // Options placement & proportions
      const rectHeights = 50;
      const rectPosYOffsets = [-100, 0, 100];
      const rectWidths = [180, 205, 250];

      // Draw rectangles
      for (let i = 0; i < options.length; i++) {
        const posY = H / 2 - rectHeights / 2 + rectPosYOffsets[i];
        const rectWidth = rectWidths[i];
        const rectPosX = W - W / 4 - rectWidth / 2 - 40;

        rectangles[i] = {
          x: rectPosX,
          y: posY,
          width: rectWidth,
          height: rectHeights,
        };

        drawTextAndRect(i); // Initial drawing of rectangles
      }

      drawGameName();
      handlePlaque();
      /*  */
      /*  */
    });

    canvas.addEventListener("click", handleClick);
  }

  function drawBgImage(onLoadCallback) {
    const backgroundImage = new Image();
    backgroundImage.src = "../images/startingMenu/bg.png";

    backgroundImage.onload = function () {
      ctx.drawImage(backgroundImage, 0, 0, W, H);
      onLoadCallback(); // callback when image is loaded
    };
  }

  function handlePlaque() {
    const backgroundImage = new Image();
    backgroundImage.src = "../images/startingMenu/plaque.png";
    let scale = 0.5;

    backgroundImage.onload = function () {
      // Set plaqueBounds here
      plaqueBounds = {
        x: W - 240,
        y: H - H / 4.75,
        width: backgroundImage.width * scale,
        height: backgroundImage.height * scale,
      };

      ctx.drawImage(
        backgroundImage,
        plaqueBounds.x,
        plaqueBounds.y,
        plaqueBounds.width,
        plaqueBounds.height
      );
    };
  }

  function drawGameName() {
    const shadowOffsets = [
      { x: 4, y: 4 },
      { x: -3, y: 4 },
      { x: -3, y: -3 },
      { x: 4, y: -3 },
    ];

    // Common Styles
    ctx.font = "40px RetroGaming";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#4683DF"; // Text color
    ctx.strokeStyle = "#DCEAFF"; // Border color
    ctx.shadowColor = "#DCEAFF"; // Shadow color

    // Draw "FROG"
    shadowOffsets.forEach((offset) => {
      ctx.shadowOffsetX = offset.x;
      ctx.shadowOffsetY = offset.y;
      ctx.fillText("FROG", 92, 50);
    });

    // Draw "OPS"
    shadowOffsets.forEach((offset) => {
      ctx.shadowOffsetX = offset.x;
      ctx.shadowOffsetY = offset.y;
      ctx.fillText("OPS", 76, 110);
    });
  }

  function drawTextAndRect(index, color, borderColor) {
    const rect = rectangles[index];
    const text = options[index];

    // Disable properties on rectangle & draw it
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "transparent";
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

    if (
      mouseX >= plaqueBounds.x &&
      mouseX <= plaqueBounds.x + plaqueBounds.width &&
      mouseY >= plaqueBounds.y &&
      mouseY <= plaqueBounds.y + plaqueBounds.height
    ) {
      // Check if a game option is selected
      if (selectedIndex >= 0) {
        alert(`Going to ${options[selectedIndex]} game`);
      }
    }

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
