import { chroma } from 'chroma-js';

let colors = {
  'W': 0x1919A6,
  'P': 0xFFFF00,
  'I': 0xFF0000,
  'B': 0xFFB8FF,
  'C': 0x00FFFF,
  'T': 0xFFB852,
  'O': 0x000000
};

let scales = {
  player: chroma.scale('black', colors.P)
}


let grid = `
WWWWWWWWWWWWWWOWWWWWWWWWWWWWWWWOWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WOOOWOOOOOOOOOOWWWOOOOOOOOOOOOWOWOOOOOOOOOOOOOOOOOOOOOOOOWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOWOOOOOWWWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOW
WOWOOOWWWOWWWOOWWWWWWWOWWWWWWOOOOOWWWWWWWWWWWWWWWWOWWWWWWWWWWWOWWWWWWWWWWWWWWWWWWWWWWWWWOWWWWWOWWWWWWWOWWWWWWWWWWWWWWWWWWWWOWWOW
WOWWWOWOOOOOOOOWWWWWWWOOOOOOOOWOWOOOOOOOOOOOOOOOOOOOOOOWOWWWWWOOOOOOOOOOOOOOOOOOOOOOWWWWOWWWWWOWWWWWWWOOOOOOOOOOOOOOOOOOOOOOWWOW
WOWOOOWOWWWOWWWWOOOWWWOWWWWWWOWOWOWWWOWWWOOOOOWWWWWWWWOWOOOWWWOWWWWWWOWWOOWWWOWWWOWWOOOOOOOOOOOOOOOWWWOWWWWWWOWWOOWWWOWWWOWOWWOW
WOWOWOWOWOOOWOOOWWOWWWOWWWOWWOWOWOOWWOOWWOOOOOWOOOOOOWOWOWOWWWOWWWOWWOWOOOOWWOOWWOWWWWOWWWWOWWWWWWOWWWOWWWOWWOWOOOOWWOOWWOWOOOOW
WOOOWOOOOOWOWOOOOOOOOOOOOOOWWOWOWWOWWOOWWOWOOOWOIOOBOWOOOWOOOOOOOOOWWOWOWWOWWOOWWOWWWWOOOOWOWOOOOOOOOOOOOOOWWOWOWWOWWOOWWOWWWWOW
WOWWWOWWWWWOWOOOOOOWWWWWWWOWWOWOWWOWWOOWWOWOOOWOOOOOTOOWWWOOOOOOOWOWWOWOWWOWWOOWWOWWWWWWWOWOWOWWWWOWWWWWWWOWWOWOWWOWWOOWWOWWWWOW
WOWWWOWWWWWOWOOOOOOWWWWWWWOWWOWOWWOWWOOWWOWWOOWOOOOOOOOWWWOOOOOOOOOWWOWOWWOWWOOWWOWWWWWWWOWOWOWWWWOWWWWWWWOWWOWOWWOWWOOWWOWWWWOW
WOOOWOOOOOWOWOOOOOOOOOOOOOOWWOWOWWOWWOOWWOWWOOWOOCOOOWOOOWOOOOOOOOOWWOWOWWOWWOOWWOWWWWOOOOWOWOOOOOOOOOOOOOOWWOWOWWOWWOOWWOWWWWOW
WOWOWOWOWOOOWOOOWWOWWWOWWWOWWOWOWOOWWOOWWOWWOOWOOOOOOWOWOWOWWWOWWWOWWOWOOOOWWOOWWOWWWWOWWWWOWWWWWWOWWWOWWWOWWOWOOOOWWOOWWOWOOOOW
WOWOOOWOWWWOWWWWOOOWWWOWWWWWWOWOWOWWWOOWWOWWOOWWWWWWWWOWOOOWWWOWWWWWWOWWOOWWWOOWWOWWOOOOOOOOOOOOOOOWWWOWWWWWWOWWOOWWWOOWWOWOWWOW
WOWWWOWOOOOOOOOWWWWWWWOOOOOOWWWOWWWOOOOOOOOOOOOOOOOOOOOWOWWWWWOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWOOOOOOOOOOOOOOOOOOOOOOWWOW
WOWOOOWWWOWWWOOWWWWWWWOWWWWWWOOOOOWWWWWWWWWWWWWWWWOWWWWWWWWWWWOWWWWWWWWWWWWWWWWWWWWWWWWWWWOOOOOWWWWWWWOWWWWWWWWWWWWWWWWWWWWOWWOW
WOOOWOOOOOOOOOOOOOOOOOOOOOOOOOWOWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOWWWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWOWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
`;


enum STATUS {
  INTRO,
  PLAYING_GAME,
  WIN_SCREEN
}

class Ghost{
  id: number;
  color: string;
  location: {
    x: number,
    y: number
  };
  status: string;
}

interface MunchGameSettings {
  speed: number,
}

interface MunchGameState {
  activeScreen: STATUS,
  ghostsAggressive: boolean,
  ghosts: Ghost[],
  player: {
    x: number,
    y: number,
    heading: number,
    lives: number
  }
};

let gameSettings: MunchGameSettings = {
  speed: 200
};

let gameState: MunchGameState;

let matrix;

function resetPlayer() {
  gameState.player = {
    x: 1,
    y: 1,
    heading: 3,
    lives: gameState.player.lives-1,
  }
}

function resetGame() {
  gameState = {
    activeScreen: STATUS.PLAYING_GAME,
    ghostsAggressive: false,
    ghosts: [new Ghost(), new Ghost(), new Ghost(), new Ghost()],
    player: {
      x: 1,
      y: 1,
      heading: 3,
      lives: 3
    }
  };
}


function tick() {
  let player = gameState.player;
  // Move player
  player.x += 1;
  player.y += 0;
  // Hitting pill? Gobble it up.
  // Hitting ghost? Die, sorry. :(

  // No pills left? Great, you win.

  setTimeout(tick, 200);
}

function displayIntroScreen(){}

function displayGameScreen(){
  let f = grid.replace(/\n|\r/g, "");
  let field = Array.from(f).map((char) => colors[char]);

  // Display field
  field.forEach((c, i) => {
    matrix.fgColor(c)
      .setPixel(i % 128, Math.floor(i / 128));
  });

  // Display player
  matrix.fgColor(scales.player(1).num()).setPixel(gameState.player.x, gameState.player.y);

}

function gameLoop(){
  switch(gameState.activeScreen) {
    case STATUS.PLAYING_GAME:
      displayGameScreen();
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

      gameLoop();

      setTimeout(() => matrix.sync(), 0);
    });

    matrix.sync();
}

let Munchman = { colors, init };

export { Munchman };