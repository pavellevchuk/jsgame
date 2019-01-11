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
      get:() => this.pos.y + this.size.y
    });
    Object.defineProperty(this, 'type', {
      value: 'actor',
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
  constructor(mesh, actors) {
    if (mesh == undefined) {
      this.height = 0;
      this.width = 0;
    } else {
      this.grid = mesh;
      this.height = mesh.length;
      Object.defineProperty(this, 'width', {
        get: function() {
          return Math.max(...(mesh.map(row => row.length)));
        }
      });
    }
    this.status = null;
    this.finishDelay = 1;
    this.actors = actors;
    Object.defineProperty(this, 'player', {
      get: function() {
        return this.actors.find(act => act.type === 'player');
      }
    });
  }
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
    if (this.grid === undefined || this.actors.length == 1) {
        return undefined;
      }
    return this.actors.find(act => movingObj.isIntersect(act));
  }
  obstacleAt(moveTo, size) {
    if(!(moveTo instanceof Vector) || !(size instanceof Vector)){
      throw Error('Один из аргументов не является вектором');
    }
   let movingObj = new Actor(moveTo,size);
    for( let i = moveTo.y; i <= size.y; i++){
      for( let j = moveTo.x; j <= size.x; j++){
        if(this.grid[i][j] != undefined){
          return this.grid[i][j];
        }
      }
    }
   if (movingObj.left < 0 || movingObj.top < 0 || movingObj.right > this.width){
     return 'wall';
   }
   if(movingObj.bottom > this.height){
     return 'lava';
   }
    return undefined;
    }
  removeActor(actor) {

  }
}



let v = new Level([[1,2,3,4],[1,2,3]]);
console.log(v.obstacleAt(new Vector,new Vector));
