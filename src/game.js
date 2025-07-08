const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

const gridSize = 20; // size of each block
const canvasSize = canvas.width; // assume square canvas

let snake;
let direction;
let food;
let score;
let gameInterval;

function init() {
  snake = [{x: 10, y: 10}];
  direction = {x: 1, y: 0};
  placeFood();
  score = 0;
  scoreElement.textContent = 'Score: ' + score;
  gameOverElement.classList.add('hidden');
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100); // game speed
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / gridSize)),
    y: Math.floor(Math.random() * (canvasSize / gridSize))
  };
}

function gameLoop() {
  update();
  draw();
}

function update() {
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  // wrap around screen
  head.x = (head.x + canvasSize / gridSize) % (canvasSize / gridSize);
  head.y = (head.y + canvasSize / gridSize) % (canvasSize / gridSize);

  // check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // check food collision
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreElement.textContent = 'Score: ' + score;
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // draw food
  ctx.fillStyle = '#0f0';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // draw snake as blocks
  ctx.fillStyle = '#ff0';
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function changeDirection(event) {
  const key = event.key;
  if (key === 'ArrowUp' && direction.y !== 1) {
    direction = {x: 0, y: -1};
  } else if (key === 'ArrowDown' && direction.y !== -1) {
    direction = {x: 0, y: 1};
  } else if (key === 'ArrowLeft' && direction.x !== 1) {
    direction = {x: -1, y: 0};
  } else if (key === 'ArrowRight' && direction.x !== -1) {
    direction = {x: 1, y: 0};
  } else if (key === 'Enter' && gameOverElement.classList.contains('hidden') === false) {
    init();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverElement.classList.remove('hidden');
}

window.addEventListener('keydown', changeDirection);
init();
