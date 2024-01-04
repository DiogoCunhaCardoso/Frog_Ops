import { ctx, scaleFactor } from "../main.js";

export class CollisionBlock {
  constructor(position) {
    this.position = position;
    this.velocity = {
      y: 0.15 * scaleFactor,
    };
    this.height = 16 * scaleFactor;
    this.width = 44 * scaleFactor;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
  }
}
