export const skinsState = {
  background: {
    image: new Image(),
    imagePath: "../../images/skins/bg.svg",
  },
  skins: {
    selectedIndex: 0,
    colors: ["red", "blue", "green", "purple", "yellow", "gray"],
    // colors will be images soon
    bounds: [],
  },
  keys: {
    all: ["ArrowLeft", "ArrowRight"],
  },
  actions: {
    ChangeToPrevIndex: (state) => {
      state.skins.selectedIndex =
        (state.skins.selectedIndex - 1 + state.skins.colors.length) %
        state.skins.colors.length;
    },
    ChangeToNextIndex: (state) => {
      state.skins.selectedIndex =
        (state.skins.selectedIndex + 1) % state.skins.colors.length;
    },
    GetPrevIndex: (state) => {
      return (
        (state.skins.selectedIndex - 1 + state.skins.colors.length) %
        state.skins.colors.length
      );
    },
    GetNextIndex: (state) => {
      return (state.skins.selectedIndex + 1) % state.skins.colors.length;
    },
    IsPrevSkinAvailable: (state) => {
      return state.skins.selectedIndex > 0;
    },
    IsNextSkinAvailable: (state) => {
      return state.skins.selectedIndex < state.skins.colors.length - 1;
    },
  },
  isSkinsReseted: false,
};
