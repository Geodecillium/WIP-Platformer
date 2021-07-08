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

  checkCollision(object, prevPos, name) {
    switch (name) {
      case 'player':
        let cornerCorrection = object.state.walk === PLAYER_DASH ? DASH_CORNER_CORRECTION : CORNER_CORRECTION;
        if (prevPos.y + object.hitbox.height <= this.pos.y && object.hitbox.y + object.hitbox.height > this.pos.y && !((prevPos.x + object.hitbox.width == this.pos.x || prevPos.x == this.pos.x + this.width) && (map.level.map[this.id.i][this.id.j - 1] == 1 || map.level.map[this.id.i][this.id.j - 2] == 1)) && intersect(prevPos.x, prevPos.y + object.hitbox.height, object.hitbox.x, object.hitbox.y + object.hitbox.height, this.pos.x - object.hitbox.width, this.pos.y, this.pos.x + this.width, this.pos.y)) {
          object.hitbox.y = this.pos.y - object.hitbox.height;
          object.vel.y = 0;
        } else if (prevPos.y >= this.pos.y + this.height && object.hitbox.y < this.pos.y + this.height && prevPos.x + object.hitbox.width != this.pos.x && prevPos.x != this.pos.x + this.width && intersect(prevPos.x, prevPos.y, object.hitbox.x, object.hitbox.y, this.pos.x - object.hitbox.width, this.pos.y + this.height, this.pos.x + this.width, this.pos.y + this.height)) {
          object.hitbox.y = this.pos.y + this.height;
          object.vel.y = 0;
        } else if (prevPos.x + object.hitbox.width <= this.pos.x && object.hitbox.x + object.hitbox.width > this.pos.x && prevPos.y + object.hitbox.height != this.pos.y && !(prevPos.y == this.pos.y + this.height && map.level.map[this.id.i - 1]?.[this.id.j] == 1) && intersect(prevPos.x + object.hitbox.width, prevPos.y, object.hitbox.x + object.hitbox.width, object.hitbox.y, this.pos.x, this.pos.y - object.hitbox.height, this.pos.x, this.pos.y + this.height)) {
          if (map.level.map[this.id.i][this.id.j - 1] !== 1 && intersect(prevPos.x + object.hitbox.width, prevPos.y + object.hitbox.height, object.hitbox.x + object.hitbox.width, object.hitbox.y + object.hitbox.height, this.pos.x, this.pos.y, this.pos.x, this.pos.y + cornerCorrection)) {
            object.vel.y = 0;
            object.hitbox.y = this.pos.y - object.hitbox.height;
          } else if (map.level.map[this.id.i][this.id.j + 1] !== 1 && intersect(prevPos.x + object.hitbox.width, prevPos.y, object.hitbox.x + object.hitbox.width, object.hitbox.y, this.pos.x, this.pos.y + this.height - cornerCorrection, this.pos.x, this.pos.y + this.height)) {
            object.vel.y = 0;
            object.hitbox.y = this.pos.y + this.height;
          } else {
            object.hitbox.x = this.pos.x - object.hitbox.width;
            object.vel.x = 0;
          }
        } else if (prevPos.x >= this.pos.x + this.width && object.hitbox.x < this.pos.x + this.width && prevPos.y + object.hitbox.height != this.pos.y && !(prevPos.y == this.pos.y + this.height && map.level.map[this.id.i + 1]?.[this.id.j] == 1) && intersect(prevPos.x, prevPos.y, object.hitbox.x, object.hitbox.y, this.pos.x + this.width, this.pos.y - object.hitbox.height, this.pos.x + this.width, this.pos.y + this.height)) {
          if (map.level.map[this.id.i][this.id.j - 1] !== 1 && intersect(prevPos.x, prevPos.y + object.hitbox.height, object.hitbox.x, object.hitbox.y + object.hitbox.height, this.pos.x + this.width, this.pos.y - object.hitbox.height, this.pos.x + this.width, this.pos.y - object.hitbox.height + cornerCorrection)) {
            object.vel.y = 0;
            object.hitbox.y = this.pos.y - object.hitbox.height;
          } else if (map.level.map[this.id.i][this.id.j + 1] !== 1 && intersect(prevPos.x, prevPos.y, object.hitbox.x, object.hitbox.y, this.pos.x + this.width, this.pos.y + this.height - cornerCorrection, this.pos.x + this.width, this.pos.y + this.height)) {
            object.vel.y = 0;
            object.hitbox.y = this.pos.y + this.height;
          } else {
            object.hitbox.x = this.pos.x + this.width;
            object.vel.x = 0;
          }
        }
        break;
    }
  }

  draw() {
    fill(128);
    let x = this.pos.x - map.camera.x;
    let y = this.pos.y - map.camera.y;
    square(x, y, BLOCK_SIZE);
  }
}