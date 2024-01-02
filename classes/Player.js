import { ctx, W, H } from "../main.js";

let gravity = 0.1;

export class Player {
  constructor(position) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.height = 50;
    this.width = 50;

    // rotating
    this.isRotating = false;
    this.rotationDirection = 1;
    this.rotation = 0;

    this.isInAir = true;
  }

  // SETTERS AND GETTERS

  setIsInAir(value) {
    this.isInAir = value;
  }

  getIsInAir() {
    return this.isInAir;
  }

  //

  draw() {
    ctx.save(); // Save state

    // set pivot point
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    // apply rotation
    if (this.isRotating) {
      ctx.rotate((this.rotation * Math.PI) / 180);
    }

    // move on x axis when jumping
    this.position.x += this.velocity.x;

    // Draw the rectangle around the new origin
    ctx.fillStyle = "red";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore(); // Restore original state
    ctx.font = "48px serif";
    ctx.fillText(`${this.rotation}`, W - 100, 50);
  }

  update() {
    this.draw();
    if (this.isRotating) {
      this.rotatePlayer();
    }
    this.gravityAndHitGround();
  }

  //

  rotatePlayer() {
    let step = 1;
    if (this.rotation < -45 || this.rotation > 45) {
      this.rotationDirection *= -1;
    }
    this.rotation += step * this.rotationDirection;
  }

  gravityAndHitGround() {
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y < H) {
      this.velocity.y += gravity;
      this.isInAir = true;
      this.rotation = 0; // reset rotation after jump
    } else {
      this.velocity.y = 0;
      this.velocity.x = 0;
      this.isInAir = false;
    }
  }

  jump(speed) {
    this.isRotating = false;
    this.isInAir = true;
    this.velocity.y = speed;
    this.velocity.x = this.rotation / 10; // divide so it moves slower
  }
}
