export const skinsState = {
  ui: {
    background: {
      image: new Image(),
      imagePath: "../../images/skins/bg.svg",
    },
    coin: {
      image: new Image(),
      imagePath: "../../images/coin.svg",
    },
    closeIcon: {
      image: new Image(),
      imagePath: "../../images/close.svg",
    },
    btn: {
      bounds: [],
    },
  },
  skins: {
    selectedIndex: 0,
    currentlyUsingIndex: 0,
    all: [
      {
        name: "DEFAULT",
        price: "0",
        color: "red",
        image: new Image(),
        imagePath: "../../images/skins/skins/default.svg",
      },
      {
        name: "MAFIA",
        price: "200",
        color: "blue",
        image: new Image(),
        imagePath: "../../images/skins/skins/mafia.svg",
      },
      {
        name: "YEEHAW",
        price: "500",
        color: "green",
        image: new Image(),
        imagePath: "../../images/skins/skins/yeehaw.svg",
      },
      {
        name: "PIRATE",
        price: "700",
        color: "purple",
        image: new Image(),
        imagePath: "../../images/skins/skins/default.svg",
      },
      {
        name: "CYFROG",
        price: "1000",
        color: "yellow",
        image: new Image(),
        imagePath: "../../images/skins/skins/mafia.svg",
      },
    ],
    // colors will be images soon
    bounds: [],
  },
  keys: {
    all: ["ArrowLeft", "ArrowRight"],
  },
  actions: {
    ChangeToPrevIndex: (state) => {
      state.skins.selectedIndex =
        (state.skins.selectedIndex - 1 + state.skins.all.length) %
        state.skins.all.length;
    },
    ChangeToNextIndex: (state) => {
      state.skins.selectedIndex =
        (state.skins.selectedIndex + 1) % state.skins.all.length;
    },
    GetPrevIndex: (state) => {
      return (
        (state.skins.selectedIndex - 1 + state.skins.all.length) %
        state.skins.all.length
      );
    },
    GetNextIndex: (state) => {
      return (state.skins.selectedIndex + 1) % state.skins.all.length;
    },
    IsPrevSkinAvailable: (state) => {
      return state.skins.selectedIndex > 0;
    },
    IsNextSkinAvailable: (state) => {
      return state.skins.selectedIndex < state.skins.all.length - 1;
    },
  },
  isSkinsReseted: false,
};
