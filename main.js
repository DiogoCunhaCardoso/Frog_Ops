/* import { startingMenu } from "./otherScreens/startingMenu"; */

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let H, W;

/* Ensures the canvas is always
   with the correct Ratio of 16/9 */

function setCanvasSize() {
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

  H = canvas.height;
  W = canvas.width;

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

function checkOrientation() {
  if (window.innerWidth < window.innerHeight) {
    alert(
      "Please rotate your device to landscape mode for the best experience."
    );
  }
}

//
function render() {
  window.requestAnimationFrame(render);
  startingMenu.init();
}

/* render(); */

window.onload = function () {
  setCanvasSize();
  render();
  checkOrientation();
};

const debouncedResize = debounce(() => setCanvasSize());
window.addEventListener("resize", debouncedResize, checkOrientation);
