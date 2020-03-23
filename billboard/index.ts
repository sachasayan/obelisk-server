import {
  Font
} from 'rpi-led-matrix';

let matrix: any;
let font;

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function displayGameScreen(){
  matrix
    .fgColor(0x333333)
    .drawText(String(formatAMPM(new Date)), 2, 2);
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


