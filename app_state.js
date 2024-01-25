export const appState = {
  canvas: {
    H: 0,
    W: 0,
    base: {
      WIDTH: 320,
      HEIGHT: 180,
    },
    scale: {
      get W() {
        return appState.canvas.W / appState.canvas.base.WIDTH;
      },
      get H() {
        return appState.canvas.W / appState.canvas.base.HEIGHT;
      },
    },
  },

  modes: {
    current: 8, // Loading
    previous: 0,
    all: {
      STARTING_MENU: 0,
      CARDIO: 1,
      AGILITY: 2,
      STRENGTH: 3,
      GEMS: 4,
      PORTRAIT: 5,
      RESTART: 6,
      SUCCESS: 7,
      SKINS: 8,
      LOADING: 9,
      OPTIONS_MENU: 10,
    },
  },

  initActive: {
    startingMenu: false,
    cardio: false,
    agility: false,
    strength: false,
    gems: false,
    portrait: false,
    restart: false,
    success: false,
    skins: false,
    loading: true,
    optionsMenu: false,
  },

  /* reset: {
    startingMenu: false,
    cardio: false,
    agility: false,
    strength: false,
    gems: false,
    portrait: false,
    restart: false,
    success: false,
    loading: false,
  }, */

  frames: {
    fps: 60,
    get msPerFrame() {
      return 1000 / appState.frames.fps;
    },
  },

  isTouchDevice: null,
  isLandscape: null,
};
