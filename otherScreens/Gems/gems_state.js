export const gemsState = {
  plaque: {
    image: new Image(),
    imagePath: "../images/startingMenu/plaqueGems.svg",
    bounds: {},
  },

  gems: {
    names: ["CARDIO", "AGILITY", "STRENGTH"],
    colors: ["gemBlue", "gemPink", "gemPurple"],
    all: [
      {
        image: new Image(),
        imagePath: "../images/gems/gem_cardio.svg",
      },
      {
        image: new Image(),
        imagePath: "../images/gems/gem_agility.svg",
      },
      {
        image: new Image(),
        imagePath: "../images/gems/gem_strength.svg",
      },
      {
        image: new Image(),
        imagePath: "../images/gems/gem_inactive.svg",
      },
    ],
  },
  isGemsReseted: false,
};

