import * as chroma from 'chroma-js';

const baseColors = {
  'wall':   0x1919A6,
  'player': 0xFFFF00,
  'inky':   0xFF0000,
  'binky':  0xFFB8FF,
  'pinky':  0x00FFFF,
  'clyde':  0xFFB852,
  'empty':  0x000000,
  'dot':    0x444444
};

let colors = {
  'wall': chroma.scale([0, baseColors['wall']]),
  'player': chroma.scale([0, baseColors['player']]),
  'inky': chroma.scale([0, baseColors['inky']]),
  'binky': chroma.scale([0, baseColors['binky']]),
  'pinky': chroma.scale([0, baseColors['pinky']]),
  'clyde': chroma.scale([0, baseColors['clyde']]),
  'empty': chroma.scale([0, baseColors['empty']]),
  'dot': chroma.scale([0, baseColors['dot']]),
};

let grid = `
WWWWWWWWWWWWWWDWWWWWWWWWWWWWWWWDWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WDDDWDDDDDDDDDDWWWDDDDDDDDDDDDWDWDDDDDDDDDDDDDDDDDDDDDDDDWDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDWDDDDDWWWDDDDDDDDDDDDDDDDDDDDDDDDDDDDDW
WDWDDDWWWDWWWDDWWWWWWWDWWWWWWDDDDDWWWWWWWWWWWWWWWWDWWWWWWWWWWWDWWWWWWWWWWWWWWWWWWWWWWWWWDWWWWWDWWWWWWWDWWWWWWWWWWWWWWWWWWWWDWWDW
WDWWWDWDDDDDDDDWWWWWWWDDDDDDDDWDWDDDDDDDDDDDDDDDDDDDDDDWDWWWWWDDDDDDDDDDDDDDDDDDDDDDWWWWDWWWWWDWWWWWWWDDDDDDDDDDDDDDDDDDDDDDWWDW
WDWDDDWDWWWDWWWWDDDWWWDWWWWWWDWDWDWWWDWWWDDDDDWWWWWWWWDWDDDWWWDWWWWWWDWWDDWWWDWWWDWWDDDDDDDDDDDDDDDWWWDWWWWWWDWWDDWWWDWWWDWDWWDW
WDWDWDWDWDDDWDDDWWDWWWDWWWDWWDWDWDDWWDDWWDDDDDWOOOOOOWDWDWDWWWDWWWDWWDWDDDDWWDDWWDWWWWDWWWWDWWWWWWDWWWDWWWDWWDWDDDDWWDDWWDWDDDDW
WDDDWDDDDDWDWDDDDDDDDDDDDDDWWDWDWWDWWDDWWDWDDDWOOOOOOWDDDWDDDDDDDDDWWDWDWWDWWDDWWDWWWWDDDDWDWDDDDDDDDDDDDDDWWDWDWWDWWDDWWDWWWWDW
WDWWWDWWWWWDWDDDDDDWWWWWWWDWWDWDWWDWWDDWWDWDDDWOOOOOODDWWWDDDDDDDWDWWDWDWWDWWDDWWDWWWWWWWDWDWDWWWWDWWWWWWWDWWDWDWWDWWDDWWDWWWWDW
WDWWWDWWWWWDWDDDDDDWWWWWWWDWWDWDWWDWWDDWWDWWDDWOOOOOODDWWWDDDDDDDDDWWDWDWWDWWDDWWDWWWWWWWDWDWDWWWWDWWWWWWWDWWDWDWWDWWDDWWDWWWWDW
WDDDWDDDDDWDWDDDDDDDDDDDDDDWWDWDWWDWWDDWWDWWDDWOOOOOOWDDDWDDDDDDDDDWWDWDWWDWWDDWWDWWWWDDDDWDWDDDDDDDDDDDDDDWWDWDWWDWWDDWWDWWWWDW
WDWDWDWDWDDDWDDDWWDWWWDWWWDWWDWDWDDWWDDWWDWWDDWOOOOOOWDWDWDWWWDWWWDWWDWDDDDWWDDWWDWWWWDWWWWDWWWWWWDWWWDWWWDWWDWDDDDWWDDWWDWDDDDW
WDWDDDWDWWWDWWWWDDDWWWDWWWWWWDWDWDWWWDDWWDWWDDWWWWWWWWDWDDDWWWDWWWWWWDWWDDWWWDDWWDWWDDDDDDDDDDDDDDDWWWDWWWWWWDWWDDWWWDDWWDWDWWDW
WDWWWDWDDDDDDDDWWWWWWWDDDDDDWWWDWWWDDDDDDDDDDDDDDDDDDDDWDWWWWWDDDDDDDDDDDDDDDDDDDDDDWWWWWWWWWWWWWWWWWWDDDDDDDDDDDDDDDDDDDDDDWWDW
WDWDDDWWWDWWWDDWWWWWWWDWWWWWWDDDDDWWWWWWWWWWWWWWWWDWWWWWWWWWWWDWWWWWWWWWWWWWWWWWWWWWWWWWWWDDDDDWWWWWWWDWWWWWWWWWWWWWWWWWWWWDWWDW
WDDDWDDDDDDDDDDDDDDDDDDDDDDDDDWDWDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDWWWDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWDWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
`;

enum TILES {
  W = 'wall',
  O = 'empty',
  D = 'dot'
};

enum STATUS {
  INTRO,
  PLAYING_GAME,
  WIN_SCREEN
}

class Ghost{
  type: string;
  location: {
    x: number,
    y: number
  };
  status: string;

  constructor(
    readonly t: string,
    readonly x: number,
    readonly y: number
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
  //let f = grid.replace(/\n|\r/g, "");  // Clean up whitespace
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
    }
    if (gameState.field[player.y][player.x] === 'D') {
      gameState.field[player.y][player.x] === 'O'
    }
  }

    // Hitting pill? Gobble it up.
    // Hitting ghost? Die, sorry. :(

    // No pills left? Great, you win.

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
    matrix.fgColor(baseColors[TILES[c]])
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
    matrix.clear();
    resetGame();
    setTimeout(tick, 2000);
    matrix.afterSync((mat, dt, t) => {
      matrix.clear();

      gameLoop(t);

      setTimeout(() => matrix.sync(), 0);
    });

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

    matrix.sync();
}

let Munchman = { init };

export { Munchman };