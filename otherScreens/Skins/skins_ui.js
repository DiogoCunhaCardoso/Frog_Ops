import { Sprite } from "../../classes/Sprite.js";
import { skinsState as skState } from "./skins_state.js";

// IMAGES

export function initImages() {
  const bg = skState.background;
  bg.image = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: bg.imagePath,
  });
}

export function drawBgImage() {
  skState.background.image.drawSprite();
}
