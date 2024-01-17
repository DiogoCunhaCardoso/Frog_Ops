import { ActiveInits, currentMode } from "../../main.js";
import { applyCanvasOpacity, overlay } from "../../utils/utils.js";

export const startingMenuState = {
  options: {
    all: ["CARDIO", "AGILITY", "STRENGTH"],
    selectedIndex: 0,
    allBounds: [],
  },
  plaque: {
    gem: {
      gemImage: new Image(),
      imagePath: "../images/startingMenu/plaqueGems.svg",
      gemBounds: {},
    },
    next: {
      nextImage: new Image(),
      imagePath: "../images/startingMenu/plaque.svg",

      nextBounds: {},
    },
  },
  background: {
    bg: {
      image: new Image(),
      imagePath: "../images/startingMenu/bg.svg",
    },
    snow: {
      image: new Image(),
      imagePath: "../images/startingMenu/snow.svg",
      totalFrames: 6,
      speed: 32,
    },
  },
  sprite: {
    all: [
      {
        image: new Image(),
        imagePath: "../images/startingMenu/sprite_cardio.svg",
        totalFrames: 4,
        speed: 24,
      },
      {
        image: new Image(),
        imagePath: "../images/startingMenu/sprite_agility.svg",
        totalFrames: 10,
        speed: 30,
      },
      {
        image: new Image(),
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
      Enter: handleNextPage,
    },
  },
  isPageReseted: false,
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

// METHODS

export function handleNextPage(state) {
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
