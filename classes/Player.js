import { ctx, W, H, scaleFactor } from "../main.js";
import { collision } from "../utils.js";

let gravity = 0.1;

export class Player {
  constructor({ position, allPlatforms }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.height = 30 * scaleFactor;
    this.width = 25 * scaleFactor;

    // rotating
    this.isRotating = false;
    this.rotationDirection = -1;
    this.rotation = 0;

    this.isInAir = true;

    // for collision
    this.allPlatforms = allPlatforms;

    // for points
    this.score = 0;
  }

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
    ctx.fillStyle = "purple";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore(); // Restore original state
  }

  update() {
    this.draw();
    if (this.isRotating) {
      this.rotatePlayer();
    }
    this.checkForCanvasCollision();
    this.checkForHorizontalCollisions();
    this.gravityAndHitGround();
    this.checkForVerticalCollisions();
  }

  //

  rotatePlayer() {
    let step = 0.5;
    if (this.rotation < -45 || this.rotation > 45) {
      this.rotationDirection *= -1;
    }
    this.rotation += step * this.rotationDirection;
  }

  checkForCanvasCollision() {
    if (this.position.x <= 0) {
      this.position.x = W - this.width;
    } else if (this.position.x >= W - this.width) {
      this.position.x = 0;
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.allPlatforms.length; i++) {
      const platform = this.allPlatforms[i];

      if (
        collision({
          object1: this,
          object2: platform,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.position.x = platform.position.x - this.width - 0.01;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          this.position.x = platform.position.x + platform.width + 0.01;
          break;
        }
      }
    }
  }

  gravityAndHitGround() {
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y < H - 6 * scaleFactor) {
      this.velocity.y += gravity;
      this.isInAir = true;
      this.rotation = 0; // reset rotation after jump
    } else {
      this.velocity.y = 0;
      this.velocity.x = 0;
      this.isInAir = false;
    }
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.allPlatforms.length; i++) {
      const platform = this.allPlatforms[i];

      if (
        collision({
          object1: this,
          object2: platform,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.velocity.x = 0;
          this.position.y = platform.position.y - this.height - 0.01;
          this.score++;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y = platform.position.y + platform.height + 0.01;
          break;
        }
      }
    }
  }

  jump(speed) {
    this.isRotating = false;
    this.isInAir = true;
    this.velocity.y = speed;
    this.velocity.x = this.rotation / 10; // divide so it moves slower
  }
}
