import * as chroma from 'chroma-js';
import * as Jimp from 'jimp';

import {
  BASE_COLORS,
  STATUS,
  MAP_LOOKUP,
  TILES,
  MunchGameSettings,
  MunchGameState,
  Ghost,
  Player
} from './types';

import { fade, colors, getAdjacent } from './utils';

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
    field: gameSettings.grid.trim().split('\n').map(row => row.split('')),
    sickoMode: false,
    inputs: [],
    ghosts: [new Ghost('inky', 62, 7), new Ghost('binky', 62, 8), new Ghost('pinky', 64, 7), new Ghost('clyde', 64, 8)],
    player: new Player()
  };
}

function tick() {
  let player = gameState.player;
  // Player movement
  if (!gameState.inputs.length){
    let candidates = getAdjacent(player.x, player.y, matrix)
      .filter(coords => !(coords.x == player.previous.x && coords.y == player.previous.y)) // Remove where we just came from.
      .filter(coords => gameState.field[coords.y][coords.x] !== 'W'); //Filter out walls
    let finalCandidate = candidates[Math.floor(Math.random()*candidates.length)];
    if (finalCandidate) {
      gameState.inputs.push('x');
      player.intent.x = finalCandidate.x;
      player.intent.y = finalCandidate.y;
    }

  }

  while (gameState.inputs.length){
    let i = gameState.inputs.shift();
    // Move player
    if (i == 'a') { player.intent.x -= 1; }
    if (i == 'd') { player.intent.x += 1; }
    if (i == 'w') { player.intent.y -= 1; }
    if (i == 's') { player.intent.y += 1; }

    if (gameState.field[player.intent.y][player.intent.x] !== 'W') {
      player.previous.x = player.x;
      player.previous.y = player.y;
      player.x = player.intent.x;
      player.y = player.intent.y;
    } else {
      player.intent.x = player.x;
      player.intent.y = player.y;
    }
    // Eat dot
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
  gameState.ghosts.forEach(g => {
    // Get all viable candidates.
    let candidates = getAdjacent(g.x, g.y, matrix)
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