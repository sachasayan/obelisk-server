class Star {
  velocity: number;
  y: number;

  constructor(
    readonly x: number,
    y: number,
    velocity: number,
  ) {
    this.velocity = velocity;
    this.y = y + Math.random() * 16;
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

    matrix
      .clear()
      .brightness(20);

    let ball: any;
    let paddles: []  = [];

    matrix.afterSync((mat, dt, t) => {
      matrix
      .clear()
      .brightness(20);

      matrix.fgColor(0xFFFFFF).setPixel(x, y);


      setTimeout(() => matrix.sync(), 0);
    });

}

let Pong = { init };

export { Pong };
