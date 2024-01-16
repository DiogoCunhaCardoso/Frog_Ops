import { ActiveInits, currentMode } from "../../main.js";
import { applyCanvasOpacity, overlay } from "../../utils/utils.js";

export const startingMenuState = {
  options: {
    all: ["CARDIO", "AGILITY", "STRENGTH"],
    selectedIndex: 0,
    allBounds: [],
  },
  plaque: {
    gemImage: new Image(),
    gemBounds: {},
    nextImage: new Image(),
    nextBounds: {},
  },
  background: {
    image: new Image(),
  },
  sprite: {
    props: {
      image: new Image(),
      size: 32,
      currentFrame: 0,
      frameCount: 0,
    },
    all: [
      {
        imagePath: "../images/startingMenu/sprite_cardio.svg",
        totalFrames: 4,
        speed: 24,
      },
      {
        imagePath: "../images/startingMenu/sprite_agility.svg",
        totalFrames: 10,
        speed: 30,
      },
      {
        imagePath: "../images/startingMenu/sprite_strength.svg",
        totalFrames: 10,
        speed: 30,
      },
    ],
  },
  keys: {
    all: ["ArrowUp", "ArrowDown", "Enter"],
    inits: ["isCardioActive", "isAgilityActive", "isStrengthActive"],
    actions: {
      ArrowUp: (state) =>
        (state.options.selectedIndex - 1 + state.options.all.length) %
        state.options.all.length,
      ArrowDown: (state) =>
        (state.options.selectedIndex + 1) % state.options.all.length,
      Enter: handleEnterKey,
    },
  },
  isPageReseted: false,
};

// METHODS

function handleEnterKey(state) {
  const selectedInit = state.keys.inits[state.options.selectedIndex];
  if (selectedInit) {
    ActiveInits[selectedInit] = true;
  } else {
    console.error(
      `Init doesn't exist for index ${state.options.selectedIndex}`
    );
  }

  gsap.to(overlay, {
    opacity: 1,
    duration: 0.5,
    onUpdate: applyCanvasOpacity,
    onComplete: () => {
      currentMode.mode = state.options.selectedIndex + 1;
      ActiveInits.isStartingMenuActive = false;
      overlay.opacity = 0;
      state.isPageReseted = false;
    },
  });
}
