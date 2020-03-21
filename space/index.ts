import * as Jimp from 'jimp';

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
    if (this.y > 16) {
      this.y = 0;
      this.velocity = Math.random()/3 + 0.3;
    }
    return Math.floor(this.y);
  }
}

function init (matrix){

    matrix.clear();

    let rocket;
    const starfield: Star[] = [];

    for (let x = 0; x < matrix.width()/2 ; x++) {
      starfield.push(new Star(Math.random()*matrix.width(), 0, 30));
    }

    matrix.afterSync((mat, dt, t) => {
      matrix
      .clear();

      starfield.forEach(drop => {
        drop.next();
        matrix.fgColor(0xFFFFFF).setPixel(drop.x, drop.y);
      });

      if(rocket){
        rocket.scan(0, 0, rocket.bitmap.width, rocket.bitmap.height, function(x, y, idx) {
          let pc = rocket.getPixelColor(x, y);
          if (pc % 256 == 255) {
            matrix.fgColor( (pc - (pc % 256)) / 256).setPixel( x + (64-8), y);
          }
        });
      }

      setTimeout(() => matrix.sync(), 40);
    });


    Jimp.read('./space/spaceship.png')
      .then(img => {
        rocket = img;
        matrix.sync();
      })
      .catch(err => {
        console.error(err);
      });

}

let Space = { init };

export { Space };
