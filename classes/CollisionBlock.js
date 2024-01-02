import { ctx } from "../main.js";

export class CollisionBlock {
  constructor(position) {
    this.position = position;
    this.velocity = {
      y: 1,
    };
    this.height = 50;
    this.width = 150;
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
