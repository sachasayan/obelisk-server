import * as chroma from 'chroma-js';
import * as Jimp from 'jimp';

const baseColors = {
  'wall':   0x1919A6,
  'player': 0xFFFF00,
  'inky':   0xFF0000,
  'binky':  0xFFB8FF,
  'pinky':  0x00FFFF,
  'clyde':  0xFFB852,
  'empty':  0x000000,
  'dot':    0x040404
};

let colors = {
  'wall': chroma.scale([0, baseColors['wall']]),
  'player': chroma.scale([0, baseColors['player']]),
  'inky': chroma.scale([0, baseColors['inky']]),
  'binky': chroma.scale([0, baseColors['binky']]),
  'pinky': chroma.scale([0, baseColors['pinky']]),
  'clyde': chroma.scale([0, baseColors['clyde']]),
  'empty': chroma.scale([0, baseColors['empty']]),
  'dot': chroma.scale([0x040404, baseColors['dot']]),
};
let grid = '';


enum TILES {
  W = 'wall',
  O = 'empty',
  D = 'dot'
};

enum MAP_LOOKUP {
  '#3f51b5' = 'W',
  '#000000' = 'O',
  '#333333' = 'O',
  '#ffffff' = 'O',
  '#00ff00' = 'O'
}

enum STATUS {
  INTRO,
  PLAYING_GAME,
  WIN_SCREEN
}

class Ghost{
  type: string;
  x: number;
  y: number;
  previous: {
    x: number,
    y: number
  };
  status: string;

  constructor(
    t: string,
    x: number,
    y: number
  ) {
    this.type = t;
    this.x = x;
    this.y = y;
  }
}

interface MunchGameSettings {
  speed: number,
}

interface MunchGameState {
  activeScreen: STATUS,
  field: string[][],
  sickoMode: boolean,
  ghosts: Ghost[],
  inputs: string[],
  player: {
    x: number,
    y: number,
    xIntent: number,
    yIntent: number,
    heading: number,
    lives: number
  }
};

let gameSettings: MunchGameSettings = {
  speed: 40
};

let gameState: MunchGameState;

let matrix;

function resetPlayer() {
  gameState.player = {
    x: 1,
    y: 1,
    xIntent: 1,
    yIntent: 1,
    heading: 3,
    lives: gameState.player.lives-1,
  }
}

function resetGame() {
  let field = grid.trim().split('\n').map(row => row.split(''));

  gameState = {
    activeScreen: STATUS.PLAYING_GAME,
    field: field,
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

  let getAdjacent = (x, y) => {
      return [{x: x+1, y: y}, {x: x-1, y: y}, {x: x, y: y-1}, {x: x, y: y+1}]
        .filter(coords => coords.x >= 0 && coords.y >= 0 && coords.x <= matrix.width() && coords.y <= matrix.height());
  }

  // Ghost movement
  gameState.ghosts.forEach(g => {
    // Get all viable candidates. Remove where we just came from.
    let candidates = getAdjacent(g.x, g.y).filter(coords => !(coords.x == g.previous.x && coords.y == g.previous.y));
    let finalCandidate = candidates[0];
    g.previous = { x: g.x, y: g.y};

    g.x = finalCandidate.x;
    g.y = finalCandidate.y;

  });

  // Hitting ghost? Die, sorry. :(
  gameState.ghosts.forEach(g => {
    if (g.x == player.x && g.y == player.y){
      gameState.activeScreen = STATUS.WIN_SCREEN;
    }
  });

  setTimeout(tick, gameSettings.speed);
}

function displayIntroScreen(){}


let fade = (t, freq, offset) => {
 return Math.abs(Math.sin(  Math.PI * (t % freq / freq - offset) ));
};

function displayGameScreen(t: number){

  // Display field
  gameState.field.forEach((row, y) => {
    row.forEach((c, x) => {
    matrix
      .fgColor(c === 'D' ? colors.dot(fade(t, 1000, (x / 128) )).num() : baseColors[TILES[c]])
      .setPixel(x, y);
    });
  });

  // Display player
  matrix
    .fgColor(colors.player(fade(t, 700, 0)).num())
    .setPixel(gameState.player.x, gameState.player.y);
  // Ghosts
  gameState.ghosts.forEach((g, i) => {
    matrix
      .fgColor(colors[g.type](fade(t, 700, i * 0.25)).num())
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
          grid += MAP_LOOKUP[chroma({
            r : img.bitmap.data[idx + 0],
            g : img.bitmap.data[idx + 1],
            b : img.bitmap.data[idx + 2]
          }).hex()];
          if (x == 127) { grid += '\n'; };
        });
        resetGame();
        setTimeout(tick, 2000);

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