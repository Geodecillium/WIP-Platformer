class Player {
  constructor(spritesheet) {
    this.state = {
      animation: IDLE_ANIMATION,
      walk: PLAYER_STILL,
      fall: PLAYER_GROUNDED,
      direction: RIGHT,
      dashDirection: RIGHT,
      cap: UP
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
      dashCooldown: 0
    }
    this.dashes = 1;
    this.jumpHeld = false;
    this.height = NORMAL_HEIGHT;
    this.width = NORMAL_WIDTH;
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
  }

  spawn(entrance) {
    //reset player
    this.state = {
      animation: IDLE_ANIMATION,
      walk: PLAYER_STILL,
      fall: PLAYER_GROUNDED,
      direction: RIGHT,
      dashDirection: RIGHT,
      cap: UP
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
    this.acc.x = 0;
    this.acc.y = 0;
    this.vel.x = 0;
    this.vel.y = 0;
    this.pos.x = entrance.x;
    this.pos.y = entrance.y - this.height;
    this.respawn.x = entrance.x;
    this.respawn.y = entrance.y;
  }

  update() {
    if (gamestate == GAME_DEAD) {
      gamestate = GAME_PLAYING;
      this.spawn(this.respawn);
      return;
    }
    let onGround = map.level.map[floor(this.pos.x / BLOCK_SIZE)]?.[(this.pos.y + this.height) / BLOCK_SIZE] === 1 || map.level.map[ceil(this.pos.x / BLOCK_SIZE)]?.[(this.pos.y + this.height) / BLOCK_SIZE] === 1;

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
      if ((keysPressed.d || keysPressed.ArrowRight) && (keysPressed.a || keysPressed.ArrowLeft)) {
        if (this.state.walk === PLAYER_WALK || this.state.walk === PLAYER_WALK_ACC) {
          this.state.walk = PLAYER_WALK_DEC;
        } else if (this.state.walk === PLAYER_STILL) {
          if (this.state.direction === RIGHT) {
            this.state.direction = LEFT;
          } else {
            this.state.direction = RIGHT;
          }
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
        this.state.walk = PLAYER_WALK_DEC;
      }
    }
    if (keysPressed.k || keysPressed.x) {
      if (!onGround && (keysPressed.s || keysPressed.ArrowDown)) {
        this.state.cap = DOWN;
      } else {
        this.state.cap = this.state.direction;
      }
    } else {
      this.state.cap = UP;
    }
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
        if (this.vel > 0) {
          this.state.walk = PLAYER_WALK_DEC;
        }
        break;
      case PLAYER_WALK_ACC:
        if (abs(this.vel.x) >= WALK_SPEED) {
          if (abs(this.vel.x) - WALK_ACC_SPEED < WALK_SPEED) {
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
        if (abs(this.vel.x) <= WALK_SPEED) {
          this.vel.x = sign * WALK_SPEED;
        } else if (onGround) {
          this.vel.x *= GROUND_FRICTION;
        } else {
          this.acc.x *= AIR_FRICTION;
        }
      case PLAYER_WALK_DEC:
        if (abs(this.vel.x) <= WALK_DEC_SPEED) {
          this.acc.x = 0;
          this.vel.x = 0;
          this.state.walk = PLAYER_STILL;
        } else {
          this.acc.x = -sign * WALK_DEC_SPEED;
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

    //basic physics
    let prev = {
      x: this.pos.x,
      y: this.pos.y
    }
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    //object collision detection
    let checkRadius = sqrDist(this.pos.x, this.pos.y, prev.x, prev.y) + 3200;
    for (let object of map.objects) {
      if (sqrDist(this.pos.x, this.pos.y, object.pos.x, object.pos.y) <= checkRadius) {
        object.checkCollision?.(this, prev, 'player');
      }
      if (gamestate == GAME_DEAD) break;
    }

    //animation
    switch (this.state.walk) {
      case PLAYER_STILL:
        if (this.state.animation !== IDLE_ANIMATION && this.state.animation !== LEANING_IDLE_ANIMATION) {
          this.state.animation = this.state.cap === UP ? IDLE_ANIMATION : LEANING_IDLE_ANIMATION;
        }
        break;
      case PLAYER_WALK_ACC:
      case PLAYER_WALK:
      case PLAYER_WALK_DEC:
        if (this.state.animation !== WALK_ANIMATION && this.state.animation !== LEANING_WALK_ANIMATION && onGround) {
          this.state.animation = this.state.cap === UP ? WALK_ANIMATION : LEANING_WALK_ANIMATION;
          this.counter.animation.walk = 0;
        } else if ((this.state.animation === WALK_ANIMATION || this.state.animation === LEANING_WALK_ANIMATION) && this.state.animation !== IDLE_ANIMATION && this.state.animation !== LEANING_IDLE_ANIMATION && !onGround) {
          this.state.animation = this.state.cap === UP ? IDLE_ANIMATION : LEANING_IDLE_ANIMATION;
        }
        break;
    }

    //leaning
    if (this.state.cap === UP) {
      switch (this.state.animation) {
        case LEANING_IDLE_ANIMATION:
          this.state.animation = IDLE_ANIMATION;
          this.sprites.height = 10 / 7 * (this.height = NORMAL_HEIGHT);
          this.sprites.width = 10 / 7 * (this.width = NORMAL_WIDTH);
          this.pos.y -= NORMAL_HEIGHT - LEANING_HEIGHT
          break;
        case LEANING_WALK_ANIMATION:
          this.state.animation = WALK_ANIMATION;
          this.sprites.height = 10 / 7 * (this.height = NORMAL_HEIGHT);
          this.sprites.width = 10 / 7 * (this.width = NORMAL_WIDTH);
          this.pos.y -= NORMAL_HEIGHT - LEANING_HEIGHT
          break;
      }
    } else {
      switch (this.state.animation) {
        case IDLE_ANIMATION:
          this.state.animation = LEANING_IDLE_ANIMATION;
          this.sprites.height = 10 / 7 * (this.height = LEANING_HEIGHT);
          this.sprites.width = 10 / 7 * (this.width = LEANING_WIDTH);
          this.pos.y += NORMAL_HEIGHT - LEANING_HEIGHT
          break;
        case WALK_ANIMATION:
          this.state.animation = LEANING_WALK_ANIMATION;
          this.sprites.height = 10 / 7 * (this.height = LEANING_HEIGHT);
          this.sprites.width = 10 / 7 * (this.width = LEANING_WIDTH);
          this.pos.y += NORMAL_HEIGHT - LEANING_HEIGHT
          break;
      }
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
        this.counter.animation.walk = (this.counter.animation.walk + 1 / 3) % animations.player.walk.length;
        id = floor(this.counter.animation.walk);
        this.sprites.x = animations.player.walk.x[id];
        this.sprites.y = animations.player.walk.y[id];
        break;
      case LEANING_WALK_ANIMATION:
        //increment before so we skip the first frame
        this.counter.animation.walk = (this.counter.animation.walk + 1 / 3) % animations.player.leaningWalk.length;
        id = floor(this.counter.animation.walk);
        this.sprites.x = animations.player.leaningWalk.x[id];
        this.sprites.y = animations.player.leaningWalk.y[id];
        break;
    }
    if (this.state.direction === LEFT) {
      //flips the image
      applyMatrix(-1, 0, 0, 1, 2 * this.pos.x + this.width, 0);
    }
    //console.log(this.sprites.width, this.sprites.height)
    image(this.sprites.image, this.pos.x, this.pos.y, this.width, this.height, this.sprites.x, this.sprites.y, this.sprites.width, this.sprites.height);
    resetMatrix();
  }
}