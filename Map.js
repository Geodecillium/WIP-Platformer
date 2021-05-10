class Map {
  constructor(startLevel) {
    this.levelName = startLevel;
    this.level = levelList[startLevel];
    this.camera = {
      x: 0,
      y: 0
    };
  }

  exitLevel(exit) {
    let levelExit = this.level.exits[exit];
    if (!levelExit) return //exit the function if the exit doesn't exist
    let nextLevel = levelExit.nextLevel;
    let nextEntrance = levelExit.nextEntrance;
    this.loadLevel(nextLevel, nextEntrance);
  }

  loadLevel(level, entrance) {

  }

  draw() {
    for (let i = this.camera.x; i < this.camera.x + GAME_WIDTH; i += BLOCK_SIZE) {
      for (let j = this.camera.y; j < this.camera.y + GAME_HEIGHT; j += BLOCK_SIZE) {
        let blockStyle = this.level.map[i / BLOCK_SIZE][j / BLOCK_SIZE];
        switch (blockStyle) {
          case 0: //empty
            break;
          case 1: //wall
            fill(128);
            rect(j, i, BLOCK_SIZE, BLOCK_SIZE);
            break;
          case 2: //up spike
            fill(255, 0, 0);
            triangle(j, i + BLOCK_SIZE, j + BLOCK_SIZE / 2, i, j + BLOCK_SIZE, i + BLOCK_SIZE);
            break;
          case 3: //right spike
            fill(255, 0, 0);
            triangle(j, i, j + BLOCK_SIZE, i + BLOCK_SIZE / 2, j, i + BLOCK_SIZE);
            break;
          case 4: //down spike
            fill(255, 0, 0);
            triangle(j, i, j + BLOCK_SIZE / 2, i + BLOCK_SIZE, j + BLOCK_SIZE, i);
            break;
          case 5: //left spike
            fill(255, 0, 0);
            triangle(j + BLOCK_SIZE, i, j, i + BLOCK_SIZE / 2, j + BLOCK_SIZE, i + BLOCK_SIZE);
            break;
        }
      }
    }
  }
}