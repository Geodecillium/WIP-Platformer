class Wall {
  constructor(x, y) {
    this.width = this.height = BLOCK_SIZE;
    this.id = {
      i: x,
      j: y
    }
    this.pos = {
      x: x * BLOCK_SIZE,
      y: y * BLOCK_SIZE
    }
  }

  checkCollision(object, prevPos, name, ...f) {
    let hitbox = name === 'player' ? object.hitbox : name === 'cap' ? object.cap : object;
    let cornerCorrection = name === 'player' ? object.state.walk === PLAYER_DASH ? DASH_CORNER_CORRECTION : CORNER_CORRECTION : 0;
    if (prevPos.y + hitbox.height <= this.pos.y && hitbox.y + hitbox.height > this.pos.y && !((prevPos.x + hitbox.width == this.pos.x || prevPos.x == this.pos.x + this.width) && (map.level.map[this.id.i][this.id.j - 1] == 1 || map.level.map[this.id.i][this.id.j - 2] == 1)) && intersect(prevPos.x, prevPos.y + hitbox.height, hitbox.x, hitbox.y + hitbox.height, this.pos.x - hitbox.width, this.pos.y, this.pos.x + this.width, this.pos.y)) {
      f[0](this.pos.x, this.pos.y, this.width, this.height);
    } else if (prevPos.y >= this.pos.y + this.height && hitbox.y < this.pos.y + this.height && prevPos.x + hitbox.width != this.pos.x && prevPos.x != this.pos.x + this.width && intersect(prevPos.x, prevPos.y, hitbox.x, hitbox.y, this.pos.x - hitbox.width, this.pos.y + this.height, this.pos.x + this.width, this.pos.y + this.height)) {
      f[1](this.pos.x, this.pos.y, this.width, this.height);
    } else if (prevPos.x + hitbox.width <= this.pos.x && hitbox.x + hitbox.width > this.pos.x && prevPos.y + hitbox.height != this.pos.y && !(prevPos.y == this.pos.y + this.height && map.level.map[this.id.i - 1]?.[this.id.j] == 1) && intersect(prevPos.x + hitbox.width, prevPos.y, hitbox.x + hitbox.width, hitbox.y, this.pos.x, this.pos.y - hitbox.height, this.pos.x, this.pos.y + this.height)) {
      if (object.vel.y >= 0 && map.level.map[this.id.i][this.id.j - 1] !== 1 && intersect(prevPos.x + hitbox.width, prevPos.y + hitbox.height, hitbox.x + hitbox.width, hitbox.y + hitbox.height, this.pos.x, this.pos.y, this.pos.x, this.pos.y + cornerCorrection)) {
        f[0](this.pos.x, this.pos.y, this.width, this.height);
      } else if (object.vel.y <= 0 && map.level.map[this.id.i][this.id.j + 1] !== 1 && intersect(prevPos.x + hitbox.width, prevPos.y, hitbox.x + hitbox.width, hitbox.y, this.pos.x, this.pos.y + this.height - cornerCorrection, this.pos.x, this.pos.y + this.height)) {
        f[1](this.pos.x, this.pos.y, this.width, this.height);
      } else {
        f[2](this.pos.x, this.pos.y, this.width, this.height);
      }
    } else if (prevPos.x >= this.pos.x + this.width && hitbox.x < this.pos.x + this.width && prevPos.y + hitbox.height != this.pos.y && !(prevPos.y == this.pos.y + this.height && map.level.map[this.id.i + 1]?.[this.id.j] == 1) && intersect(prevPos.x, prevPos.y, hitbox.x, hitbox.y, this.pos.x + this.width, this.pos.y - hitbox.height, this.pos.x + this.width, this.pos.y + this.height)) {
      if (object.vel.y >= 0 && map.level.map[this.id.i][this.id.j - 1] !== 1 && intersect(prevPos.x, prevPos.y + hitbox.height, hitbox.x, hitbox.y + hitbox.height, this.pos.x + this.width, this.pos.y - hitbox.height, this.pos.x + this.width, this.pos.y - hitbox.height + cornerCorrection)) {
        f[0](this.pos.x, this.pos.y, this.width, this.height);
      } else if (object.vel.y <= 0 && map.level.map[this.id.i][this.id.j + 1] !== 1 && intersect(prevPos.x, prevPos.y, hitbox.x, hitbox.y, this.pos.x + this.width, this.pos.y + this.height - cornerCorrection, this.pos.x + this.width, this.pos.y + this.height)) {
        f[1](this.pos.x, this.pos.y, this.width, this.height);
      } else {
        f[3](this.pos.x, this.pos.y, this.width, this.height);
      }
    }
  }

  draw() {
    fill(128);
    let x = this.pos.x - map.camera.x;
    let y = this.pos.y - map.camera.y;
    square(x, y, BLOCK_SIZE);
  }
}