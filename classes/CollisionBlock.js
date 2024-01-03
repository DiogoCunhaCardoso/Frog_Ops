import { ctx, scaleFactor } from "../main.js";

export class CollisionBlock {
  constructor(position) {
    this.position = position;
    this.velocity = {
      y: 1,
    };
    this.height = 16 * scaleFactor;
    this.width = 44 * scaleFactor;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
  }
}
