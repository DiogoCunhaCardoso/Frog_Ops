import { startingMenu } from "./otherScreens/StartingMenu/startingMenu.js";
import { cardio } from "./gameModes/Cardio/cardio_logic.js";
import { agility } from "./gameModes/agility.js";
import { strength } from "./gameModes/strength.js";
import { gems } from "./otherScreens/gems.js";
import { portrait } from "./otherScreens/portrait.js";
import { restart } from "./otherScreens/restart.js";
import { success } from "./otherScreens/success.js";
import { loading } from "./otherScreens/loading.js";
import { sources } from "./utils/preloader.js";
import { applyCanvasSlideOut, overlay } from "./utils/utils.js";
import { cState } from "./gameModes/Cardio/cardio_state.js";
import { startingMenuState as sState } from "./otherScreens/StartingMenu/startingMenu_state.js";

let appState = {};

export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

export let H, W;

export let isTouchDevice = null;

/* Flags to disable or able 'pages' */

export const ActiveInits = {
  isStartingMenuActive: false,
  isGemsActive: false,
  isCardioActive: false,
  isAgilityActive: false,
  isStrengthActive: false,
  isRestartActive: false,
  isSuccessActive: false,
  isLoadingActive: true,
};

let assetCount = sources.length;
let completedAssetsCount = 0;

window.onload = () => {};

window.onload = function () {
  setModeFunctions();
  setCanvasSize();
  checkOrientation();
  loadAssets();
  checkIfTouchScreenDevice();
  render();
};

function loadAssets() {
  if (!sources || sources === 0) {
    return;
  }

  let oneSecondPassed = false;

  // Check if a second has passed and assets are loaded
  setTimeout(() => {
    oneSecondPassed = true;
    if (completedAssetsCount === assetCount) {
      gsap.to(overlay, {
        y: H,
        duration: 0.6,
        onUpdate: () => {
          applyCanvasSlideOut(loading.init, startingMenu.init);
        },
        onComplete: () => {
          currentMode.mode = Modes.STARTING_MENU;
          ActiveInits.isStartingMenuActive = true;
          ActiveInits.isLoadingActive = false;
          overlay.y = 0;
        },
      });
    }
  }, 1000);

  // Load assets
  for (let i = 0; i < sources.length; i++) {
    let image = new Image();
    image.src = sources[i];
    image.onload = function () {
      completedAssetsCount++;
      // Check both conditions
      if (completedAssetsCount === assetCount && oneSecondPassed) {
        gsap.to(overlay, {
          y: H,
          duration: 0.6,
          onUpdate: () => {
            applyCanvasSlideOut(loading.init, startingMenu.init);
          },
          onComplete: () => {
            currentMode.mode = Modes.STARTING_MENU;
            ActiveInits.isStartingMenuActive = true;
            ActiveInits.isLoadingActive = false;
            overlay.y = 0;
          },
        });
      }
    };
  }
}

/* Scale factor, things are written as for 320px wide
   screen and they have times scale factor for every size */

function checkIfTouchScreenDevice() {
  if (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  ) {
    isTouchDevice = true;
  } else {
    isTouchDevice = false;
  }
}

let scale = {
  width: 320,
  height: 180,
};
// Scale Factor
let baseWidth = 320;
let baseHeight = 180;
export let scaleFactor = window.innerWidth / baseWidth;
export let scaleHeightFactor = window.innerHeight / baseHeight;

/* let baseHeight = 180;
export let scaleHeightFactor = window.innerWidth / baseHeight; */

/* Ensures the canvas is always
   with the correct Ratio of 16/9 */

function setCanvasSize() {
  if (currentMode.mode === 5) {
    // In portrait mode, occupy the full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  } else {
    // For other modes, maintain a 16:9 aspect ratio
    const aspectRatioWidth = 16;
    const aspectRatioHeight = 9;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    if (windowHeight < windowWidth * (aspectRatioHeight / aspectRatioWidth)) {
      canvas.height = windowHeight;
      canvas.width = canvas.height * (aspectRatioWidth / aspectRatioHeight);
    } else {
      canvas.width = windowWidth;
      canvas.height = canvas.width * (aspectRatioHeight / aspectRatioWidth);
    }
  }

  H = canvas.height;
  W = canvas.width;

  // Scale factor update might be necessary if you rely on it elsewhere
  scaleFactor = W / baseWidth;
  scaleHeightFactor = H / baseHeight;

  render();
}

/* Delays the execution of a function until after a period of
   inactivity, reduces unnecessary function calls,
   improves performance, and enhances user experience */

function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/* Checks if it is in portrait mode so it gives
   an alert to rotate into landscape mode*/

let storedMode; // store mode before changing

function checkOrientation() {
  if (
    window.innerWidth < window.innerHeight &&
    currentMode.mode !== Modes.PORTRAIT
  ) {
    storedMode = currentMode.mode; // Store current mode only when not already in portrait mode

    currentMode.mode = 5;
  } else if (
    window.innerWidth >= window.innerHeight &&
    currentMode.mode === 5
  ) {
    currentMode.mode = storedMode !== undefined ? storedMode : 0; // Return to the previous mode or default if not set
  }
}

export const Modes = {
  STARTING_MENU: 0,
  CARDIO: 1,
  AGILITY: 2,
  STRENGTH: 3,
  GEMS: 4,
  PORTRAIT: 5,
  RESTART: 6,
  SUCCESS: 7,
  LOADING: 8,
};

export let currentMode = {
  mode: Modes.LOADING, // LOADING
  modes: [],
  run: function () {
    this.modes[this.mode]();
  },
};

// Dynamically set the mode functions
function setModeFunctions() {
  currentMode.modes = [
    startingMenu.init,
    cardio.init,
    agility.init,
    strength.init,
    gems.init,
    portrait.init,
    restart.init,
    success.init,
    loading.init,
  ];
}

// FRAMERATE CONSISTENCY

// https://chriscourses.com/blog/standardize-your-javascript-games-framerate-for-different-monitors

let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;
let frames = 0; // to log frames

function StandardizeFramerate() {
  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  if (msPassed < msPerFrame) return;

  const excessTime = msPassed % msPerFrame;
  msPrev = msNow - excessTime;

  frames++; // to log frames
}

function render() {
  window.requestAnimationFrame(render);
  currentMode.run();
  StandardizeFramerate();
}

// Log Framerate
setInterval(() => {
  console.log(frames);
}, 1000);

const debouncedResize = debounce(() => {
  scaleFactor = window.innerWidth / baseWidth;
  scaleHeightFactor = window.innerHeight / baseHeight;
  checkOrientation();
  setCanvasSize();
  render();
  if (ActiveInits.isCardioActive) cState.isGameReseted = false;
  if (ActiveInits.isStartingMenuActive) sState.isPageReseted = false;
}, 200);

window.addEventListener("resize", debouncedResize);
