class Player {
  constructor() {
    this.state = PLAYER_IDLE;
    this.direction = RIGHT;
    this.height = 50;
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
  }

  enter(entrance) {
    this.state = PLAYER_IDLE;
    this.direction = RIGHT;
    this.acc = {
      x: 0,
      y: 0
    }
    this.vel = {
      x: 0,
      y: 0
    }
    this.pos = {
      x: entrance.x,
      y: entrance.y
    }
  }

  update() {
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw() {
    fill(0, 255, 0);
    rect(this.pos.x, this.pos.y, 25, this.height);
  }
}