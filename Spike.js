class Spike {
  constructor(x, y, direction) {
    this.width = this.height = BLOCK_SIZE;
    this.direction = direction;
    this.pos = {
      x: x,
      y: y
    }
    this.vertices = [];
    this.hitbox = [];
    switch (direction) {
      case UP:
        this.vertices = [{
          x: x,
          y: y + this.height
        }, {
          x: x + this.width / 2,
          y: y
        }, {
          x: x + this.width,
          y: y + this.height
        }]
        this.hitbox = [{
          x: x + 2.55,
          y: y + this.height - 1.58
        }, {
          x: x + this.width / 2,
          y: y + 3
        }, {
          x: x + this.width - 2.55,
          y: y + this.height - 1.58
        }]
        break;
      case RIGHT:
        this.vertices = [{
          x: x,
          y: y
        }, {
          x: x + this.width,
          y: y + this.height / 2
        }, {
          x: x,
          y: y + this.height
        }]
        this.hitbox = [{
          x: x + 1.58,
          y: y + 2.55
        }, {
          x: x + this.width - 3,
          y: y + this.height / 2
        }, {
          x: x + 1.58,
          y: y + this.height - 2.55
        }]
        break;
      case DOWN:
        this.vertices = [{
          x: x,
          y: y
        }, {
          x: x + this.width / 2,
          y: y + this.height
        }, {
          x: x + this.width,
          y: y
        }]
        this.hitbox = [{
          x: x + 2.55,
          y: y + 1.58
        }, {
          x: x + this.width / 2,
          y: y + this.height - 3
        }, {
          x: x + this.width - 2.55,
          y: y + 1.58
        }]
        break;
      case LEFT:
        this.vertices = [{
          x: x + this.width,
          y: y
        }, {
          x: x,
          y: y + this.height / 2
        }, {
          x: x + this.width,
          y: y + this.height
        }]
        this.hitbox = [{
          x: x + this.width - 1.58,
          y: y + 2.55
        }, {
          x: x + 3,
          y: y + this.height / 2
        }, {
          x: x + this.width - 1.58,
          y: y + this.height - 2.55
        }]
        break;
    }
  }

  checkCollision(object, prevPos, name) {
    switch (name) {
      case 'player':
        let edges = [
          {
            x1: object.hitbox.x,
            y1: object.hitbox.y,
            x2: prevPos.x,
            y2: prevPos.y
          },
          {
            x1: object.hitbox.x + object.hitbox.width,
            y1: object.hitbox.y,
            x2: prevPos.x + object.hitbox.width,
            y2: prevPos.y
          },
          {
            x1: object.hitbox.x,
            y1: object.hitbox.y + object.hitbox.height,
            x2: prevPos.x,
            y2: prevPos.y + object.hitbox.height
          },
          {
            x1: object.hitbox.x + object.hitbox.width,
            y1: object.hitbox.y + object.hitbox.height,
            x2: prevPos.x + object.hitbox.width,
            y2: prevPos.y + object.hitbox.height
          },
          {
            x1: object.hitbox.x,
            y1: object.hitbox.y,
            x2: object.hitbox.x + object.hitbox.width,
            y2: object.hitbox.y
          },
          {
            x1: object.hitbox.x + object.hitbox.width,
            y1: object.hitbox.y,
            x2: object.hitbox.x + object.hitbox.width,
            y2: object.hitbox.y + object.hitbox.height
          },
          {
            x1: object.hitbox.x + object.hitbox.width,
            y1: object.hitbox.y + object.hitbox.height,
            x2: object.hitbox.x,
            y2: object.hitbox.y + object.hitbox.height
          },
          {
            x1: object.hitbox.x,
            y1: object.hitbox.y + object.hitbox.height,
            x2: object.hitbox.x,
            y2: object.hitbox.y
          }
        ]
        for (let edge of edges) {
          for (let i in this.vertices) {
            if (intersect(edge.x1, edge.y1, edge.x2, edge.y2, this.hitbox[i].x, this.hitbox[i].y, this.hitbox[(i - -1) % 3].x, this.hitbox[(i - -1) % 3].y)) {
              gamestate = GAME_DEAD;
              return;
            }
          }
        }
        break;
    }
  }

  draw() {
    fill(255, 0, 0);
    triangle(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y);
  }
}