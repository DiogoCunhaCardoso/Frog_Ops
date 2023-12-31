const gems = (function () {
  ("use strict");

  let hasGems = {
    cardioGem: hasGem("cardioGem"),
    agilityGem: hasGem("agilityGem"),
    strengthGem: hasGem("strengthGem"),
  };
  const modes = ["CARDIO", "AGILITY", "STRENGTH"];
  const goBackPlaque = new Image();
  let backPlaqueBounds = {};

  function init() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#F1F5FF";
    ctx.fillRect(0, 0, W, H);
    drawGemsAndText();
    drawPlaque(
      goBackPlaque,
      "../images/gems/plaque_back.svg",
      { x: 0, y: 0 },
      backPlaqueBounds,
      () => {
        backPlaqueBounds.x = backPlaqueBounds.width / 2;
        backPlaqueBounds.y = 0;
      }
    );
    canvas.addEventListener("click", handleClick);
  }

  function hasGem(gemName) {
    return localStorage.getItem(gemName) !== null;
  }

  // will be used when you finish a game in the future
  /*   function NewGemAquired(gem) {
    localStorage.setItem(gem, true);
  }
  NewGemAquired("agilityGem"); */

  function drawGemsAndText() {
    const gemImages = {
      cardioGem: "../images/gems/gem_cardio.svg",
      agilityGem: "../images/gems/gem_agility.svg",
      strengthGem: "../images/gems/gem_strength.svg",
      inactiveGem: "../images/gems/gem_inactive.svg",
    };

    const rectPosXOffsets = [-70 * scaleFactor, 0, 70 * scaleFactor];

    ctx.save();

    // Set font for text
    ctx.font = `${7 * scaleFactor}px RetroGaming`; // Adjust font size and style as needed
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

      const gemX =
        W / 2 - (gemImage.width * scaleFactor) / 2 + rectPosXOffsets[i];
      const gemY =
        H / 2 - (gemImage.height * scaleFactor) / 2 - 7 * scaleFactor; // half of 14

      // Draw the gem image
      ctx.drawImage(
        gemImage,
        gemX,
        gemY,
        gemImage.width * scaleFactor,
        gemImage.height * scaleFactor
      );

      // Draw the text under the gem
      const textY = gemY + gemImage.height * scaleFactor + 14 * scaleFactor; // 14 = separation from image
      ctx.fillText(modes[i], gemX + (gemImage.width / 2) * scaleFactor, textY);
    }

    ctx.restore();
  }

  function handleClick(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    handlePlaqueClick(mouseX, mouseY);
  }

  function handlePlaqueClick(mouseX, mouseY) {
    if (!isGemsInitActive) {
      return;
    }
    if (
      mouseX >= backPlaqueBounds.x &&
      mouseX <= backPlaqueBounds.x + backPlaqueBounds.width &&
      mouseY >= backPlaqueBounds.y &&
      mouseY <= backPlaqueBounds.y + backPlaqueBounds.height
    ) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 1, // duration of the fade in seconds
        onUpdate: applyCanvasOpacity,
        onComplete: () => {
          currentMode.mode = 0;
          isStartingMenuActive = true;
          isGemsInitActive = false;
          overlay.opacity = 0;
        },
      });
    }
  }

  return {
    init: init,
  };
})();
