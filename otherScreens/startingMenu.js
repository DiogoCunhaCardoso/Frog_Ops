const startingMenu = (function () {
  /*
   * Global Variables
   */

  const options = ["CARDIO", "AGILITY", "STRENGTH"];
  let selectedIndex = -1; // none selected
  const rectangles = []; // to interact with
  let plaqueBounds = {};
  const c_gray = "#C9C9C9";
  const c_darkGray = "#939393";

  // Images
  let isBgLoaded = false;
  let backgroundImage = null;

  /* Initializes other functions
  all in one place to be called as 'init' */

  function init() {
    //Clear canvas after each frame
    ctx.clearRect(0, 0, W, H);

    //Draw background Image
    drawBgImage();

    //
    if (isBgLoaded == true) {
      animateSquare();
      drawGameName();
      drawOptions();
      drawPlaque();
    }
    //

    canvas.addEventListener("click", handleClick);
  }

  let squareY = 0;
  function animateSquare() {
    const squareSize = 50;
    const squareSpeed = 2;

    ctx.fillStyle = "red";
    ctx.fillRect(400 - squareSize / 2, squareY, squareSize, squareSize);

    squareY += squareSpeed;
    if (squareY > H) squareY = -squareSize;
  }

  function drawBgImage() {
    if (!isBgLoaded) {
      backgroundImage = new Image();
      backgroundImage.src = "../images/startingMenu/bg.png";

      backgroundImage.onload = function () {
        ctx.drawImage(backgroundImage, 0, 0, W, H);
        isBgLoaded = true;
      };
    } else {
      ctx.drawImage(backgroundImage, 0, 0, W, H);
    }
  }

  /* Loads and draws the plaque image, sets the plaqueBounds to
  be used for interaction detection in other parts of the code. */

  function drawPlaque() {
    const plaqueImage = new Image(); // Renamed variable
    plaqueImage.src = "../images/startingMenu/plaque.png";
    let scale = 0.5;

    plaqueImage.onload = function () {
      plaqueBounds = {
        x: W - 240,
        y: H - H / 4.75,
        width: plaqueImage.width * scale,
        height: plaqueImage.height * scale,
      };

      ctx.drawImage(
        plaqueImage,
        plaqueBounds.x,
        plaqueBounds.y,
        plaqueBounds.width,
        plaqueBounds.height
      );
    };

    plaqueImage.onerror = function () {
      console.error("Failed to load plaque image.");
    };
  }

  /* Draws the text of the game name 
   using shadow effects for the look */

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
      ctx.fillText("FROG", 96, 60);
    });

    // Draw "OPS"
    shadowOffsets.forEach((offset) => {
      ctx.shadowOffsetX = offset.x;
      ctx.shadowOffsetY = offset.y;
      ctx.fillText("OPS", 80, 110);
    });
  }

  /* Draws the text and its corresponding 
   invisible hitbox for menu options. */

  function drawTextAndHitbox(index, color, borderColor) {
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

  /* Uses 'drawTextAndHitbox' to draw the interactive menu options.
  Sets up positioning and dimensions for each option. */

  function drawOptions() {
    // Options placement & proportions
    const rectHeights = 50;
    const rectPosYOffsets = [-100, 0, 100];
    const rectWidths = [180, 205, 250];

    // Draw Interactive Elements
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

      drawTextAndHitbox(i); // Initial drawing of rectangles
    }
  }

  /* Handles mouse click events, managing game option selections
  and plaque clicks to redirect to specified destination. */

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
          drawTextAndHitbox(selectedIndex, c_gray, c_darkGray);
        }

        // Update the selected index
        selectedIndex = i;
        console.log(selectedIndex);

        // Selected properties

        drawTextAndHitbox(i, "#FFD43E", "#2A2900");

        // Example: renderGameMode(options[i].toLowerCase());
        return;
      }
    }
  }

  return {
    init: init,
  };
})();
