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
    current: 4, // Loading
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
      LOADING: 8,
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
    loading: true,
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
