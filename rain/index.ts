
class Raindrop {
  velocity: number;
  y: number;

  constructor(
    readonly x: number,
    y: number,
    velocity: number,
  ) {}

  next(): number {
    this.y += this.velocity;
    this.velocity ++;
    return this.y;
  }
}

function initRain (matrix){
    matrix
      .clear()
      .brightness(20);

    const raindrops: Raindrop[] = [];
    for (let x = 0; x < matrix.width()/2 ; x++) {
      raindrops.push(new Raindrop(Math.random()matrix.width(), 0, 0));
    }

    matrix.afterSync((mat, dt, t) => {
      raindrops.forEach(drop => {
        drop.next();
        matrix.fgColor(0xFFFFFF).setPixel(drop.x, drop.y);
      });

      setTimeout(() => matrix.sync(), 0);
    });
}

let Rain = { initRain };

export { Rain };
