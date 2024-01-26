import { ctx, scaleFactor } from "../../main.js";
import { cState } from "./cardio_state.js";
import { colors } from "../../utils/style.js";
import {
  applyCanvasOpacity,
  drawButton,
  isClickWithinBounds,
  overlay,
} from "../../utils/utils.js";
import { Sprite } from "../../classes/Sprite.js";
import { appState as app } from "../../app_state.js";
import { skinsState as skState } from "../../otherScreens/Skins/skins_state.js";

export function generalUI() {
  ctx.save();
  ctx.fillStyle = colors.brown;
  const FontSize = 7 * scaleFactor;
  ctx.font = `${FontSize}px RetroGaming`;
  ctx.textAlign = "right";

  //
  const padding = 8 * scaleFactor;
  const rectWidth = 45 * scaleFactor;
  const rectHeight = 6 * scaleFactor;

  // Calculate and draw Score
  const scoreText = "SCORE " + cState.player.allPlayers[0].score;
  const scoreTextWidth = ctx.measureText(scoreText).width;
  ctx.fillText(
    scoreText,
    app.canvas.W - padding * 2,
    padding + rectHeight / 2 + FontSize
  );

  const rectangleXPosition =
    app.canvas.W - padding * 3 - scoreTextWidth - rectWidth;
  const rectangleyPosition = padding + FontSize / 2 + 1 * scaleFactor;

  // Draw lightColor Rect
  ctx.fillStyle = colors.white;
  ctx.fillRect(rectangleXPosition, rectangleyPosition, rectWidth, rectHeight);

  // Draw Moving Rectangle
  ctx.fillStyle = colors.yellow;
  ctx.fillRect(
    rectangleXPosition,
    rectangleyPosition,
    cState.ui.movingRectWidth * scaleFactor,
    rectHeight
  );

  // Draw border of rectangle
  ctx.strokeStyle = colors.brown;
  ctx.lineWidth = 1 * scaleFactor;
  ctx.strokeRect(rectangleXPosition, rectangleyPosition, rectWidth, rectHeight);

  // Calculate and draw Rotation
  ctx.fillStyle = colors.brown;
  const rotationText =
    "ROT. " + Math.round(cState.player.allPlayers[0].rotation);
  ctx.fillText(
    rotationText,
    app.canvas.W - scoreTextWidth - rectWidth - padding * 3 - padding / 2, // x
    padding + rectHeight / 2 + FontSize // y
  );

  if (cState.player.allPlayers[0].isRotating) {
    cState.ui.movingRectWidth += cState.ui.directionInc;

    // Reverse the change direction at limits
    if (cState.ui.movingRectWidth <= 0 || cState.ui.movingRectWidth >= 45) {
      cState.ui.directionInc *= -1;
    }
  }
  ctx.restore();
}

export function touchScreenUI() {
  if (app.isTouchDevice) {
    ctx.save();
    drawTouchButtons();
    ctx.restore();
  }
}

function drawTouchButtons() {
  const buttonSize = 16 * scaleFactor;
  const buttonY = app.canvas.H - buttonSize * 2;
  const buttonSpacing = 8 * scaleFactor;

  const buttons = [
    { stateName: "Rotate", text: "R", x: buttonSize },
    { stateName: "Three", text: "3", x: app.canvas.W - buttonSize * 2 },
    {
      stateName: "Two",
      text: "2",
      x: app.canvas.W - buttonSize * 3 - buttonSpacing,
    },
    { stateName: "One", text: "1", x: app.canvas.W - buttonSize * 5 },
  ];

  buttons.forEach((button) => {
    const bounds = {
      x: button.x,
      y: buttonY,
      width: buttonSize,
      height: buttonSize,
    };
    cState.ui[`btn${button.stateName}Bounds`] = bounds;
    drawButton({ text: button.text, ...bounds });
  });
}

// Interactivity

export function checkClicksTouch(
  mouseX,
  mouseY,
  { rotateCb, oneCb, twoCb, threeCb }
) {
  if (isClickWithinBounds(mouseX, mouseY, cState.ui.btnRotateBounds)) {
    rotateCb();
  }
  if (isClickWithinBounds(mouseX, mouseY, cState.ui.btnOneBounds)) {
    oneCb();
  }
  if (isClickWithinBounds(mouseX, mouseY, cState.ui.btnTwoBounds)) {
    twoCb();
  }
  if (isClickWithinBounds(mouseX, mouseY, cState.ui.btnThreeBounds)) {
    threeCb();
  }
}

export function handlePlaqueClick(mouseX, mouseY) {
  if (!app.initActive.cardio) {
    return;
  }
  if (isClickWithinBounds(mouseX, mouseY, cState.plaque.bounds)) {
    gsap.to(overlay, {
      opacity: 1,
      duration: 1,
      onUpdate: applyCanvasOpacity,
      onComplete: () => {
        app.modes.current = app.modes.all.STARTING_MENU;
        app.initActive.startingMenu = true;
        app.initActive.cardio = false;
        overlay.opacity = 0;
        cState.isGameReseted = false;
      },
    });
  }
}

export function handleQuestionClick(mouseX, mouseY) {
  if (!app.initActive.cardio) {
    return;
  }

  if (
    !cState.isModalOpen &&
    isClickWithinBounds(mouseX, mouseY, cState.ui.btnQuestionBounds)
  ) {
    cState.isModalOpen = true;
    gsap.to(cState, {
      translateX: app.canvas.W / 3,
      duration: 0.4,
    });
  }

  if (
    cState.isModalOpen &&
    isClickWithinBounds(mouseX, mouseY, {
      x: 0,
      y: 0,
      width: app.canvas.W - app.canvas.W / 3,
      height: app.canvas.H,
    })
  ) {
    gsap.to(cState, {
      translateX: 0,
      duration: 0.4,
      onComplete: () => {
        cState.isModalOpen = false;
      },
    });
  }
}

// Images

export function initImages() {
  cState.background.image = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: "../images/cardio/bg.svg",
  });

  cState.plaque.image = new Sprite({
    position: { x: 8 * scaleFactor, y: 0 },
    imageSrc: "../images/plaque_back.svg",
  });

  if (!app.isTouchDevice) {
    cState.ui.questionImage = new Sprite({
      position: {
        x: app.canvas.W - 18 * scaleFactor,
        y: app.canvas.H - 18 * scaleFactor,
      },
      imageSrc: "../images/cardio/question.svg",
    });
  }

  const coinCountLength = ctx.measureText(skState.coinCount).width;
  const coin = cState.ui;
  coin.coinImage = new Sprite({
    position: {
      x: 28 * scaleFactor + coinCountLength * scaleFactor,
      y: 10 * scaleFactor,
    },
    imageSrc: cState.ui.coinImagepath,
  });
}

export function drawCoinCount() {
  ctx.save();
  const FontSize = 5 * scaleFactor;
  ctx.font = `${FontSize}px RetroGaming`;
  ctx.fillStyle = "black";
  ctx.fillText(skState.coinCount, 33 * scaleFactor, 16 * scaleFactor);

  cState.ui.coinImage.drawSprite();
  ctx.restore();
}

export function drawBgImage() {
  cState.background.image.drawSprite();
}

export function drawBackPlaque() {
  cState.plaque.image.drawSprite();
}

export function drawQuestion() {
  if (!app.isTouchDevice) {
    cState.ui.questionImage.drawSprite();
  }
}

let sidebarImage = new Image();
sidebarImage.src = "../../images/cardio/tutorial.svg";
export function drawSideBar() {
  if (cState.isModalOpen) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, app.canvas.W, app.canvas.H);

    ctx.globalAlpha = 1;

    if (sidebarImage.complete) {
      ctx.drawImage(
        sidebarImage,
        app.canvas.W - cState.translateX,
        0,
        app.canvas.W / 3,
        app.canvas.H
      );
    }
  }
}

// BOUNDS

export function initBounds() {
  cState.plaque.bounds = {
    x: 8 * scaleFactor,
    y: 7 * scaleFactor,
    width: 20 * scaleFactor,
    height: 13 * scaleFactor,
  };

  if (!app.isTouchDevice) {
    cState.ui.btnQuestionBounds = {
      x: app.canvas.W - 18 * scaleFactor,
      y: app.canvas.H - 18 * scaleFactor,
      width: 11 * scaleFactor,
      height: 12 * scaleFactor,
    };
  }
}
