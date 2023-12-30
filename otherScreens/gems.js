const gems = (function () {
  ("use strict");

  let scale = 4.5;
  let hasGems = {
    cardioGem: true,
    agilityGem: true,
    strengthGem: true,
  };
  const modes = ["CARDIO", "AGILITY", "STRENGTH"];
  const gemsPlaqueImage = new Image();
  let gemsPlaqueBounds = {};

  function init() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#F1F5FF";
    ctx.fillRect(0, 0, W, H);
    drawGemsAndText();
    drawPlaque(
      gemsPlaqueImage,
      "../images/startingMenu/plaque_back.svg",
      4,
      { x: 50, y: 0 },
      gemsPlaqueBounds
    );
    canvas.addEventListener("click", handleClick);
  }

  function drawGemsAndText() {
    const gemImages = {
      cardioGem: "../images/gems/gem_cardio.svg",
      agilityGem: "../images/gems/gem_agility.svg",
      strengthGem: "../images/gems/gem_strength.svg",
      inactiveGem: "../images/gems/gem_inactive.svg",
    };

    const rectPosXOffsets = [-340, 0, 340];

    // Set font for text
    ctx.font = "40px RetroGaming"; // Adjust font size and style as needed
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < modes.length; i++) {
      let gemImage = new Image();
      let textColor;

      switch (modes[i]) {
        case "CARDIO":
          gemImage.src = hasGems.cardioGem
            ? gemImages.cardioGem
            : gemImages.inactiveGem;
          textColor = hasGems.cardioGem ? "#008C88" : "#A7A7A7";
          break;
        case "AGILITY":
          gemImage.src = hasGems.agilityGem
            ? gemImages.agilityGem
            : gemImages.inactiveGem;
          textColor = hasGems.agilityGem ? "#FC4FA2" : "#A7A7A7"; // Updated this line
          break;
        case "STRENGTH":
          gemImage.src = hasGems.strengthGem
            ? gemImages.strengthGem
            : gemImages.inactiveGem;
          textColor = hasGems.strengthGem ? "#9C46A5" : "#A7A7A7"; // Updated this line
          break;
        default:
          gemImage.src = gemImages.inactiveGem;
          textColor = "#A7A7A7";
      }

      // Set the fill style for the text
      ctx.fillStyle = textColor;

      const gemX = W / 2 - (gemImage.width * scale) / 2 + rectPosXOffsets[i];
      const gemY = H / 2 - (gemImage.height * scale) / 2 - 25;

      // Draw the gem image
      ctx.drawImage(
        gemImage,
        gemX,
        gemY,
        gemImage.width * scale,
        gemImage.height * scale
      );

      // Draw the text under the gem
      const textY = gemY + gemImage.height * scale + 50; // Adjust 30 to position text below the gem
      ctx.fillText(modes[i], gemX + (gemImage.width * scale) / 2, textY);
    }
  }

  function handleClick(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handlePlaqueClick(mouseX, mouseY);
  }

  function handlePlaqueClick(mouseX, mouseY) {
    if (
      mouseX >= gemsPlaqueBounds.x &&
      mouseX <= gemsPlaqueBounds.x + gemsPlaqueBounds.width &&
      mouseY >= gemsPlaqueBounds.y &&
      mouseY <= gemsPlaqueBounds.y + gemsPlaqueBounds.height
    ) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1, // duration of the fade in seconds
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          currentMode.mode = 0;
          isStartingMenuActive = true;
          overlay.opacity = 0;
        },
      });
    }
  }

  return {
    init: init,
  };
})();
