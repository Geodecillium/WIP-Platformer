class Player {
  constructor() {
    this.state = PLAYER_IDLE;
    this.direction = RIGHT;
    this.height = 50;
    this.width = 25;
    this.acc = {
      x: 0,
      y: 3
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
    this.state = PLAYER_IDLE;
    this.direction = RIGHT;
    this.acc.x = 0;
    this.acc.y = 3;
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
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    if (this.vel.y > 25) this.vel.y = 50
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