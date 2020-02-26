interface PongGameSettings {
  paddleRadius: number,
};

interface PongGameState {
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


function resetBall(){
  gameState.ball = {
    x: (Math.floor(matrix.width()/2)),
    y: (Math.floor(matrix.height()/2)),
    heading: (Math.random() * 0.25) + 0.125 + Math.random() < 0.5 ? 0 : 0.5,   // A random value within 45º of straight, randomly left or right.
    velocity: 2, // AKA, two pixels per second
  }
}
function resetGame(){
  gameState = {
    score: [0, 0],
    paddles:[0, 0],
    ball: {
      x: (Math.floor(matrix.width()/2)),
      y: (Math.floor(matrix.height()/2)),
      heading: (Math.random() * 0.25) + 0.125 + Math.random() < 0.5 ? 0 : 0.5,   // A random value within 45º of straight, randomly left or right.
      velocity: 2, // AKA, two pixels per second
    },
  }
  setTimeout(tick, 2000);
}

function winScreen(){
    // Player X wins!
    matrix.clear();

    setTimeout(resetGame, 5000);

}

function incrementScore(player: number){
  gameState.score[player]++;
  if (gameState.score[player] >= 10) {
    winScreen();
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
  if (ball.x < 1 && Math.abs(ball.y - gameState.paddles[0])){}
  if (ball.x < 1 && Math.abs(ball.y - gameState.paddles[1])){}

  // Check for out of x bounds, if so apply score
  if (ball.x > 0 && ball.x < matrix.width()) { setTimeout(() => {}, (1 / ball.velocity) * 1000); };
  if (ball. x < 0) { incrementScore(0); };
  if (ball. x > matrix.width()) { incrementScore(1); };
}

function gameLoop(){
  let { paddleRadius } = gameSettings;

  // Draw paddles
  matrix.fgColor(0xFFFFFF);
  matrix.drawLine(0, gameState.paddles[0] - paddleRadius, 0, gameState.paddles[0] - paddleRadius);
  matrix.drawLine(matrix.width()-1, gameState.paddles[0] - paddleRadius, matrix.width()-1, gameState.paddles[0] - paddleRadius);

  // Draw ball
  matrix.setPixel(Math.floor(gameState.ball.x), Math.floor(gameState.ball.y));

  // Draw scores
  matrix.fgColor(0xBBBBBB);
  let midpoint = matrix.width() / 2;
  matrix.drawLine(midpoint, 0, midpoint - gameState.score[0], 0);
  matrix.drawLine(midpoint, 0, midpoint + gameState.score[1], 0);
}

// Inner loop runs as fast as possible, draw grid.
function syncLoop(){
  return (mat, dt, t) => {
    matrix.clear();

    gameLoop();

    setTimeout(() => matrix.sync(), 0);
  }
}

function init (m){
    matrix = m;
    matrix.clear();
    resetGame();
    gameLoop();
    matrix.afterSync(syncLoop());
}

let Pong = { init };

export { Pong };
