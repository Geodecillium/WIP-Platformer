class Wall {
  constructor(x, y) {
    this.pos = {
      x: x,
      y: y
    }
  }

  draw() {
    fill(128);
    let x = this.pos.x - map.camera.x;
    let y = this.pos.y - map.camera.y;
    square(x, y, BLOCK_SIZE);
  }
}