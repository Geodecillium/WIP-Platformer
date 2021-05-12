class Spike {
  constructor(x, y, direction) {
    this.width = this.height = BLOCK_SIZE;
    this.direction = direction;
    this.pos = {
      x: x,
      y: y
    }
    this.vertices = [];
    switch (direction) {
      case UP:
        this.vertices[0] = {
          x: x,
          y: y + this.height
        }
        this.vertices[1] = {
          x: x + this.width / 2,
          y: y
        }
        this.vertices[2] = {
          x: x + this.width,
          y: y + this.height
        }
        break;
      case RIGHT:
        this.vertices[0] = {
          x: x,
          y: y
        }
        this.vertices[1] = {
          x: x + this.width,
          y: y + this.height / 2
        }
        this.vertices[2] = {
          x: x,
          y: y + this.height
        }
        break;
      case DOWN:
        this.vertices[0] = {
          x: x,
          y: y
        }
        this.vertices[1] = {
          x: x + this.width / 2,
          y: y + this.height
        }
        this.vertices[2] = {
          x: x + this.width,
          y: y
        }
        break;
      case LEFT:
        this.vertices[0] = {
          x: x + this.width,
          y: y
        }
        this.vertices[1] = {
          x: x,
          y: y + this.height / 2
        }
        this.vertices[2] = {
          x: x + this.width,
          y: y + this.height
        }
        break;
    }
  }

  checkCollision(object, prevPos, name) {
    switch (name) {
      case 'player':
        let edges = [
          {
            x1: object.pos.x,
            y1: object.pos.y,
            x2: prevPos.x,
            y2: prevPos.y
          },
          {
            x1: object.pos.x + object.width,
            y1: object.pos.y,
            x2: prevPos.x + object.width,
            y2: prevPos.y
          },
          {
            x1: object.pos.x,
            y1: object.pos.y + object.height,
            x2: prevPos.x,
            y2: prevPos.y + object.height
          },
          {
            x1: object.pos.x + object.width,
            y1: object.pos.y + object.height,
            x2: prevPos.x + object.width,
            y2: prevPos.y + object.height
          }
        ]
        for (let edge of edges) {
          for (let i in this.vertices) {
            if (intersect(edge.x1, edge.y1, edge.x2, edge.y2, this.vertices[i].x, this.vertices[i].y, this.vertices[(i+1)%3])) {
              gamestate = GAME_DEAD;
              console.log('dead')
              break;
            }
          }
        }
        break;
    }
  }

  draw() {
    fill(255, 0, 0);
    triangle(this.vertices[0]?.x, this.vertices[0]?.y, this.vertices[1]?.x, this.vertices[1]?.y, this.vertices[2]?.x, this.vertices[2]?.y);
  }
}