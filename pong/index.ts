class Ball {
  velocity: number;
  heading: number;
  y: number;
  x: number;
  constructor(
    x: number,
    y: number,
    velocity: number,
  ) {
    this.velocity = velocity;
    this.y = y + Math.random() * 16;
    this.x = 0;
  }

  next(): number {
    this.y += this.velocity;
    this.velocity += 0.001;
    if (this.y > 16) {
      this.y = 0;
      this.velocity = Math.random()/3 + 0.3;
    }
    return Math.floor(this.y);
  }
}

function init (matrix){

    matrix.clear();

    let ball: any;
    let paddles: []  = [];

    matrix.afterSync((mat, dt, t) => {
      matrix.clear();
      matrix.fgColor(0xFFFFFF).setPixel(1,1);

      setTimeout(() => matrix.sync(), 0);
    });

}

let Pong = { init };

export { Pong };
