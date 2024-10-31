import { appState as app } from "../../app_state.js";
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
      speed: 10,
    },
  },
  sprite: {
    all: [
      {
        image: new Image(),
        imagePath: [
          "../images/startingMenu/sprite_cardio.svg",
          "../images/startingMenu/sprite_cardio_yeehaw.svg",
          "../images/startingMenu/sprite_cardio_mafia.svg",
        ],
        totalFrames: 4,
        speed: 5,
      },
      {
        image: new Image(),
        imagePath: [
          "../images/startingMenu/sprite_agility.svg",
          "../images/startingMenu/sprite_agility_yeehaw.svg",
          "../images/startingMenu/sprite_agility_mafia.svg",
        ],
        totalFrames: 10,
        speed: 6,
      },
      {
        image: new Image(),
        imagePath: [
          "../images/startingMenu/sprite_strength.svg",
          "../images/startingMenu/sprite_strength_yeehaw.svg",
          "../images/startingMenu/sprite_strength_mafia.svg",
        ],
        totalFrames: 10,
        speed: 7,
      },
    ],
  },
  keys: {
    all: ["ArrowUp", "ArrowDown", "Enter"],
    inits: ["cardio", "agility", "strength"],
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
    app.initActive[selectedInit] = true;
  } else {
    console.error(
      `Init doesn't exist for index ${state.options.selectedIndex}`
    );
  }

  gsap.to(overlay, {
    opacity: 1,
    duration: 0.2,
    onUpdate: applyCanvasOpacity,
    onComplete: () => {
      app.modes.current = state.options.selectedIndex + 1;
      app.initActive.startingMenu = false;
      overlay.opacity = 0;
      state.isPageReseted = false;
    },
  });
}
