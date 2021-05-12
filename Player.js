class Player {
  constructor() {
    this.state = {
      animation: PLAYER_IDLE,
      walk: PLAYER_STILL,
      fall: PLAYER_GROUNDED,
      direction: RIGHT
    }
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

  enter(entrance) {
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
    let prev = {
      x: this.pos.x,
      y: this.pos.y
    }
    switch (player.state.fall) {
      case PLAYER_GROUNDED:
        this.acc.y = 0;
        break;
      case PLAYER_FALL:
        this.acc.y = GRAVITY;
        if (this.vel.y > MAX_FALL_SPEED) {
          this.vel.y = MAX_FALL_SPEED;
        }
        break;
      case PLAYER_FAST_FALL:
        this.acc.y = GRAVITY;
        if (this.vel.y > MAX_FAST_FALL_SPEED) {
          this.vel.y = MAX_FAST_FALL_SPEED;
        }
        break;
      case JUMP:
        this.vel.y = JUMP_SPEED
        break;
    }
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    for (let object of map.objects) {
      object.checkCollision?.(this, prev, 'player');
    }
  }

  draw() {
    fill(0, 255, 0);
    rect(this.pos.x, this.pos.y, 25, this.height);
  }
}