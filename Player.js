class Player {
  constructor(spritesheet) {
    this.state = {
      animation: IDLE_ANIMATION,
      walk: PLAYER_STILL,
      fall: PLAYER_GROUNDED,
      direction: RIGHT,
      dashDirection: RIGHT
    }
    this.sprites = {
      image: spritesheet,
      x: 0,
      y: 0,
      width: 50,
      height: 74
    }
    this.counter = {
      jump: 0,
      jumpBuffer: 0,
      dash: 0,
      dashCooldown: 0,
      animation: {
        idle: 0,
        walk: 0,
      }
    }
    this.dashes = 1;
    this.dashHeld = false;
    this.dashEnd = false;
    this.jumpHeld = false;
    this.bothHeld = false;
    this.height = 51.9;
    this.width = 35;
    this.center = 17.5;
    this.acc = {
      x: 0,
      y: 0
    }
    this.vel = {
      x: 0,
      y: 0
    }
    this.pos = {
      x: 0,
      y: 0
    }
    this.respawn = {
      x: 0,
      y: 0
    }
    this.hitbox = {
      xOff: 4.2,
      yOff: 22.4,
      x: 0,
      y: 0,
      width: 26.6,
      height: 29.4
    }
    this.cap = {
      direction: UP,
      changed: false,
      xOff: 0,
      yOff: 2.8,
      x: 0,
      y: 0,
      width: 35,
      height: 22.4,
    }
  }

  spawn(entrance) {
    player = new Player(this.sprites.image) //reset player
    player.pos.x = entrance.x;
    player.pos.y = entrance.y - player.height;
    player.respawn.x = entrance.x;
    player.respawn.y = entrance.y;
    //keysPressed.ArrowUp = false;
    //keysPressed.ArrowRight = false;
    //keysPressed.ArrowDown = false;
    //keysPressed.ArrowLeft = false;
    keysPressed.z = false;
    //keysPressed.x = false;
    keysPressed.c = false;
    //keysPressed.w = false;
    //keysPressed.d = false;
    //keysPressed.s = false;
    //keysPressed.a = false;
    keysPressed.j = false;
    //keysPressed.k = false;
    keysPressed.l = false;
  }

  runHeight() {
    return 1.4 * round(abs((this.counter.animation.walk / 3) % 4 - 2)); //see graph at https://www.desmos.com/calculator/hw9folsq0m
  }

  changeAnimation(animation, width, height, hbx, hby, hbWidth, hbHeight, capx, capy, capWidth, capHeight, dy = 0) {
    this.state.animation = animation;
    this.sprites.width = 10 / 7 * (this.width = width);
    this.sprites.height = 10 / 7 * (this.height = height);
    this.hitbox.xOff = hbx;
    this.hitbox.yOff = hby;
    this.hitbox.width = hbWidth;
    this.hitbox.height = hbHeight;
    this.cap.xOff = capx;
    this.cap.yOff = capy;
    this.cap.width = capWidth;
    this.cap.height = capHeight;
    this.center = (hbWidth - 0.7) / 2 + hbx;
    this.pos.y += dy;
  }

  update() {
    if (gamestate == GAME_DEAD || this.pos.y > map.level.map[0].length * 25) {
      gamestate = GAME_PLAYING;
      this.spawn(this.respawn);
      //frameCount = 0;
      return;
    }
    let onGround = map.level.map[floor((this.hitbox.x) / BLOCK_SIZE)]?.[round(this.hitbox.y + this.hitbox.height) / BLOCK_SIZE] === 1 || map.level.map[floor((this.hitbox.x + this.hitbox.width) / BLOCK_SIZE)]?.[round(this.hitbox.y + this.hitbox.height) / BLOCK_SIZE] === 1;
    let capXOff = this.state.direction === RIGHT ? this.cap.xOff : 2 * this.hitbox.xOff + this.hitbox.width - this.cap.xOff - this.cap.width - 0.7;
    let prev = {
      x: this.pos.x + this.hitbox.xOff,
      y: this.pos.y + this.hitbox.yOff,
      width: this.hitbox.width,
      height: this.hitbox.height
    }
    let prevCap = {
      direction: this.cap.direction,
      x: this.pos.x + capXOff + (this.state.direction === RIGHT ? -5 : 5),
      y: this.pos.y + this.cap.yOff,
      width: this.cap.width,
      height: this.cap.height
    }

    //input handling
    if (keysPressed.z || keysPressed.j || this.counter.jumpBuffer > 0) {
      if (onGround && this.state.walk !== PLAYER_DASH && (!this.jumpHeld || this.counter.jumpBuffer > 0)) {
        this.state.fall = PLAYER_JUMP;
        this.counter.jumpBuffer = 0;
      } else if (this.counter.jumpBuffer > 0) {
        this.counter.jumpBuffer--;
      } else if (!this.jumpHeld) {
        this.counter.jumpBuffer = JUMP_BUFFER_TIME;
      }
      this.jumpHeld = true;
    } else {
      this.jumpHeld = false;
      if (this.state.fall === PLAYER_JUMP) {
        this.vel.y += -0.04 * this.counter.jump ** 2 + 0.42 * this.counter.jump - 0.6;
        //decreases speed depending on when you let go of jump to get the best jump curves
        this.counter.jump = 0;
        this.state.fall = PLAYER_FALL;
      }
    }
    if (this.state.walk !== PLAYER_DASH && !this.dashEnd) {
      if ((keysPressed.d || keysPressed.ArrowRight) && (keysPressed.a || keysPressed.ArrowLeft) && !this.bothHeld) {
        if (this.state.direction === RIGHT) {
          this.state.walk = PLAYER_WALK;
          this.state.direction = LEFT;
          this.bothHeld = true;
        } else {
          this.state.walk = PLAYER_WALK;
          this.state.direction = RIGHT;
          this.bothHeld = true;
        }
      } else if (this.bothHeld) {
        if (!(keysPressed.d || keysPressed.ArrowRight)) {
          this.state.walk = PLAYER_WALK;
          this.state.direction = LEFT;
          this.bothHeld = false;
        } else if (!(keysPressed.a || keysPressed.ArrowLeft)) {
          this.state.walk = PLAYER_WALK;
          this.state.direction = RIGHT;
          this.bothHeld = false;
        }
      } else if (keysPressed.d || keysPressed.ArrowRight) {
        if (this.state.walk !== PLAYER_WALK || this.state.direction == LEFT) {
          this.state.walk = PLAYER_WALK;
        }
        this.state.direction = RIGHT;
      } else if (keysPressed.a || keysPressed.ArrowLeft) {
        if (this.state.walk !== PLAYER_WALK || this.state.direction == RIGHT) {
          this.state.walk = PLAYER_WALK;
        }
        this.state.direction = LEFT;
      } else if (this.state.walk === PLAYER_WALK) {
        this.state.walk = PLAYER_STILL;
      }
    }
    if (keysPressed.k || keysPressed.x) {
      if (!onGround && (keysPressed.s || keysPressed.ArrowDown)) {
        if (this.cap.direction !== DOWN) {
          this.cap.direction = DOWN;
          this.cap.changed = true;
        } else this.cap.changed = false;
      } else if (this.cap.direction !== this.state.direction) {
        if (this.cap.direction === LEFT || this.cap.direction === RIGHT) {
          this.cap.changed = false;
        } else this.cap.changed = true;
        this.cap.direction = this.state.direction;
      } else this.cap.changed = false;
    } else if (this.cap.direction !== UP) {
      this.cap.direction = UP;
      this.cap.changed = true;
    } else this.cap.changed = false;
    if (this.counter.dashCooldown < DASH_COOLDOWN_TIME || this.dashes === 0) {
      this.counter.dashCooldown++;
      if (this.counter.dashCooldown >= DASH_REFILL_TIME && onGround) {
        this.dashes = 1;
      }
    } else if (keysPressed.l || keysPressed.c) {
      this.state.walk = PLAYER_DASH;
      this.state.dashDirection = this.state.direction;
      this.dashes--;
      this.counter.dash = 0;
      this.counter.dashCooldown = 0;
      keysPressed.l = false;
      keysPressed.c = false;
    }

    //jumping/falling
    switch (this.state.fall) {
      case PLAYER_GROUNDED:
        if (onGround) {
          this.acc.y = 0;
        } else {
          this.state.fall = PLAYER_FALL;
          this.acc.y = GRAVITY;
        }
        break;
      case PLAYER_FALL:
        if (onGround) {
          this.state.fall = PLAYER_GROUNDED;
          this.acc.y = 0;
        } else {
          this.acc.y = GRAVITY;
          if (this.vel.y > MAX_FALL_SPEED) {
            this.vel.y = MAX_FALL_SPEED;
          }
        }
        break;
      case PLAYER_FAST_FALL:
        if (onGround) {
          this.state.fall = PLAYER_GROUNDED;
          this.acc.y = 0;
        } else {
          this.acc.y = GRAVITY;
          if (this.vel.y > MAX_FAST_FALL_SPEED) {
            this.vel.y = MAX_FAST_FALL_SPEED;
          }
        }
        break;
      case PLAYER_JUMP:
        if (this.counter.jump < JUMP_TIME) {
          if (this.counter.jump == 0) {
            this.vel.y += JUMP_SPEED;
          }
          this.acc.y = JUMP_DEC_SPEED;
          this.counter.jump++;
        } else {
          this.counter.jump = 0;
          this.state.fall = PLAYER_FALL;
        }
        break;
    }

    //left/right movement
    let sign = this.state.direction === RIGHT ? 1 : -1;
    let dashSign = this.state.dashDirection === RIGHT ? 1 : -1;
    switch (this.state.walk) {
      case PLAYER_STILL:
        this.acc.x = 0;
        if (abs(this.vel.x) <= 1) {
          this.vel.x = 0;
          this.dashEnd = false;
        } else if (this.dashEnd) {
          this.vel.x *= 0.65
        } else if (onGround) {
          this.vel.x *= GROUND_FRICTION;
        } else {
          this.vel.x *= AIR_FRICTION;
        }
        break;
      case PLAYER_WALK:
        this.acc.x = 0;
        if (abs(sign * this.vel.x - WALK_SPEED) <= 1) {
          this.vel.x = sign * WALK_SPEED;
          this.dashEnd = false;
        } else if (this.dashEnd) {
          this.vel.x = (this.vel.x - sign * WALK_SPEED) * 0.2 + sign * WALK_SPEED;
        } else if (onGround) {
          this.vel.x = (this.vel.x - sign * WALK_SPEED) * GROUND_FRICTION + sign * WALK_SPEED;
        } else {
          this.vel.x = (this.vel.x - sign * WALK_SPEED) * AIR_FRICTION + sign * WALK_SPEED;
        }
        break;
      case PLAYER_DASH:
        if (this.counter.dash < DASH_TIME) {
          this.acc.x = 0;
          this.acc.y = 0;
          this.vel.x = dashSign * DASH_SPEED;
          this.vel.y = 0;
        } else {
          this.dashEnd = true;
          this.state.walk = keysPressed.a || keysPressed.d || keysPressed.ArrowLeft || keysPressed.ArrowRight ? PLAYER_WALK : PLAYER_STILL;
        }
        this.counter.dash++;
        break;
    }

    //basic physics
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    //animation
    switch (this.state.walk) {
      case PLAYER_STILL:
        if (this.state.animation !== IDLE_ANIMATION && this.state.animation !== LEANING_IDLE_ANIMATION) {
          this.changeAnimation(this.cap.direction === UP ? IDLE_ANIMATION : LEANING_IDLE_ANIMATION, this.cap.direction === UP ? 35 : 46.2, this.cap.direction === UP ? 51.8 : 43.4, this.cap.direction === UP ? 4.2 : 2.8, this.cap.direction === UP ? 22.4 : 11.2, this.cap.direction === UP ? 26.6 : 23.8, this.cap.direction === UP ? 29.4 : 32.2, this.cap.direction === UP ? 0 : 23.8, 2.8, this.cap.direction === UP ? 35 : 22.4, this.cap.direction === UP ? 22.4 : 35, this.cap.changed ? this.cap.direction === UP ? -8.4 : 8.4 : 0);
        }
        break;
      case PLAYER_WALK:
        if (this.state.animation !== WALK_ANIMATION && this.state.animation !== LEANING_WALK_ANIMATION && onGround) {
          this.counter.animation.walk = 0;
          this.changeAnimation(this.cap.direction === UP ? WALK_ANIMATION : LEANING_WALK_ANIMATION, this.cap.direction === UP ? 35 : 46.2, this.cap.direction === UP ? 51.8 : 43.4, this.cap.direction === UP ? 4.2 : 2.8, this.cap.direction === UP ? 22.4 : 11.2, this.cap.direction === UP ? 26.6 : 23.8, this.cap.direction === UP ? 29.4 : 32.2, this.cap.direction === UP ? 0 : 23.8, 2.8, this.cap.direction === UP ? 35 : 22.4, this.cap.direction === UP ? 22.4 : 35, this.cap.changed ? this.cap.direction === UP ? -8.4 : 8.4 : 0);
        } else if ((this.state.animation === WALK_ANIMATION || this.state.animation === LEANING_WALK_ANIMATION) && this.state.animation !== IDLE_ANIMATION && this.state.animation !== LEANING_IDLE_ANIMATION && !onGround) {
          this.changeAnimation(this.cap.direction === UP ? IDLE_ANIMATION : LEANING_IDLE_ANIMATION, this.cap.direction === UP ? 35 : 46.2, this.cap.direction === UP ? 51.8 : 43.4, this.cap.direction === UP ? 4.2 : 2.8, this.cap.direction === UP ? 22.4 : 11.2, this.cap.direction === UP ? 26.6 : 23.8, this.cap.direction === UP ? 29.4 : 32.2, this.cap.direction === UP ? 0 : 23.8, 2.8, this.cap.direction === UP ? 35 : 22.4, this.cap.direction === UP ? 22.4 : 35, this.cap.changed ? this.cap.direction === UP ? -8.4 : 8.4 : 0);
        }
        break;
    }

    //leaning
    if (this.cap.direction === UP) {
      switch (this.state.animation) {
        case LEANING_IDLE_ANIMATION:
          this.changeAnimation(IDLE_ANIMATION, 35, 51.8, 4.2, 22.4, 26.6, 29.4, 0, 2.8, 35, 22.4, -8.4);
          break;
        case LEANING_WALK_ANIMATION:
          this.changeAnimation(WALK_ANIMATION, 35, 51.8, 4.2, 12.4, 26.6, 29.4, 0, 2.8, 35, 22.4, -8.4);
          break;
      }
    } else {
      switch (this.state.animation) {
        case IDLE_ANIMATION:
          this.changeAnimation(LEANING_IDLE_ANIMATION, 46.2, 43.4, 2.8, 11.2, 23.8, 32.2, 23.8, 2.8, 22.4, 35, 8.4);
          break;
        case WALK_ANIMATION:
          this.changeAnimation(LEANING_IDLE_ANIMATION, 46.2, 43.4, 2.8, 11.2, 23.8, 32.2, 23.8, 2.8, 22.4, 35, 8.4);
          break;
      }
    }

    capXOff = this.state.direction === RIGHT ? this.cap.xOff : 2 * this.hitbox.xOff + this.hitbox.width - this.cap.xOff - this.cap.width - 0.7;
    this.hitbox.x = this.pos.x + this.hitbox.xOff;
    this.hitbox.y = this.pos.y + this.hitbox.yOff;
    this.cap.x = this.pos.x + capXOff;
    this.cap.y = this.pos.y + this.cap.yOff;

    //object collision detection
    let checkRadius = sqrDist(this.hitbox.x, this.hitbox.y, prev.x, prev.y) + 3200;
    let resetX = false;
    for (let object of map.objects) {
      if (sqrDist(this.hitbox.x, this.hitbox.y, object.pos.x, object.pos.y) <= checkRadius) {
        let checkCap = true;
        object.checkCollision?.(this, prev, 'player', (x, y, w, h) => {
          this.pos.y = y - this.hitbox.height - this.hitbox.yOff;
          this.vel.y = 0;
          if (this.cap.direction !== DOWN) checkCap = false;
        }, (x, y, w, h) => {
          this.pos.y = y + h - this.hitbox.yOff;
          if (this.cap.direction === DOWN) checkCap = false;
        }, (x, y, w, h) => {
          this.pos.x = x - this.hitbox.width - this.hitbox.xOff;
          this.state.walk = this.state.walk === PLAYER_STILL ? PLAYER_STILL : PLAYER_WALK;
          this.dashEnd = false;
          resetX = true;
          if (this.cap.direction === LEFT) checkCap = false;
        }, (x, y, w, h) => {
          this.pos.x = x + w - this.hitbox.xOff;
          this.state.walk = this.state.walk === PLAYER_STILL ? PLAYER_STILL : PLAYER_WALK;
          this.dashEnd = false;
          resetX = true;
          if (this.cap.direction === RIGHT) checkCap = false;
        });
        if (checkCap) object.checkCollision?.(this, prevCap, 'cap', (x, y, w, h) => {
          this.pos.y = y - this.cap.height - this.cap.yOff;
          switch (this.cap.direction) {

          }
        }, (x, y, w, h) => {
          this.pos.y = y + h - this.cap.yOff;
          switch (this.cap.direction) {

          }
        }, (x, y, w, h) => {
          this.pos.x = x - this.cap.width - capXOff;
          switch (this.cap.direction) {
            case RIGHT:
              if (prevCap.direction === RIGHT) this.vel.x = -max(20, 2 * abs(this.vel.x));
              else {
                let multX = this.cap.x + this.cap.width - x < 6 ? 3 * SQRT1_5 : 1.5 * SQRT1_5;
                let multY = 4 * SQRT1_5 - multX;
                this.vel.x = -multX * max(12, abs(this.vel.x));
                this.vel.y = -multY * max(12, abs(this.vel.x) + this.vel.y / 2);
              }
              break;
            case UP:
            case DOWN:
              this.vel.x = -max(12, abs(this.vel.x));
          }
          this.state.walk = this.state.walk === PLAYER_STILL ? PLAYER_STILL : PLAYER_WALK;
          this.dashEnd = false;
          resetX = false;
        }, (x, y, w, h) => {
          this.pos.x = x + w - capXOff;
          switch (this.cap.direction) {
            case LEFT:
              if (prevCap.direction === LEFT) this.vel.x = max(20, 2 * abs(this.vel.x));
              else {
                let multX = x + w - this.cap.x < 6 ? 3 * SQRT1_5 : 1.5 * SQRT1_5;
                let multY = 4 * SQRT1_5 - multX;
                this.vel.x = multX * max(12, abs(this.vel.x));
                this.vel.y = -multY * max(12, abs(this.vel.x) + this.vel.y / 2);
              }
              break;
            case UP:
            case DOWN:
              this.vel.x = max(12, abs(this.vel.x));
          }
          this.state.walk = this.state.walk === PLAYER_STILL ? PLAYER_STILL : PLAYER_WALK;
          this.dashEnd = false;
          resetX = false;
        });
        capXOff = this.state.direction === RIGHT ? this.cap.xOff : 2 * this.hitbox.xOff + this.hitbox.width - this.cap.xOff - this.cap.width - 0.7;
        this.hitbox.x = this.pos.x + this.hitbox.xOff;
        this.hitbox.y = this.pos.y + this.hitbox.yOff;
        this.cap.x = this.pos.x + capXOff;
        this.cap.y = this.pos.y + this.cap.yOff;
      }
      if (gamestate == GAME_DEAD) break;
    }
    if (resetX) this.vel.x = 0;
  }

  draw() {
    let id;
    switch (this.state.animation) {
      case IDLE_ANIMATION:
        this.sprites.x = animations.player.walk.x[0];
        this.sprites.y = animations.player.walk.y[0];
        break;
      case LEANING_IDLE_ANIMATION:
        this.sprites.x = animations.player.leaningWalk.x[0];
        this.sprites.y = animations.player.leaningWalk.y[0];
        break;
      case WALK_ANIMATION:
        //increment before so we skip the first frame
        this.counter.animation.walk = (this.counter.animation.walk + 1) % (animations.player.leaningWalk.length * 3);
        id = floor(this.counter.animation.walk / 3);
        this.sprites.x = animations.player.walk.x[id];
        this.sprites.y = animations.player.walk.y[id];
        break;
      case LEANING_WALK_ANIMATION:
        this.counter.animation.walk = (this.counter.animation.walk + 1) % (animations.player.leaningWalk.length * 3);
        id = floor(this.counter.animation.walk / 3);
        this.sprites.x = animations.player.leaningWalk.x[id];
        this.sprites.y = animations.player.leaningWalk.y[id];
        break;
    }
    if (this.state.direction === LEFT) {
      //flips the image
      applyMatrix(-1, 0, 0, 1, 2 * (this.pos.x + this.center), 0);
    }
    //console.log(this.sprites.width, this.sprites.height)
    image(this.sprites.image, this.pos.x, this.pos.y, this.width, this.height, this.sprites.x, this.sprites.y, this.sprites.width, this.sprites.height);
    resetMatrix();
    fill(0, 255, 0, 80)
    //rect(this.cap.x, this.cap.y, this.cap.width, this.cap.height)
    //rect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height)
    //rect(this.pos.x + (this.state.direction === RIGHT ? 0 : -this.width + 2 * this.hitbox.xOff + this.hitbox.width), this.pos.y, this.width, this.height)
  }
}