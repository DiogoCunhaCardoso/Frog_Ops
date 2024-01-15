export const cState = {
  player: {
    allPlayers: [],
  },
  platform: {
    stopBuilding: false,
    allPlatforms: [],
    lastPlatformCreationTime: Date.now(),
    PLATFORM_CREATION_INTERVAL: 1500,
  },
  bird: {
    allBirds: [],
    lastBirdCreationTime: Date.now(),
    BIRD_CREATION_INTERVAL: 4500,
  },
  plaque: {
    image: new Image(),
    bounds: {},
  },
  background: {
    image: new Image(),
  },
  ui: {
    movingRectWidth: 45 / 2,
    directionInc: -0.25,
    btnRotateBounds: {},
    btnOneBounds: {},
    btnTwoBounds: {},
    btnThreeBounds: {},
  },
  gem: {
    obj: null,
  },
  stats: {
    gameOver: {
      gameMode: "",
      score: 0,
      maxScore: 0,
    },
    gameWon: {
      gameMode: "",
      score: 0,
    },
  },
  isGameReseted: false,
};
