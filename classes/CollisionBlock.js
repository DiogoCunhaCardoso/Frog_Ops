import { ctx, scaleFactor } from "../main.js";

export class CollisionBlock {
  /*  static lastId = 0; // starts at 0 */

  constructor({ position }, type) {
    /* this.id = CollisionBlock.lastId++; // maybe I need this to solve the score issue after */
    this.position = position;
    this.velocity = {
      y: 0.15 * scaleFactor,
      x: 0.1 * scaleFactor,
    };
    this.height = 16 * scaleFactor;
    this.width = 44 * scaleFactor;
    this.type = type; // 'bird' or 'platform'
  }

  draw() {
    if (this.type === "platform") {
      ctx.fillStyle = "white";
    } else if (this.type === "bird") {
      ctx.fillStyle = "red";
    }
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.checkType();
  }

  checkType() {
    if (this.type === "bird") {
      this.position.x += this.velocity.x; // Horizontal movement for birds
    } else if (this.type === "platform") {
      this.position.y += this.velocity.y; // Vertical movement for platforms
    }
  }
}
