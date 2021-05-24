class Player {
  constructor() {
    this.state = {
      animation: PLAYER_IDLE,
      walk: PLAYER_STILL,
      fall: PLAYER_GROUNDED,
      direction: RIGHT
    }
    this.counter = {
      jump: 0,
      jumpBuffer: 0
    }
    this.jumpHeld = false;
    this.height = 50;
    this.width = 25;
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
      animation: PLAYER_IDLE,
      walk: PLAYER_STILL,
      fall: PLAYER_GROUNDED,
      direction: RIGHT
    }
    this.acc.x = 0;
    this.acc.y = 0;
    this.vel.x = 0;
    this.vel.y = 0;
    this.pos.x = entrance.x;
    this.pos.y = entrance.y;
    this.respawn.x = entrance.x;
    this.respawn.y = entrance.y;
  }

  update() {
    if (gamestate == GAME_DEAD) {
      gamestate = GAME_PLAYING;
      this.spawn(this.respawn);
      return;
    }
    let onGround = map.level.map[floor(this.pos.x / BLOCK_SIZE)]?.[this.pos.y / BLOCK_SIZE + 2] === 1 || map.level.map[ceil(this.pos.x / BLOCK_SIZE)]?.[this.pos.y / BLOCK_SIZE + 2] === 1;

    //input handling
    if (keysPressed.z || keysPressed.j || this.counter.jumpBuffer > 0) {
      if (onGround && (!this.jumpHeld || this.counter.jumpBuffer > 0)) {
        this.state.fall = PLAYER_JUMP;
        this.counter.jumpBuffer = 0;
      } else if (this.counter.jumpBuffer > 0) {
        this.counter.jumpBuffer--;
      } else if (!this.jumpHeld) {
        this.counter.jumpBuffer = 5;
      }
      this.jumpHeld = true;
    } else {
      this.jumpHeld = false;
      if (this.state.fall === PLAYER_JUMP) {
        this.vel.y += -0.04 * this.counter.jump ** 2 + 0.42 * this.counter.jump - 0.6;
        this.counter.jump = 0;
        this.state.fall = PLAYER_FALL;
      }
    }
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
        if (this.counter.jump < 10) {
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
        if (abs(this.vel.x) <= WALK_SPEED) {
          this.acc.x = 0;
          this.vel.x = sign * WALK_SPEED;
        } else if (onGround) {
          this.acc.x = -sign * GROUND_FRICTION;
        } else {
          this.acc.x = -sign * AIR_FRICTION;
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
  }

  draw() {
    fill(0, 255, 0);
    rect(this.pos.x, this.pos.y, 25, this.height);
  }
}