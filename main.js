// main.js
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const H = (canvas.height = window.innerHeight);
const W = (canvas.width = window.innerWidth);

const GameModes = {};

function renderGameMode(mode) {
  const script = document.createElement("script");
  script.src = `gameModes/${mode}.js`;
  document.head.appendChild(script);

  script.onload = function () {
    GameModes[mode].init();
  };
}

startingMenu.init();
