'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(vect) {
    if (!(vect instanceof Vector)) {
      throw Error("Можно прибавлять к вектору только вектор типа Vector");
    }
    let newObj = new Vector(this.x, this.y);
    newObj.x += vect.x;
    newObj.y += vect.y;
    return newObj;
  }
  times(num) {
    let newObj = new Vector(this.x, this.y);
    newObj.x *= num;
    newObj.y *= num;
    return newObj;
  }
}

class Actor {
  constructor(pos, size, speed) {
    if (pos == undefined) {
      this.pos = new Vector();
    } else {
      if (!(pos instanceof Vector)) {
        throw Error(`${pos} не является вектором`);
      }
      this.pos = pos;
    }
    if (size == undefined) {
      this.size = new Vector(1, 1);
    } else {
      if (!(size instanceof Vector)) {
        throw Error(`${size} не является вектором`);
      }
      this.size = size;
    }
    if (speed == undefined) {
      this.speed = new Vector();
    } else {
      if (!(speed instanceof Vector)) {
        throw Error(`${speed} не является вектором`);
      }
      this.speed = speed;
    }
  }

  act() {}

  get type() {
    return 'actor';
  }

  get left() {
    return this.pos.x;
  }

  get top() {
    return this.pos.y;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  isIntersect(movingObj) {
    if (!(movingObj instanceof Actor)) {
      throw Error(`${movingObj} не является наследником Actor`);
    }
    if (this == movingObj) {
      return false;
    }
    if (!(movingObj.left >= this.right ||
        movingObj.right <= this.left ||
        movingObj.top >= this.bottom ||
        movingObj.bottom <= this.top)) {
      return true;
    }
    return false;
  }
}


class Level {
  constructor(grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;
    this.height = grid.length;
    this.width = Math.max(0, ...grid.map(string => string.length));
    this.status = null;
    this.finishDelay = 1;
    this.player = this.actors.find(actor => actor.type === "player");
  };
  isFinished() {
    if (this.status != null && this.finishDelay < 0) {
      return true;
    }
    return false;
  }
  actorAt(movingObj) {
    if (!(movingObj instanceof Actor)) {
      throw Error(`${movingObj} не является наследником Actor`);
    }
    if (this.actors.length != 0) {
      if (this.grid.length != 0 || this.actors.length != 1) {
        return this.actors.find(act => movingObj.isIntersect(act));
      }
    }
    return undefined;
  }

  obstacleAt(moveTo, size) {
    if (!(moveTo instanceof Vector) || !(size instanceof Vector)) {
      throw new Error("Нужно передать объект типа Vector");
    };

    let top = Math.floor(moveTo.y);
    let right = Math.ceil(moveTo.x + size.x);
    let bottom = Math.ceil(moveTo.y + size.y);
    let left = Math.floor(moveTo.x);

    if (bottom > this.height) {
      return ('lava');
    } else if (left < 0 || top < 0 || right > this.width) {
      return 'wall';
    }
    for (let i = top; i < bottom; i++) {
      for (let j = left; j < right; j++) {
        if (this.grid[i][j] !== undefined) {
          return this.grid[i][j];
        }
      }
    }
    return undefined;
  }

  removeActor(actor) {
    this.actors.splice(this.actors.indexOf(actor), 1);
  }
  noMoreActors(type) {
    if (this.actors.find(actor => actor.type === type) != undefined) {
      return false;
    }
    return true;
  }
  playerTouched(obstacle, movingObj) {
    if (obstacle === 'lava' || obstacle === 'fireball') {
      this.status = 'lost';
    }
    if (obstacle === 'coin' && movingObj.type === 'coin') {
      this.removeActor(movingObj);
      if (this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }
}


class LevelParser {
  constructor(lexicon) {
    this.lexicon = lexicon;
  }
  actorFromSymbol(symbol) {
    return symbol === undefined ? undefined : this.lexicon[symbol];
  }
  obstacleFromSymbol(symbol) {
    if (symbol === 'x') {
      return 'wall';
    }
    if (symbol === '!') {
      return 'lava';
    }
    return undefined;
  }
  createGrid(plan) {
    const newPlan = plan.map(str => {
      let arr = [];
      for (let i = 0; i < str.length; i++) {
        arr.push(this.obstacleFromSymbol(str[i]));
      }
      return arr;
    });
    return newPlan;
  }
  createActors(plan) {
    let arr = [];
    for (let i = 0; i < plan.length; i++) {
      for (let j = 0; j < plan[i].length; j++) {
        if (this.lexicon != undefined) {
          if (this.lexicon[plan[i][j]] != undefined && typeof this.lexicon[plan[i][j]] === 'function') {
            if (new this.lexicon[plan[i][j]] instanceof Actor) {
              arr.push(new this.lexicon[plan[i][j]](new Vector(j, i)));
            }
          }
        }
      }
    }
    return arr;
  }
  parse(plan) {
    return new Level(this.createGrid(plan), this.createActors(plan));
  }
}

class Fireball extends Actor {
  constructor(pos, speed) {
    super(pos, undefined, speed);
  }
  get type() {
    return 'fireball';
  }
  getNextPosition(time = 1) {
    let newX = this.pos.x + (this.speed.x * time);
    let newY = this.pos.y + (this.speed.y * time);
    return new Vector(newX, newY);
  }
  handleObstacle() {
    this.speed.x = -this.speed.x;
    this.speed.y = -this.speed.y;
  }
  act(time, playground) {
    const newPos = this.getNextPosition(time);
    if (playground.obstacleAt(newPos, this.size) == undefined) {
      this.pos = new Vector(newPos.x, newPos.y);
    } else {
      this.handleObstacle();
    }
  }
}


class HorizontalFireball extends Fireball {
  constructor(pos) {
    super(pos);
    this.speed = new Vector(2, 0);
  }
}

class VerticalFireball extends Fireball {
  constructor(pos) {
    super(pos);
    this.speed = new Vector(0, 2);
  }
}

class FireRain extends Fireball {
  constructor(pos) {
    super(pos);
    this.speed = new Vector(0, 3);
    this.default = pos;
  }
  handleObstacle() {
    this.pos = this.default;
  }
}


class Coin extends Actor {
  constructor(pos) {
    super(pos);
    this.size = new Vector(0.6, 0.6);
    this.pos = this.pos.plus(new Vector(0.2, 0.1));
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * (2 * Math.PI);
    this.default = Object.assign({}, this.pos);
  }
  get type() {
    return 'coin';
  }
  updateSpring(time = 1) {
    this.spring += this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    return new Vector(this.default.x + this.getSpringVector().x, this.default.y + this.getSpringVector().y);
  }

  act(time) {
    const newPos = this.getNextPosition(time);
    this.pos = new Vector(newPos.x, newPos.y);
  }
}


class Player extends Actor {
  constructor(pos) {
    super(pos);
    this.pos = this.pos.plus(new Vector(0, -(0.5)));
    this.size = new Vector(0.8, 1.5);
  }
  get type() {
    return 'player';
  }
}


const actorDict = {
  '@': Player,
  'v': FireRain,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball

};
const parser = new LevelParser(actorDict);

loadLevels()
  .then((res) => {
    runGame(JSON.parse(res), parser, DOMDisplay)
      .then(() => alert('Вы выиграли!'))
  });
