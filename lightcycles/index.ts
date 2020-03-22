import * as chroma from 'chroma-js';

import {
  fade,
  isViable,
  getAdjacent
} from './utils';
import {
  STATUS,
  LightCycle
} from './types';

let matrix;

let gameSettings = {
  grid: '',
  tick: (1000 / 5),
  demoMode: true
};

let gameState = {
  activeScreen: STATUS.PLAYING_GAME,
  inputs: [],
  players: [
    new LightCycle(0xDF740C, { x: 62, y: 7}, -1, 0),
    new LightCycle(0xFFE64D, { x: 62, y: 8}, -1, 0),
    new LightCycle(0xE6FFFF, { x: 64, y: 7}, 1, 0),
    new LightCycle(0x6FC3DF, { x: 64, y: 8}, 1, 0)
  ]
};

//////////////////////
// MOVEMENT
//////////////////////


function tick(){

  gameState.players.forEach(p => {

      // We'll use this in a moment to attempt to rule out any decisions that would be fatal
      let walls = gameState.players
        .map(e => {e.coords})
        .reduce((a, b) => a.concat(b), []);

      // Get all recommended movement candidates.
      let candidates = getAdjacent(p.coords[0].x, p.coords[0].y, matrix)
        .filter(coord => !walls.some( (w) => (w.x == coord.x && w.y == coord.y) ) ); //Filter out walls

      let finalCandidate = candidates.some( (coord) => { coord.x == p.coords[0].x + p.intent.x && coord.y == p.coords[0].y + p.intent.y } ) ?
            { x: p.coords[0].x + p.intent.x, y: p.coords[0].y + p.intent.y } :
            candidates[Math.floor(Math.random()*candidates.length)];

      p.intent = {
        x: finalCandidate.x - p.coords[0].x,
        y: finalCandidate.y - p.coords[0].y
      };


      p.step();



  });
  hitDetection();
  setTimeout(tick, gameSettings.tick);
}

function hitDetection() {
  // let {} = gameState;

  // // Did player hit a ghost? Die, sorry. :(
  // ghosts.forEach(g => {
  //   if (g.x == player.x && g.y == player.y){
  //     gameState.activeScreen = STATUS.PLAYING_GAME;
  //   }
  // });
}

//////////////////////
// GAME SCREENS
//////////////////////

function displayGameScreen(t: number){
  // Display users
  gameState.players.forEach((p, i) => {
    p.coords.forEach((c,i) => {
      matrix
      .fgColor(p.color)
      .setPixel(c.x,c.y);
    });

  });

}

function gameLoop(t: number){
  switch(gameState.activeScreen) {
    case STATUS.PLAYING_GAME:
      displayGameScreen(t);
      break;
    case STATUS.INTRO:
      break;
    default:
      break;
  }
}


//////////////////////
// GAME SCREENS
//////////////////////

function init (m){
    matrix = m;
    matrix.clear();

    setTimeout(tick, 1000);

    // Render loop
    matrix.afterSync((mat, dt, t) => {
      matrix.clear();

      gameLoop(t);

      setTimeout(() => matrix.sync(), 0);
    });

}


let Lightcycles = { init };

export { Lightcycles };