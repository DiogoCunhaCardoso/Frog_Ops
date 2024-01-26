export const cState = {
  player: {
    allPlayers: [],
    jumpForce: [-6.6, -8.6, -10.2],
  },
  platform: {
    stopBuilding: false,
    allPlatforms: [],
    lastPlatformCreationTime: Date.now(),
    PLATFORM_CREATION_INTERVAL: 3000,
  },
  bird: {
    allBirds: [],
    lastBirdCreationTime: Date.now(),
    BIRD_CREATION_INTERVAL: 10500,
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
    directionInc: -1,
    btnRotateBounds: {},
    btnOneBounds: {},
    btnTwoBounds: {},
    btnThreeBounds: {},
    questionImage: new Image(),
    coinImage: new Image(),
    coinImagepath: "../images/coin.svg",
    btnQuestionBounds: {},
  },
  gem: {
    obj: null,
    isCatched: null,
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
  isModalOpen: false,
  translateX: 0,
};
