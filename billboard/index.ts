import {
  Font
} from 'rpi-led-matrix';

let matrix: any;
let font;

function displayGameScreen(){

  let time = new Date();
  time.toLocaleString('en-US', { timeZone: 'EDT', hour: 'numeric', minute: 'numeric', hour12: true });

  matrix
    .fgColor(0x333333)
    .drawText(String(time), 2, 2);
}

function init (m){
    matrix = m;
    matrix.clear();

    font = new Font('helvR12', `${process.cwd()}/fonts/helvR12.bdf`);
    //const lines = LayoutUtils.textToLines(font, matrix.width(), 'Hello, matrix!');

    matrix.font(font);

    matrix.afterSync((mat, dt, t) => {
      matrix.clear();

      displayGameScreen();

      setTimeout(() => matrix.sync(), 0);
    });

    matrix.sync();
}

let Billboard = { init };

export { Billboard };


