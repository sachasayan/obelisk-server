interface PongGameSettings {
  paddleRadius: number,
};

enum STATUS {
  INTRO,
  PLAYING_GAME,
  WIN_SCREEN
}

interface PongGameState {
  activeScreen: STATUS,
  score: number[],
  paddles: number[],
  ball: {
    x: number,
    y: number,
    heading: number,
    velocity: number
  }
};

let gameSettings: PongGameSettings = {
  paddleRadius: 1
};

let gameState: PongGameState;

let matrix;

function resetBall() {
  gameState.ball = {
    x: (Math.floor(matrix.width()/2)),
    y: (Math.floor(matrix.height()/2)),
    heading: (Math.random() * 0.25) + 0.125 + Math.random() < 0.5 ? 0 : 0.5,   // A random value within 45º of straight, randomly left or right.
    velocity: 4, // AKA, two pixels per second
  }
}

function resetGame() {
  gameState = {
    activeScreen: STATUS.PLAYING_GAME,
    score: [0, 0],
    paddles:[Math.floor(matrix.height()/2), Math.floor(matrix.height()/2)],
    ball: {
      x: (Math.floor(matrix.width()/2)),
      y: (Math.floor(matrix.height()/2)),
      heading: (Math.random() * 0.25) + 0.125 + Math.random() < 0.5 ? 0 : 0.5,   // A random value within 45º of straight, randomly left or right.
      velocity: 4, // AKA, two pixels per second
    },
  }
  setTimeout(tick, 2000);
}

function incrementScore(player: number){
  gameState.score[player]++;
  if (gameState.score[player] >= 10) {
    gameState.activeScreen = STATUS.WIN_SCREEN;
    setTimeout(resetGame, 5000);
  } else {
    resetBall();
    setTimeout(tick, 2000);
  }
}

function tick() {
  let ball = gameState.ball;
  // Move ball
  ball.x += Math.cos(Math.PI*ball.heading*2);
  ball.y += Math.sin(Math.PI*ball.heading*2);
  // Hitting edges? Apply reflection
  if (ball.y < 0){
    ball.y = 0 - ball.x;
    ball.heading < 0.5 ? ball.heading = 0.5 - ball.heading : ball.heading = 1.5 - ball.heading;
  };
  if (ball.y >= matrix.height()){
    ball.y = matrix.height - (ball.y - matrix.height);
    ball.heading < 0.5 ? ball.heading = 0.5 - ball.heading : ball.heading = 1.5 - ball.heading;
  };

  // Did we hit a paddle? Reflect x.
  if (ball.x < 1) { ball.heading = 0.25;}
  if (ball.x < 1 && Math.abs(ball.y - gameState.paddles[0]) <= gameSettings.paddleRadius){ball.heading = 0.25}
  if (ball.x > matrix.width() && Math.abs(ball.y - gameState.paddles[1]) <= gameSettings.paddleRadius){ball.heading = 0.75}

  // Check for out of x bounds, if so apply score
  if (ball.x > 0 && ball.x < matrix.width()) { setTimeout(() => {tick()}, (1 / ball.velocity) * 1000); };
  if (ball.x < 0) { incrementScore(0); };
  if (ball.x > matrix.width()) { incrementScore(1); };
}

function displayIntroScreen(){}

function displayGameScreen(){
  let { paddleRadius } = gameSettings;

  // Draw paddles
  matrix.fgColor(0xFFFFFF);
  matrix.drawLine(0, gameState.paddles[0] - paddleRadius, 0, gameState.paddles[0] + paddleRadius);
  matrix.drawLine(matrix.width()-1, gameState.paddles[1] - paddleRadius, matrix.width()-1, gameState.paddles[1] + paddleRadius);

  // Draw ball
  matrix.setPixel(Math.floor(gameState.ball.x), Math.floor(gameState.ball.y));

  // Draw scores
  matrix.fgColor(0x333333);
  let midpoint = matrix.width() / 2;
  matrix.drawLine(midpoint-1, 0, midpoint - 1 - gameState.score[0], 0);
  matrix.drawLine(midpoint, 0, midpoint + gameState.score[1], 0);
}

function displayWinScreen(){

}

function gameLoop(){
  switch(gameState.activeScreen) {
    case STATUS.PLAYING_GAME:
      displayGameScreen();
      break;
    case STATUS.INTRO:
      displayIntroScreen();
      break;
    case STATUS.WIN_SCREEN:
      displayWinScreen();
      break;
    default:
      break;
  }
}

function init (m){
    matrix = m;
    matrix.clear();
    resetGame();
    gameLoop();
    matrix.afterSync((mat, dt, t) => {
      matrix.clear();

      gameLoop();

      setTimeout(() => matrix.sync(), 0);
    });
}

let Pong = { init };

export { Pong };
