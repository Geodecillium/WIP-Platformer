class Spike {
  constructor(x, y, direction) {
    this.width = this.height = BLOCK_SIZE;
    this.direction = direction;
    this.pos = {
      x: x,
      y: y
    }
  }

  draw() {
    let x = this.pos.x - map.camera.x;
    let y = this.pos.y - map.camera.y;
    switch (this.direction) {
      case UP:
        fill(255, 0, 0);
        triangle(x, y + BLOCK_SIZE, x + BLOCK_SIZE / 2, y, x + BLOCK_SIZE, y + BLOCK_SIZE);
        break;
      case RIGHT:
        fill(255, 0, 0);
        triangle(x, y, x + BLOCK_SIZE, y + BLOCK_SIZE / 2, x, y + BLOCK_SIZE);
        break;
      case DOWN:
        fill(255, 0, 0);
        triangle(x, y, x + BLOCK_SIZE / 2, y + BLOCK_SIZE, x + BLOCK_SIZE, y);
        break;
      case LEFT:
        fill(255, 0, 0);
        triangle(x + BLOCK_SIZE, y, x, y + BLOCK_SIZE / 2, x + BLOCK_SIZE, y + BLOCK_SIZE);
        break;
    }
  }
}