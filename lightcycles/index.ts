class LightCycle {
  xvelocity: number;
  yvelocity: number;
  y: number;
  x: number;
  color: number;
  constructor (
    color: number
  ) {
    this.color = color;
    this.xvelocity = 1;
    this.yvelocity = 0;
    this.y = 0;
    this.x = 0;
  }

  next(): any {
    this.x = (this.x + this.xvelocity + 128) % 128;
    this.y = (this.y + this.yvelocity + 16) % 16;
  }
}

function init (matrix){
    matrix
      .clear()
      .brightness(20);

    let player: LightCycle = new LightCycle(0xFF0000);

    // Game loop


    // Render loop
    matrix.afterSync((mat, dt, t) => {
      matrix.clear().brightness(20);

      player.next();
      matrix.fgColor(0xFFFFFF).setPixel(player.x, player.y);


      setTimeout(() => matrix.sync(), 0);
    });

}

let Lightcycles = { init };

export { Lightcycles };
