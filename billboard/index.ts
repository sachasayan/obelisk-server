import {
  Font
} from 'rpi-led-matrix';
const http = require('http');

let matrix: any;
let font;
let nextbusInfo = '';


let tick = () => {
  http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&stopId=0816', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      let departuresByRoute = JSON
                    .parse(data).predictions
                    .filter(route => !!route.direction && !!route.direction.prediction);
      nextbusInfo = departuresByRoute.length > 0 ? departuresByRoute[0].direction.prediction[0].minutes : null;
    });
  });
  setTimeout(tick, 60*1000);
}

function displayGameScreen(){

  let time = new Date();
  let formattedTime = time.toLocaleString('en-US', { timeZone: 'America/Toronto', hour: 'numeric', minute: 'numeric', hour12: true });

  matrix
    .fgColor(0x333333)
    .drawText(String(formattedTime), 2, 0)
    .drawText(String(nextbusInfo), 65, 0);
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
    setTimeout(tick, 1000);
}

let Billboard = { init };

export { Billboard };


