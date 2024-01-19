// THIS FILE IS FOR SETTING ALL SOURCES FROM THE GAME TO BE PRE LOADED

export const sources = [
  "/images/cardio/bg.svg",
  "/images/cardio/bird.svg",
  "/images/cardio/cloud.svg",
  "/images/cardio/player.svg",
  "/images/cardio/collectible_gem.svg",
  "/images/gems/gem_agility.svg",
  "/images/gems/gem_cardio.svg",
  "/images/gems/gem_strength.svg",
  "/images/gems/gem_inactive.svg",
  "/images/plaque_back.svg",
  "/images/portrait/rotatePhone.svg",
  "/images/restart/selectedIcon.svg",
  "/images/startingMenu/bg.svg",
  "/images/startingMenu/plaque.svg",
  "/images/startingMenu/plaqueGems.svg",
  "/images/startingMenu/sprite_agility.svg",
  "/images/startingMenu/sprite_cardio.svg",
  "/images/startingMenu/sprite_strength.svg",
];

export const assetsState = {
  total: sources.length,
  complete: 0,
};

/* export const sources = {
  images: [
    "/images/cardio/bg.svg",
    "/images/gems/gem_agility.svg",
    "/images/gems/gem_cardio.svg",
    "/images/gems/gem_strength.svg",
    "/images/gems/gem_inactive.svg",
    "/images/gems/plaque_back.svg",
    "/images/portrait/rotatePhone.svg",
    "/images/restart/selectedIcon.svg",
    "/images/startingMenu/bg.svg",
    "/images/startingMenu/plaque.svg",
    "/images/startingMenu/plaqueGems.svg",
    "/images/startingMenu/sprite_agility.svg",
    "/images/startingMenu/sprite_cardio.svg",
    "/images/startingMenu/sprite_strength.svg",
  ],
  audio: [
    // ... other audio files
  ],
  videos: [
    // ... video files
  ],
  fonts: [
    // ... font files
  ],
}; */

// inspiration to use in main.js in the future when I add Audio

/* function loadAssets(allAssets) {
  assetCount = allAssets;
  if (!assetCount || assetCount.length === 0) {
    return;
  }
  if (this.assets) {
    assetsToLoad = assetCount.length;

    for (let i = 0; i < assetCount.length; i++) {
      if (this.assets[i].var != undefined) {
        if (this.assets[i].var.nodeName == "IMG") {
          beginLoadingImage(assetCount[i].var, assetCount[i].file);
        }
        if (assetCount[i].var.nodeName == "AUDIO") {
          beginLoadingAudio(assetCount[i].var, assetCount[i].file);
        }
      }
    }
  }
}

function launchIfReady() {
  completedAssetsCount += 1;
  if (assetsToLoad === completedAssetsCount) {
    console.log("oi");
    mode = Modes.STARTING_MENU;
  }
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.onload = () => launchIfReady();
  imgVar.src = fileName;
}

function beginLoadingAudio(audioVar, fileName) {
  audioVar.src = fileName;
  audioVar.addEventListener("canplay", () => launchIfReady());
} */
