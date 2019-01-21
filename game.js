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

// const start = new Vector(30, 50);
// const moveTo = new Vector(5, 10);
// const finish = start.plus(moveTo.times(2));
//
// console.log(`Исходное расположение: ${start.x}:${start.y}`);
// console.log(`Текущее расположение: ${finish.x}:${finish.y}`);


class Actor {
  constructor(pos, size, speed) {
    if (pos == undefined) {
      this.pos = new Vector();
    } else {
      if (!(pos instanceof Vector)) {
        throw Error(`${pos} не является вектором`);
      }
      // this.pos = new Vector(pos.x, pos.y);
      this.pos = pos;
    }
    if (size == undefined) {
      this.size = new Vector(1, 1);
    } else {
      if (!(size instanceof Vector)) {
        throw Error(`${size} не является вектором`);
      }
      // this.size = new Vector(size.x, size.y);
      this.size = size;
    }
    if (speed == undefined) {
      this.speed = new Vector();
    } else {
      if (!(speed instanceof Vector)) {
        throw Error(`${speed} не является вектором`);
      }
      // this.speed = new Vector(speed.x, speed.y);
      this.speed = speed;
    }

    Object.defineProperty(this, 'left', {
      get: () => this.pos.x
    });

    Object.defineProperty(this, 'top', {
      get: () => this.pos.y
    });
    Object.defineProperty(this, 'right', {
      get: () => this.pos.x + this.size.x
    });
    Object.defineProperty(this, 'bottom', {
      get: () => this.pos.y + this.size.y
    });
    Object.defineProperty(this, 'type', {
      value: 'actor',
      configurable: true
    });
  }
  act() {}
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


// const items = new Map();
// const player = new Actor();
// items.set('Игрок', player);
// items.set('Первая монета', new Actor(new Vector(10, 10)));
// items.set('Вторая монета', new Actor(new Vector(15, 5)));
//
// function position(item) {
//   return ['left', 'top', 'right', 'bottom']
//     .map(side => `${side}: ${item[side]}`)
//     .join(', ');
// }
//
// function movePlayer(x, y) {
//   player.pos = player.pos.plus(new Vector(x, y));
// }
//
// function status(item, title) {
//   console.log(`${title}: ${position(item)}`);
//   if (player.isIntersect(item)) {
//     console.log(`Игрок подобрал ${title}`);
//   }
// }
//
// items.forEach(status);
// movePlayer(10, 10);
// items.forEach(status);
// movePlayer(5, -5);
// items.forEach(status);


class Level {
  constructor(grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;
    this.height = grid.length;
    this.width = Math.max(0, ...grid.map(string => string.length));
    this.status = null;
    this.finishDelay = 1;
    this.player = actors.find(actor => actor.type === "player");
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
    if(this.actors.length != 0){
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
    return('lava');
  }else if (left < 0 || top < 0 || right > this.width) {
    return 'wall';
  }
  for (let i = top; i < bottom; i++) {
    for (let j = left;  j< right; j++) {
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
    if (this.actors == undefined) {
      return true;
    }
    for (let actor in this.actors) {
      if (actor.type === type) {
        return false;
      }
    }
    return true;
  }
  playerTouched(obstacle, movingObj) {
    if (this.noMoreActors('coin')) {
      this.status = 'won';
    }
    if (obstacle === 'lava' || obstacle === 'fireball') {
      this.status = 'lost';
    }
    if (obstacle === 'coin' && movingObj.type === 'coin') {
      this.removeActor(movingObj);
    }
  }
}


// const grid = [
//   [undefined, undefined],
//   ['wall', 'wall']
// ];
//
// function MyCoin(title) {
//   this.type = 'coin';
//   this.title = title;
// }
// MyCoin.prototype = Object.create(Actor);
// MyCoin.constructor = MyCoin;
//
// const goldCoin = new MyCoin('Золото');
// const bronzeCoin = new MyCoin('Бронза');
// const player = new Actor();
// const fireball = new Actor();
//
// const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);
//
// level.playerTouched('coin', goldCoin);
// level.playerTouched('coin', bronzeCoin);
//
// if (level.noMoreActors('coin')) {
//   console.log('Все монеты собраны');
//   console.log(`Статус игры: ${level.status}`);
// }
//
// const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
// if (obstacle) {
//   console.log(`На пути препятствие: ${obstacle}`);
// }
//
// const otherActor = level.actorAt(player);
// if (otherActor === fireball) {
//   console.log('Пользователь столкнулся с шаровой молнией');
// }



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


//   const plan = [
//   ' @ ',
//   'x!x'
// ];
//
// const actorsDict = Object.create(null);
// actorsDict['@'] = Actor;
//
// const parser = new LevelParser(actorsDict);
// const level = parser.parse(plan);
//
// level.grid.forEach((line, y) => {
//   line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
// });
//
// level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));


class Fireball extends Actor {
  constructor(pos, speed) {
    super(pos, undefined, speed);
    delete this.type;
    Object.defineProperty(this, 'type', {
      value: 'fireball',
      configurable: true
    });
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
      this.pos = new Vector(newPos.x,newPos.y);
    } else {
      this.handleObstacle();
    }
  }
}


// const time = 5;
// const speed = new Vector(1, 0);
// const position = new Vector(5, 5);
//
// const ball = new Fireball(position, speed);
//
// const nextPosition = ball.getNextPosition(time);
// console.log(`Новая позиция: ${nextPosition.x}: ${nextPosition.y}`);
//
// ball.handleObstacle();
// console.log(`Текущая скорость: ${ball.speed.x}: ${ball.speed.y}`);



class HorizontalFireball extends Fireball{
  constructor(pos){
    super(pos);
    this.speed = new Vector(2,0);
  }
}

class VerticalFireball extends Fireball{
  constructor(pos){
    super(pos);
    this.speed = new Vector(0,2);
  }
}

class FireRain extends Fireball{
  constructor(pos){
    super(pos);
    this.speed = new Vector(0,3);
    this.default = pos;
  }
  handleObstacle(){
     this.pos = this.default;
  }
}


class Coin extends Actor{
  constructor(pos){
    super(pos);
    delete this.type;
    Object.defineProperty(this, 'type', {
      value: 'coin',
      configurable: true
    });
    this.size = new Vector(0.6,0.6);
    this.pos = this.pos.plus(new Vector(0.2,0.1));
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * (2 * Math.PI);
    this.default = Object.assign({},this.pos);
  }

  updateSpring(time = 1){
    this.spring += this.springSpeed * time;
  }

  getSpringVector(){
    return new Vector(0,Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1){
    this.updateSpring(time);
    return new Vector(this.default.x + this.getSpringVector().x , this.default.y + this.getSpringVector().y);
  }

  act(time){
     const newPos = this.getNextPosition(time);
     this.pos = new Vector(newPos.x,newPos.y);
  }
}


class Player extends Actor{
  constructor(pos){
    super(pos);
    this.pos = this.pos.plus(new Vector(0,-(0.5)));
    this.size = new Vector(0.8,1.5);
    delete this.type;
    Object.defineProperty(this, 'type', {
      value: 'player',
      configurable: true
    });
  }
}
