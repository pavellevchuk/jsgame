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
        throw Error("Можно создавать движущийся обьект только с помощью векторов");
      }
      // this.pos = new Vector(pos.x, pos.y);
      this.pos = pos;
    }
    if (size == undefined) {
      this.size = new Vector(1, 1);
    } else {
      if (!(size instanceof Vector)) {
        throw Error("Можно создавать движущийся обьект только с помощью векторов");
      }
      // this.size = new Vector(size.x, size.y);
      this.size = size;
    }
    if (speed == undefined) {
      this.speed = new Vector();
    } else {
      if (!(speed instanceof Vector)) {
        throw Error("Можно создавать движущийся обьект только с помощью векторов");
      }
      // this.speed = new Vector(speed.x, speed.y);
      this.speed = speed;
    }

    this.bottom = this.pos.y + this.size.y;
    this.right = this.pos.x + this.size.x;
    this.top = this.pos.y;
    this.left =  this.pos.x;

    Object.defineProperty(this, 'type', {
      value: 'actor'
    });
  }
  act() {}
  isIntersect(movingObj) {
    if (!(movingObj instanceof Actor)) {
      throw Error("Можно передавать только обьект типа Actor");
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


const items = new Map();
const player = new Actor();
items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));

function position(item) {
  return ['left', 'top', 'right', 'bottom']
    .map(side => `${side}: ${item[side]}`)
    .join(', ');
}

function movePlayer(x, y) {
  player.pos = player.pos.plus(new Vector(x, y));
}

function status(item, title) {
  console.log(`${title}: ${position(item)}`);
  if (player.isIntersect(item)) {
    console.log(`Игрок подобрал ${title}`);
  }
}

items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);
