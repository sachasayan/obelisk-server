const BASE_COLORS = {
  'wall':   0x1919A6,
  'player': 0xFFFF00,
  'inky':   0xFF0000,
  'binky':  0xFFB8FF,
  'pinky':  0x00FFFF,
  'clyde':  0xFFB852,
  'empty':  0x000000,
  'dot':    0x040404
};

enum MAP_LOOKUP {
  '#3f51b5' = 'W',
  '#000000' = 'O',
  '#333333' = 'O',
  '#ffffff' = 'O',
  '#00ff00' = 'W'
}

enum STATUS {
  INTRO,
  PLAYING_GAME,
  WIN_SCREEN
}

enum TILES {
  W = 'wall',
  O = 'empty',
  D = 'dot'
};

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
    this.previous =  { x: x, y: y};
  }
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

interface MunchGameSettings {
  grid: string,
  speed: number,
  ghostsTick: number
}


export { BASE_COLORS, MunchGameSettings, MunchGameState, Ghost, STATUS, MAP_LOOKUP, TILES };