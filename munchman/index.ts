import * as chroma from 'chroma-js';
import * as Jimp from 'jimp';

import {
  BASE_COLORS,
  STATUS,
  MAP_LOOKUP,
  TILES,
  MunchGameSettings,
  MunchGameState,
  Ghost
} from './types';

import { fade, colors } from './utils';

let matrix;

let gameSettings: MunchGameSettings = {
  grid: '',
  speed: 40,
  ghostsTick: 200
};

let gameState: MunchGameState;

function resetGame() {
  gameState = {
    activeScreen: STATUS.PLAYING_GAME,
    field: gameSettings.grid.trim().split('\n').map(row => row.split(''));
    sickoMode: false,
    inputs: [],
    ghosts: [new Ghost('inky', 52, 7), new Ghost('binky', 53, 8), new Ghost('pinky', 54, 10), new Ghost('clyde', 50, 10)],
    player: {
      x: 1,
      y: 1,
      xIntent: 1,
      yIntent: 1,
      heading: 3,
      lives: 3
    }
  };
}

function tick() {
  let player = gameState.player;
  // Player movement
  if (!gameState.inputs.length){
    gameState.inputs.push('wasd'.charAt(Math.floor(Math.random()*4)));
  }
  while (gameState.inputs.length){
    let i = gameState.inputs.shift();
    // Move player
    if (i == 'a') { player.xIntent -= 1; }
    if (i == 'd') { player.xIntent += 1; }
    if (i == 'w') { player.yIntent -= 1; }
    if (i == 's') { player.yIntent += 1; }

    if (gameState.field[player.yIntent][player.xIntent] !== 'W') {
      player.x = player.xIntent;
      player.y = player.yIntent;
    } else {
      player.xIntent = player.x;
      player.yIntent = player.y;
    }
    if (gameState.field[player.y][player.x] === 'D') {
      gameState.field[player.y][player.x] = 'O'
    }
  }

  // Hitting pill? Gobble it up.
  if (gameState.field[player.y][player.x] === 'P') {
    gameState.field[player.y][player.x] = 'O';
    gameState.sickoMode = true;
    setTimeout(() => { gameState.sickoMode = false}, 5000);
  }

  // Hitting ghost? Die, sorry. :(
    gameState.ghosts.forEach(g => {
      if (g.x == player.x && g.y == player.y){
        gameState.activeScreen = STATUS.PLAYING_GAME;
      }
    });

    setTimeout(tick, gameSettings.speed);
  }

function ghostsTick(){
  let getAdjacent = (x, y) => {
      return [{x: x+1, y: y}, {x: x-1, y: y}, {x: x, y: y-1}, {x: x, y: y+1}]
        .filter(coords => coords.x >= 0 && coords.y >= 0 && coords.x <= matrix.width() && coords.y <= matrix.height());
  }

  gameState.ghosts.forEach(g => {
    // Get all viable candidates.
    let candidates = getAdjacent(g.x, g.y)
      .filter(coords => !(coords.x == g.previous.x && coords.y == g.previous.y)) // Remove where we just came from.
      .filter(coords => gameState.field[coords.y][coords.x] !== 'W'); //Filter out walls
    let finalCandidate = candidates[Math.floor(Math.random()*candidates.length)];
    g.previous = { x: g.x, y: g.y};
    if (finalCandidate) {
      g.x = finalCandidate.x;
      g.y = finalCandidate.y;
    }
  });

  setTimeout(ghostsTick, gameSettings.ghostsTick);
}

function displayIntroScreen(){
  // matrix.fgColor(matrix.bgColor()).fill().fgColor(0xFFFFFF);
  // const font = fonts[matrix.font()];
  // matrix.drawText(glyph.char, glyph.x, glyph.y);
  // matrix.sync();

};

function displayGameScreen(t: number){

  // Display field
  gameState.field.forEach((row, y) => {
    row.forEach((c, x) => {
    matrix
      .fgColor(c === 'D' ? colors.dot(fade(t, 1000, (x / 128) )).num() : BASE_COLORS[TILES[c]])
      .setPixel(x, y);
    });
  });

  // Display player
  matrix
    .fgColor(BASE_COLORS.player)
    .setPixel(gameState.player.x, gameState.player.y);
  // Ghosts
  gameState.ghosts.forEach((g, i) => {
    matrix
      .fgColor(colors[g.type](fade(t, 700, 0.25)).num())
      .setPixel(g.x, g.y);
  });

}

function gameLoop(t){
  switch(gameState.activeScreen) {
    case STATUS.PLAYING_GAME:
      displayGameScreen(t);
      break;
    case STATUS.INTRO:
      displayIntroScreen();
      break;
    default:
      break;
  }
}

function init (m){
    matrix = m;
    // Load level

    Jimp.read('./munchman/munch-lvl.png')
    .then(img => {
        img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
          gameSettings.grid += MAP_LOOKUP[chroma({
            r : img.bitmap.data[idx + 0],
            g : img.bitmap.data[idx + 1],
            b : img.bitmap.data[idx + 2]
          }).hex()];
          if (x == 127) { gameSettings.grid += '\n'; };
        });
        resetGame();
        setTimeout(tick, 2000);
        setTimeout(ghostsTick, 2000);

        matrix.afterSync((mat, dt, t) => {
          matrix.clear();

          gameLoop(t);

          setTimeout(() => matrix.sync(), 0);
        });
        matrix.sync();
    })
    .catch(err => {
      console.error(err);
    });

    // Set inputs
    var stdin = process.stdin;
    stdin.setRawMode( true ); // without this, we would only get streams once enter is pressed
    stdin.resume();
    stdin.setEncoding( 'utf8' ); // i don't want binary, do you?
    stdin.on( 'data', ( key: string ) => {
      if ( key === '\u0003' ) { process.exit();} // ctrl-c ( end of text )
      if ( key === 'x' ) { stdin.pause(); stdin.setRawMode( false ); }
      if ( 'wasd'.includes(key) ) { gameState.inputs.push(key); }
      process.stdout.write( key );       // write the key to stdout all normal like
    });


}

let Munchman = { init };

export { Munchman };