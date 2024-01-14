import { ctx, scaleFactor } from "../main.js";
import { Sprite } from "./Sprite.js";

export class CollisionBlock extends Sprite {
  constructor({ position, imageSrc, frameRate, frameBuffer }, type) {
    super({ position, imageSrc, frameRate, frameBuffer });
    this.position = position;
    this.velocity = {
      y: 0.15 * scaleFactor,
      x: 0.1 * scaleFactor,
    };
    this.height = 16 * scaleFactor;
    this.width = 44 * scaleFactor;
    this.type = type; // 'bird' | 'platform' | 'gem'
  }

  draw() {
    this.drawSprite();
  }

  update() {
    this.updateFrames()
    this.draw();
    this.checkType();
  }

  checkType() {
    if (this.type === "bird") {
      this.position.x -= this.velocity.x; // Horizontal movement for birds
    } else if (this.type === "platform" || this.type === "gem") {
      this.position.y += this.velocity.y; // Vertical movement for platforms
    }
  }
}
