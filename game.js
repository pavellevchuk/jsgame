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

const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);


class Actor {
  constructor(pos, size, speed) {
    if (pos == undefined) {
      this.pos = new Vector;
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
      this.speed = new Vector;
    } else {
      if (!(speed instanceof Vector)) {
        throw Error("Можно создавать движущийся обьект только с помощью векторов");
      }
      // this.speed = new Vector(speed.x, speed.y);
      this.speed = speed;
    }
    Object.defineProperty(this, 'type', {
      value: 'actor'
    });
    Object.defineProperty(this, 'left', {
      value: this.pos.x
    });
    Object.defineProperty(this, 'top', {
      value: this.pos.y
    });
    Object.defineProperty(this, 'right', {
      value: this.pos.x + this.size.x
    });
    Object.defineProperty(this, 'bottom', {
      value: this.pos.y + this.size.y
    });
  }
  act() {}
  isIntersect(movingObj) {
    if (!(movingObj instanceof Actor)) {
      throw Error("Можно передавать только обьект типа Actor");
    }

    if (this == movingObj || this.right == movingObj.left || this.left == movingObj.right ||
      this.top == movingObj.bottom || this.bottom == movingObj.top) {
      return false;
    }

    if ((movingObj.left > this.right) || (this.left > movingObj.right) || (this.bottom > movingObj.top) || (this.top < movingObj.bottom)) {
      return false;
    }

    if ((this.left < movingObj.right) && (this.right > movingObj.left) && (this.bottom < movingObj.top) && (this.top > movingObj.bottom)) {
        return true;
      }
    }
  }
