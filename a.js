const startingMenu = (function () {
  const options = ["Cardio", "Agility", "Strength"];
  let selectedOption = null;
  let selectedIndex = -1; // Selected
  const rectangles = [];

  function init() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < options.length; i++) {
      const x = W / 2 - 50;
      const y = H / 2 + i * 40;
      const width = 100;
      const height = 30;

      rectangles[i] = { x, y, width, height };

      drawRectangle(i, "gray"); // Initial drawing of rectangles
    }

    canvas.addEventListener("click", handleClick);
  }

  function drawRectangle(index, color) {
    const rect = rectangles[index];

    // Draw rectangle
    ctx.fillStyle = color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    // Draw text on rectangle
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(options[index], rect.x + 10, rect.y + 20);
  }

  function handleClick(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i];
      if (
        mouseX > rect.x &&
        mouseX < rect.x + rect.width &&
        mouseY > rect.y &&
        mouseY < rect.y + rect.height
      ) {
        if (selectedIndex >= 0) {
          // Reset the previous rectangle's color
          drawRectangle(selectedIndex, "gray");
        }

        selectedOption = options[i];
        selectedIndex = i; // Update the selected index

        // Change color of the clicked rectangle
        drawRectangle(i, "green");

        /* renderGameMode(selectedOption.toLowerCase()); */
        return;
      }
    }
  }

  return {
    init: init,
  };
})();
