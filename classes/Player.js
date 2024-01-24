import { ctx, scaleFactor, scaleHeightFactor } from "../main.js";
import { collision } from "../utils/utils.js";
import { overlay, applyCanvasOpacity } from "../utils/utils.js";
import { Sprite } from "./Sprite.js";
import { cState } from "../gameModes/Cardio/cardio_state.js";
import { appState as app } from "../app_state.js";

export class Player extends Sprite {
  constructor({
    position,
    allPlatforms,
    allBirds,
    imageSrc,
    frameRate,
    frameBuffer,
  }) {
    super({ position, imageSrc, frameRate, frameBuffer });

    this.velocity = {
      x: 0,
      y: 1,
    };
    // rotating
    this.isRotating = false;
    this.rotationDirection = -1;
    this.rotation = 0;

    this.isInAir = true;
    this.gravity = 0.1;

    // for collision
    this.allPlatforms = allPlatforms; // platforms
    this.landedPlatforms = new Set(); // Set = stores only unique values
    this.allBirds = allBirds; // birds

    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 0,
      height: 0,
    };

    // for points & coins
    this.score = 0;
    this.coinLandings = null;
  }

  draw() {
    ctx.save();
    // PIVOT POINT AND ROTATION
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height
    );
    if (this.isRotating) {
      ctx.rotate((this.rotation * Math.PI) / 180);
    }

    // move on x axis when jumping
    this.position.x += this.velocity.x;
    //Draw Player
    this.drawSprite(true);
    ctx.restore();
  }

  update() {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.width,
      this.hitbox.height
    );
    this.updateFrames();
    //
    this.updateHitbox();
    this.draw();
    if (this.isRotating) {
      this.rotatePlayer();
    }
    this.screenWrapAroundCanvas();
    this.updateHitbox();
    this.checkForHorizontalPlatformCollisions();
    this.gravityAndHitGround();
    this.updateHitbox();
    this.checkForBirdCollisions();
    this.updateHitbox();
    this.checkForVerticalPlatformCollisions();
    ctx.restore();
  }

  //

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 8.2 * scaleFactor,
        y: this.position.y + 3 * scaleFactor,
      },
      width: 16 * scaleFactor,
      height: 22 * scaleFactor,
    };
  }

  rotatePlayer() {
    let step = 0.5;
    if (this.rotation < -45 || this.rotation > 45) {
      this.rotationDirection *= -1;
    }
    this.rotation += step * this.rotationDirection;
  }

  /* Enables an object to reappear on the opposite
  side of the canvas when it moves off one side. */

  screenWrapAroundCanvas() {
    if (this.position.x <= 0) {
      this.position.x = app.canvas.W - this.width;
    } else if (this.position.x >= app.canvas.W - this.width) {
      this.position.x = 0;
    }
  }

  gravityAndHitGround() {
    // gravity
    this.position.y += this.velocity.y;
    // collision
    if (
      this.position.y + this.height + this.velocity.y <
      app.canvas.H - 6 * scaleFactor
    ) {
      this.velocity.y += this.gravity * scaleHeightFactor;
    } else {
      // hit ground
      this.isInAir = false;
      this.velocity.y = 0;
      this.velocity.x = 0;
    }
  }

  /* Checks for horizontal collisions between the player and each platform.
   - On leftward collision: stops leftward motion, positions player to the right of the platform.
   - On rightward collision: stops rightward motion, positions player to the left of the platform. */

  checkForHorizontalPlatformCollisions() {
    const bounceBack = 1 * scaleFactor;

    for (let i = 0; i < this.allPlatforms.length; i++) {
      const platform = this.allPlatforms[i];

      if (
        collision({
          object1: this.hitbox,
          object2: platform,
        })
      ) {
        if (this.velocity.x > 0) {
          // hit left
          this.velocity.x = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = platform.position.x - offset - bounceBack;
          break;
        }
        if (this.velocity.x < 0) {
          // hit right
          this.velocity.x = 0;

          const offset = this.hitbox.position.x - this.position.x;

          this.position.x =
            platform.position.x + platform.width - offset + bounceBack;
          break;
        }
      }
    }
  }

  /* Checks for vertical collisions between the player and each platform.
   - On top collision: stops downward and horizontal motion, places player on platform & increments score.
   - On bottom collision: stops upward motion, positions player below the platform so he can go back down. */

  checkForVerticalPlatformCollisions() {
    for (let i = 0; i < this.allPlatforms.length; i++) {
      const platform = this.allPlatforms[i];

      if (
        collision({
          object1: this.hitbox,
          object2: platform,
        })
      ) {
        if (this.velocity.y > 0) {
          // hit top
          this.isInAir = false;
          this.velocity.y = 0;
          this.velocity.x = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = platform.position.y - offset - 0.01 * scaleFactor;
          if (!this.landedPlatforms.has(platform.id)) {
            // Increment score only if not already landed
            this.score++;
            this.incrementCoinCount();
            this.landedPlatforms.add(platform.id);
          }
          break;
        }
        if (this.velocity.y < 0) {
          // hit bottom
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            platform.position.y + platform.height - offset + 1 * scaleFactor; // avoid overlapping
          break;
        }
      }
    }
  }

  incrementCoinCount() {
    // Increment the landing counter
    this.coinLandings = this.coinLandings + 1;

    if (this.coinLandings % 2 === 0) {
      let currentCoinCount = parseInt(
        localStorage.getItem("coinCount") || "0",
        10
      );
      currentCoinCount++;
      localStorage.setItem("coinCount", currentCoinCount.toString());
    }
  }

  checkForBirdCollisions() {
    for (let i = 0; i < this.allBirds.length; i++) {
      const bird = this.allBirds[i];

      if (
        collision({
          object1: this.hitbox,
          object2: bird,
        })
      ) {
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.5,
          onUpdate: applyCanvasOpacity,
          onComplete: () => {
            app.modes.current = app.modes.all.RESTART;
            app.initActive.cardio = false;
            app.initActive.restart = true;
            overlay.opacity = 0;
          },
        });
        cState.stats.gameOver = {
          gameMode: "Cardio",
          score: cState.player.allPlayers[0]?.score,
          maxScore: 25,
        };
        cState.isGameReseted = false;
      }
    }
  }

  jump(speed) {
    this.isRotating = false;
    this.isInAir = true;
    this.velocity.y = speed; /* scaleFactor */
    this.velocity.x = (this.rotation / 20) * scaleFactor; // divide so it moves slower
    this.rotation = 0;
    this.rotationDirection = -1;
    cState.ui.movingRectWidth = 45 / 2;
  }
}
