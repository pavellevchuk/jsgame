

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
