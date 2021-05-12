class Map {
  constructor(startLevel, startEntrance) {
    this.camera = {
      x: 0,
      y: 0
    }
    this.objects = [];
    this.loadLevel(startLevel, startEntrance);
  }

  exitLevel(exit) {
    let levelExit = this.level.exits[exit];
    if (!levelExit) return; //exit the function if the exit doesn't exist
    let nextLevel = levelExit.nextLevel;
    let nextEntrance = levelExit.nextEntrance;
    this.loadLevel(nextLevel, nextEntrance);
  }

  loadLevel(level, entrance) {
    this.levelName = level;
    this.level = levelList[level];
    let blocks = this.level.map;
    this.objects = [];
    player.enter(this.level.entrances[entrance]);
    for (let i = 0; i < blocks.length; i++) {
      for (let j = 0; j < blocks[i].length; j++) {
        let blockStyle = blocks[i][j];
        switch (blockStyle) {
          case EMPTY:
            break;
          case WALL:
            this.objects.push(new Wall(j, i));
            break;
          case UP_SPIKE:
            this.objects.push(new Spike(j * BLOCK_SIZE, i * BLOCK_SIZE, UP));
            break;
          case RIGHT_SPIKE:
            this.objects.push(new Spike(j * BLOCK_SIZE, i * BLOCK_SIZE, RIGHT));
            break;
          case DOWN_SPIKE:
            this.objects.push(new Spike(j * BLOCK_SIZE, i * BLOCK_SIZE, DOWN));
            break;
          case LEFT_SPIKE:
            this.objects.push(new Spike(j * BLOCK_SIZE, i * BLOCK_SIZE, LEFT));
            break;
        }
      }
    }
  }

  update() {
    for (let object of this.objects) {
      object.update?.();
      //if you're confused as to what this is, look up optional chaining
    }
  }

  draw() {
    for (let object of this.objects) {
      //check if the object is within where the camera can see
      if (object.pos.x >= this.camera.x - BLOCK_SIZE && object.pos.x <= this.camera.x + GAME_WIDTH && object.pos.y >= this.camera.y - BLOCK_SIZE && object.pos.y <= this.camera.y + GAME_HEIGHT) {
        object.draw();
      }
    }
  }
}