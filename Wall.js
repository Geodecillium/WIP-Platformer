class Wall {
  constructor(x, y) {
    this.width = this.height = BLOCK_SIZE;
    this.id = {
      i: y,
      j: x
    }
    this.pos = {
      x: x * BLOCK_SIZE,
      y: y * BLOCK_SIZE
    }
  }

  checkCollision(object, prevPos, name) {
    switch (name) {
      case 'player':
        if (prevPos.y + object.height <= this.pos.y && object.pos.y + object.height > this.pos.y && !((prevPos.x + object.width == this.pos.x || prevPos.x == this.pos.x + this.width) && (map.level.map[this.id.i][this.id.j - 1] == 1 || map.level.map[this.id.x][this.id.y - 2] == 1)) && intersect(prevPos.x, prevPos.y + object.height, object.pos.x, object.pos.y + object.height, this.pos.x - object.width, this.pos.y, this.pos.x + this.width, this.pos.y)) {
          object.pos.y = this.pos.y - object.height;
          object.vel.y = 0;
        } else if (prevPos.y >= this.pos.y + this.height && object.pos.y < this.pos.y + this.height && prevPos.x + object.width != this.pos.x && prevPos.x != this.pos.x + this.width && intersect(prevPos.x, prevPos.y, object.pos.x, object.pos.y, this.pos.x - object.width, this.pos.y + this.height, this.pos.x + this.width, this.pos.y + this.height)) {
          object.pos.y = this.pos.y + this.height;
          object.vel.y = 0;
        } else if (prevPos.x + object.width <= this.pos.x && object.pos.x + object.width > this.pos.x && prevPos.y + object.height != this.pos.y && !(prevPos.y == this.pos.y + this.height && map.level.map[this.id.i - 1]?.[this.id.j] == 1) && intersect(prevPos.x + object.width, prevPos.y, object.pos.x + object.width, object.pos.y, this.pos.x, this.pos.y - object.height, this.pos.x, this.pos.y + this.height)) {
          object.pos.x = this.pos.x - object.width;
          object.vel.x = 0;
        } else if (prevPos.x >= this.pos.x + this.width && object.pos.x < this.pos.x + this.width && prevPos.y + object.height != this.pos.y && !(prevPos.y == this.pos.y + this.height && map.level.map[this.id.i + 1]?.[this.id.j] == 1) && intersect(prevPos.x, prevPos.y, object.pos.x, object.pos.y, this.pos.x + this.width, this.pos.y - object.height, this.pos.x + this.width, this.pos.y + this.height)) {
          object.pos.x = this.pos.x + this.width;
          object.vel.x = 0;
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