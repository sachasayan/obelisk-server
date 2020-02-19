
class Raindrop {
  velocity: number;
  y: number;

  constructor(
    readonly x: number,
    y: number,
    velocity: number,
  ) {
    this.velocity = velocity;
    this.y = y + Math.random() * 10;
  }

  next(): number {
    this.y += this.velocity;
    this.velocity += 0.01;
    if (this.y > 16) {
      this.y = 0;
      this.velocity = 0.1;
    }
    return Math.floor(this.y);
  }
}

function initRain (matrix){
    matrix
      .clear()
      .brightness(20);

    const raindrops: Raindrop[] = [];

    for (let x = 0; x < matrix.width()/2 ; x++) {
      raindrops.push(new Raindrop(Math.random()*matrix.width(), 0, 0));
    }

    matrix.afterSync((mat, dt, t) => {
      matrix
      .clear()
      .brightness(20);

      raindrops.forEach(drop => {
        drop.next();
        matrix.fgColor(0xFFFFFF).setPixel(drop.x, drop.y);
      });

      setTimeout(() => matrix.sync(), 0);
    });
}

let Rain = { initRain };

export { Rain };
