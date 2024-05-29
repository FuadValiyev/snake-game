const gameArea = document.getElementById('gameArea');
const snake = document.getElementById('snake');
const food = document.getElementById('food');
const currentScoreElement = document.getElementById('currentScore');
const highScoreElement = document.getElementById('highScore');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const gridSize = 20;
let snakeBody = [{ x: 0, y: 0 }];
let direction = { x: 1, y: 0 };
let foodPosition = { x: 0, y: 0 };
let currentScore = 0;
let highScore = localStorage.getItem('highScore') || 0;

highScoreElement.textContent = highScore;

document.addEventListener('keydown', changeDirection);
gameArea.addEventListener('click', startGame);
setInterval(gameLoop, 100);

function startGame() {
    gameArea.removeEventListener('click', startGame);
    gameArea.style.cursor = 'none';
}

function gameLoop() {
    moveSnake();
    checkCollision();
    checkFood();
    drawSnake();
    drawFood();
}

function moveSnake() {
    const head = { x: snakeBody[0].x + direction.x, y: snakeBody[0].y + direction.y };
    snakeBody.unshift(head);
    snakeBody.pop();
}

function changeDirection(event) {
    if (event.type === 'keydown') {
        switch (event.key) {
            case 'ArrowUp':
                if (direction.y === 0) {
                    direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (direction.y === 0) {
                    direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (direction.x === 0) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (direction.x === 0) {
                    direction = { x: 1, y: 0 };
                }
                break;
        }
    } else if (event.type === 'click') {
        const clickX = event.clientX - gameArea.getBoundingClientRect().left;
        const clickY = event.clientY - gameArea.getBoundingClientRect().top;
        const centerX = gameArea.clientWidth / 2;
        const centerY = gameArea.clientHeight / 2;
        const diffX = clickX - centerX;
        const diffY = clickY - centerY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            direction = { x: diffX > 0 ? 1 : -1, y: 0 };
        } else {
            direction = { x: 0, y: diffY > 0 ? 1 : -1 };
        }
    }
}

function checkCollision() {
    const head = snakeBody[0];
    if (head.x < 0 || head.x >= gameArea.clientWidth / gridSize ||
        head.y < 0 || head.y >= gameArea.clientHeight / gridSize ||
        snakeBody.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
    }
}

function checkFood() {
    const head = snakeBody[0];
    if (head.x === foodPosition.x && head.y === foodPosition.y) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
        currentScore++;
        updateScores();
        placeFood();
        eatSound.play();
    }
}

function placeFood() {
    foodPosition = {
        x: Math.floor(Math.random() * gameArea.clientWidth / gridSize),
        y: Math.floor(Math.random() * gameArea.clientHeight / gridSize)
    };
}

function drawSnake() {
    gameArea.innerHTML = '';
    snakeBody.forEach(segment => {
        const snakeSegment = document.createElement('div');
        snakeSegment.style.width = snakeSegment.style.height = gridSize + 'px';
        snakeSegment.style.position = 'absolute';
        snakeSegment.style.backgroundColor = '#00e676';
        snakeSegment.style.left = segment.x * gridSize + 'px';
        snakeSegment.style.top = segment.y * gridSize + 'px';
        snakeSegment.style.borderRadius = '5px';
        snakeSegment.style.boxShadow = '0 0 5px #00c853';
        gameArea.appendChild(snakeSegment);
    });
}

function drawFood() {
    food.style.width = food.style.height = gridSize + 'px';
    food.style.position = 'absolute';
    food.style.backgroundColor = '#ff5252';
    food.style.borderRadius = '50%';
    food.style.boxShadow = '0 0 5px #ff1744';
    food.style.left = foodPosition.x * gridSize + 'px';
    food.style.top = foodPosition.y * gridSize + 'px';
    gameArea.appendChild(food);
}

function updateScores() {
    currentScoreElement.textContent = currentScore;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }
}

function gameOver() {
    gameOverSound.play();
    alert('Game Over!');
    resetGame();
}

function resetGame() {
    snakeBody = [{ x: 0, y: 0 }];
    direction = { x: 1, y: 0 };
    currentScore = 0;
    updateScores();
    placeFood();
    gameArea.addEventListener('click', startGame);
    gameArea.style.cursor = 'pointer';
}

placeFood();
