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
      hangTime: 0
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
    this.direction = RIGHT;
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
      this.spawn(this.respawn);
      return;
    }
    let onGround = map.level.map[floor(this.pos.x / BLOCK_SIZE)]?.[this.pos.y / BLOCK_SIZE + 2] === 1 || map.level.map[ceil(this.pos.x / BLOCK_SIZE)]?.[this.pos.y / BLOCK_SIZE + 2] === 1;

    //input handling
    if (keysPressed.z || keysPressed.j) {
      if (onGround && !this.jumpHeld) {
        this.state.fall = PLAYER_JUMP;
      }
      this.jumpHeld = true;
    } else {
      this.jumpHeld = false;
      if (this.state.fall === PLAYER_JUMP) {
        this.state.fall = PLAYER_CANCEL_JUMP;
      }
    }
    if ((keysPressed.d || keysPressed.ArrowRight) && (keysPressed.a || keysPressed.ArrowLeft)) {
      if (this.state.direction === RIGHT) {
        this.state.direction = LEFT;
      } else {
        this.state.direction = RIGHT;
      }
      if (this.state.walk === PLAYER_WALK || this.state.walk === PLAYER_WALK_ACC) {
        this.state.walk = PLAYER_WALK_DEC;
      }
    } else if (keysPressed.d || keysPressed.ArrowRight) {
      this.state.direction = RIGHT;
      if (this.state.walk !== PLAYER_WALK) {
        this.state.walk = PLAYER_WALK_ACC;
      }
    } else if (keysPressed.a || keysPressed.ArrowLeft) {
      this.state.direction = LEFT;
      if (this.state.walk !== PLAYER_WALK) {
        this.state.walk = PLAYER_WALK_ACC;
      }
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
        if (onGround) {
          this.vel.y = JUMP_SPEED;
          this.acc.y = GRAVITY;
          this.counter.jump++;
        } else if (this.counter.jump > 5) {
          this.counter.jump = 0
          this.state.fall = PLAYER_HANG;
        } else if (this.counter.jump > 0) {
          this.acc.y = GRAVITY;
          this.counter.jump++;
        } else {
          this.state.fall = PLAYER_FALL;
        }
        break;
      case PLAYER_CANCEL_JUMP:
        if (this.counter.jump > 0 && this.counter.jump < 6) {
          this.vel.y += 21 - 3 * this.counter.jump;
        }
        this.state.fall = PLAYER_HANG;
        break;
      case PLAYER_HANG:
        if (this.counter.hangTime > 1) {
          this.counter.hangTime = 0;
          this.state.fall = PLAYER_FALL;
        } else if (this.vel.y > -3 || this.counter.hangTime > 0) {
          this.acc.y = 1;
          this.counter.hangTime++;
        } else {
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
          this.acc.x = 0;
          this.vel.x = sign * WALK_SPEED;
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
    for (let object of map.objects) {
      object.checkCollision?.(this, prev, 'player');
      if (gamestate == GAME_DEAD) break;
    }
  }

  draw() {
    fill(0, 255, 0);
    rect(this.pos.x, this.pos.y, 25, this.height);
  }
}