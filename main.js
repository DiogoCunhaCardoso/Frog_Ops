import { startingMenu } from "./otherScreens/StartingMenu/startingMenu.js";
import { cardio } from "./gameModes/Cardio/cardio_logic.js";
import { agility } from "./gameModes/Agility/agility_logic.js";
import { strength } from "./gameModes/Strength/strength_logic.js";
import { gems } from "./otherScreens/Gems/gems_logic.js";
import { portrait } from "./otherScreens/portrait.js";
import { restart } from "./otherScreens/Restart/restart_logic.js";
import { success } from "./otherScreens/success.js";
import { skins } from "./otherScreens/Skins/skins_logic.js";
import { loading } from "./otherScreens/loading.js";
import { applyCanvasSlideOut, overlay } from "./utils/utils.js";
import { cState } from "./gameModes/Cardio/cardio_state.js";
import { assetsState, sources } from "./utils/preloader.js";
import { startingMenuState as sState } from "./otherScreens/StartingMenu/startingMenu_state.js";
import { appState as app } from "./app_state.js";
import { strengthState } from "./gameModes/Strength/strength_state.js";
import { gemsState } from "./otherScreens/Gems/gems_state.js";
import { skinsState } from "./otherScreens/Skins/skins_state.js";
import { optionsMenu } from "./otherScreens/optionsMenu.js";

export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

window.onload = () => {
  checkScreenOrientation();
  initializeCoinCountAndSkin();
 /*  loadAssets(); */
  setCanvasSize();
  checkIfTouchScreen();
  render();
};

function initializeCoinCountAndSkin() {
  if (localStorage.getItem("coinCount") === null) {
    localStorage.setItem("coinCount", "0");
  }
  if (localStorage.getItem("skinNo0") === null) {
    localStorage.setItem("skinNo0", "purchased");
  }
}

function loadAssets() {
  if (
    !sources ||
    sources === 0 ||
    app.modes.current === app.modes.all.PORTRAIT /* || !app.isLandscape */
  ) {
    return;
  }

  let oneSecondPassed = false;

  function finishedLoading() {
    app.modes.current = app.modes.all.STARTING_MENU;
    app.initActive.startingMenu = true;
    app.initActive.loading = false;
    overlay.y = 0;
  }

  // Check if a second has passed and assets are loaded
  setTimeout(() => {
    oneSecondPassed = true;
    if (assetsState.complete === assetsState.total) {
      gsap.to(overlay, {
        y: app.canvas.H,
        duration: 0.6,
        onUpdate: () => {
          applyCanvasSlideOut(loading.init, startingMenu.init);
        },
        onComplete: () => {
          finishedLoading();
        },
      });
    }
  }, 1000);

  // Load assets
  for (let i = 0; i < sources.length; i++) {
    let image = new Image();
    image.src = sources[i];
    image.onload = function () {
      assetsState.complete++;
      // Check both conditions
      if (assetsState.complete === assetsState.total && oneSecondPassed) {
        gsap.to(overlay, {
          y: app.canvas.H,
          duration: 0.6,
          onUpdate: () => {
            applyCanvasSlideOut(loading.init, startingMenu.init);
          },
          onComplete: () => {
            finishedLoading();
          },
        });
      }
    };
  }
}

/* Scale factor, things are written as for 320px wide
   screen and they have times scale factor for every size */

function checkIfTouchScreen() {
  if (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  ) {
    app.isTouchDevice = true;
  } else {
    app.isTouchDevice = false;
  }
}

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
  if (app.modes.current === 5) {
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

  app.canvas.H = canvas.height;
  app.canvas.W = canvas.width;

  // Scale factor update might be necessary if you rely on it elsewhere
  scaleFactor = app.canvas.W / baseWidth;
  scaleHeightFactor = app.canvas.H / baseHeight;
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

function checkScreenOrientation() {
  if (
    window.innerWidth < window.innerHeight &&
    app.modes.current !== app.modes.all.PORTRAIT
  ) {
    app.isLandscape = false;
    app.modes.previous = app.modes.current;
    app.modes.current = app.modes.all.PORTRAIT;
  } else if (
    window.innerWidth >= window.innerHeight &&
    app.modes.current === app.modes.all.PORTRAIT
  ) {
    app.isLandscape = true;
    app.modes.current =
      app.modes.previous !== undefined ? app.modes.previous : 0;
  }
}

const startInit = [
  startingMenu.init,
  cardio.init,
  agility.init,
  strength.init,
  gems.init,
  portrait.init,
  restart.init,
  success.init,
  skins.init,
  loading.init,
  optionsMenu.init,
];

// FRAMERATE CONSISTENCY
// https://chriscourses.com/blog/standardize-your-javascript-games-framerate-for-different-monitors

let lastTime = window.performance.now();
let frames = 0; // to log frames

function StandardizeFramerate() {
  const now = window.performance.now();
  const msPassed = now - lastTime;

  if (msPassed < app.frames.msPerFrame) {
    return false;
  }

  const excessTime = msPassed % app.frames.msPerFrame;
  lastTime = now - excessTime;
  frames++;
  return true;
}

function render() {
  if (StandardizeFramerate()) {
    startInit[app.modes.current]();
  }
  window.requestAnimationFrame(render);
}

/* setInterval(() => {
  console.log(frames);
  frames = 0;
}, 1000); */

const debouncedResize = debounce(() => {
  checkScreenOrientation();
  setCanvasSize();
  if (app.initActive.cardio) cState.isGameReseted = false;
  if (app.initActive.startingMenu) sState.isPageReseted = false;
  if (app.initActive.gems) gemsState.isGemsReseted = false;
  if (app.initActive.strength) strengthState.isGameReseted = false;
  if (app.initActive.skins) skinsState.isSkinsReseted = false;
}, 200);

window.addEventListener("resize", debouncedResize);
