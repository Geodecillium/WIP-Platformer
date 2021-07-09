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
    this.jumpHeld = false;
    this.bothHeld = false;
    this.height = 51.8;
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
      return;
    }
    let onGround = map.level.map[floor(this.pos.x / BLOCK_SIZE)]?.[round(this.pos.y + this.height) / BLOCK_SIZE] === 1 || map.level.map[ceil(this.pos.x / BLOCK_SIZE)]?.[round(this.pos.y + this.height) / BLOCK_SIZE] === 1;

    //input handling
    if (keysPressed.z || keysPressed.j || this.counter.jumpBuffer > 0) {
      if (onGround && (!this.jumpHeld || this.counter.jumpBuffer > 0)) {
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
    if (this.state.walk !== PLAYER_DASH) {
      if ((keysPressed.d || keysPressed.ArrowRight) && (keysPressed.a || keysPressed.ArrowLeft) && !this.bothHeld) {
        if (this.state.direction === RIGHT) {
          this.state.walk = PLAYER_WALK_ACC;
          this.state.direction = LEFT;
          this.bothHeld = true;
        } else {
          this.state.walk = PLAYER_WALK_ACC;
          this.state.direction = RIGHT;
          this.bothHeld = true;
        }
      } else if (this.bothHeld) {
        if (!(keysPressed.d || keysPressed.ArrowRight)) {
          this.state.walk = PLAYER_WALK_ACC;
          this.state.direction = LEFT;
          this.bothHeld = false;
        } else if (!(keysPressed.a || keysPressed.ArrowLeft)) {
          this.state.walk = PLAYER_WALK_ACC;
          this.state.direction = RIGHT;
          this.bothHeld = false;
        }
      } else if (keysPressed.d || keysPressed.ArrowRight) {
        if (this.state.walk !== PLAYER_WALK || this.state.direction == LEFT) {
          this.state.walk = PLAYER_WALK_ACC;
        }
        this.state.direction = RIGHT;
      } else if (keysPressed.a || keysPressed.ArrowLeft) {
        if (this.state.walk !== PLAYER_WALK || this.state.direction == RIGHT) {
          this.state.walk = PLAYER_WALK_ACC;
        }
        this.state.direction = LEFT;
      } else if (this.state.walk === PLAYER_WALK || this.state.walk === PLAYER_WALK_ACC) {
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
        }
        break;
      case PLAYER_FALL:
        if (onGround) {
          this.state.fall = PLAYER_GROUNDED;
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
        } else if (onGround) {
          this.vel.x *= GROUND_FRICTION;
        } else {
          this.vel.x *= AIR_FRICTION;
        }
        break;
      case PLAYER_WALK_ACC:
        if (sign * this.vel.x >= WALK_SPEED) {
          if (sign * this.vel.x - WALK_ACC_SPEED < WALK_SPEED) {
            this.vel.x = sign * WALK_SPEED;
          }
          this.acc.x = 0;
          this.state.walk = PLAYER_WALK;
        } else {
          this.acc.x = sign * WALK_ACC_SPEED;
        }
        break;
      case PLAYER_WALK:
        this.acc.x = 0;
        if (abs(sign * this.vel.x - WALK_SPEED) <= 1) {
          this.vel.x = sign * WALK_SPEED;
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
        } else if (abs(this.vel.x) > WALK_SPEED) {
          this.acc.x = 0;
          this.vel.x *= 0.65
        } else {
          this.acc.x = 0;
          this.state.walk = PLAYER_WALK;
        }
        this.counter.dash++;
    }

    let capXOff = this.state.direction === RIGHT ? this.cap.xOff : 2 * this.hitbox.xOff + this.hitbox.width - this.cap.xOff - this.cap.width - 0.7;

    //basic physics
    let prev = {
      x: this.pos.x + this.hitbox.xOff,
      y: this.pos.y + this.hitbox.yOff
    }
    let prevCap = {
      x: this.pos.x + capXOff,
      y: this.pos.y + this.cap.yOff
    }
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
      case PLAYER_WALK_ACC:
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
          this.changeAnimation(WALK_ANIMATION, 35, 51.8, 4.2, 19.6 + this.runHeight(), 26.6, 29.4, 0, this.runHeight(), 35, 22.4, -8.4);
          break;
      }
    } else {
      switch (this.state.animation) {
        case IDLE_ANIMATION:
          this.changeAnimation(LEANING_IDLE_ANIMATION, 46.2, 43.4, 2.8, 11.2, 23.8, 32.2, 23.8, 2.8, 22.4, 35, 8.4);
          break;
        case WALK_ANIMATION:
          this.changeAnimation(LEANING_IDLE_ANIMATION, 46.2, 43.4, 2.8, 8.4 + this.runHeight(), 23.8, 32.2, 23.8, this.runHeight(), 22.4, 35, 8.4);
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
    for (let object of map.objects) {
      if (sqrDist(this.hitbox.x, this.hitbox.y, object.pos.x, object.pos.y) <= checkRadius) {
        object.checkCollision?.(this, prev, 'player', (x, y, w, h) => {
          this.pos.y = y - this.hitbox.height - this.hitbox.yOff;
          this.vel.y = 0;
        }, (x, y, w, h) => {
          this.pos.y = y + h - this.hitbox.yOff;
          this.vel.y = 0;
        }, (x, y, w, h) => {
          this.pos.x = x - this.hitbox.width - this.hitbox.xOff;
          this.vel.x = 0;
        }, (x, y, w, h) => {
          this.pos.x = x + w - this.hitbox.xOff;
          this.vel.x = 0;
        });
        object.checkCollision?.(this, prevCap, 'cap', (x, y, w, h) => {
          this.pos.y = y - this.cap.height - this.cap.yOff;
          this.vel.y = 0;
        }, (x, y, w, h) => {
          this.pos.y = y + h - this.cap.yOff;
          this.vel.y = 0;
        }, (x, y, w, h) => {
          this.pos.x = x - this.cap.width - capXOff;
          this.vel.x = -max(20, 2 * this.vel.x);
          this.state.walk = this.state.walk === PLAYER_STILL ? PLAYER_STILL : PLAYER_WALK;
        }, (x, y, w, h) => {
          this.pos.x = x + w - capXOff;
          this.vel.x = max(20, 2 * this.vel.x);
          this.state.walk = this.state.walk === PLAYER_STILL ? PLAYER_STILL : PLAYER_WALK;
        });
        capXOff = this.state.direction === RIGHT ? this.cap.xOff : 2 * this.hitbox.xOff + this.hitbox.width - this.cap.xOff - this.cap.width - 0.7;
        this.hitbox.x = this.pos.x + this.hitbox.xOff;
        this.hitbox.y = this.pos.y + this.hitbox.yOff;
        this.cap.x = this.pos.x + capXOff;
        this.cap.y = this.pos.y + this.cap.yOff;
      }
      if (gamestate == GAME_DEAD) break;
    }
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
        if ([2, 5, 14, 17].includes(this.counter.animation.walk)) {
          this.hitbox.yOff -= 1.4;
          this.cap.yOff -= 1.4;
        } else if (this.counter.animation.walk % 3 === 2) {
          this.hitbox.yOff += 1.4;
          this.cap.yOff += 1.4;
        }
        break;
      case LEANING_WALK_ANIMATION:
        this.counter.animation.walk = (this.counter.animation.walk + 1) % (animations.player.leaningWalk.length * 3);
        id = floor(this.counter.animation.walk / 3);
        this.sprites.x = animations.player.leaningWalk.x[id];
        this.sprites.y = animations.player.leaningWalk.y[id];
        if ([2, 5, 14, 17].includes(this.counter.animation.walk)) {
          this.hitbox.yOff -= 1.4;
          this.cap.yOff -= 1.4;
        } else if (this.counter.animation.walk % 3 === 2) {
          this.hitbox.yOff += 1.4;
          this.cap.yOff += 1.4;
        }
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