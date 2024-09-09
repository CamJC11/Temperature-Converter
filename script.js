const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust for pixel density
const scale = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * scale;
canvas.height = canvas.clientHeight * scale;
ctx.scale(scale, scale);

// Snake settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let snakeLength = 1;
let food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Update score and high score
document.getElementById('highScore').textContent = highScore;

function update() {
    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Snake collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    snake.unshift(head);
    
    // Snake eating food
    if (head.x === food.x && head.y === food.y) {
        snakeLength++;
        score++;
        document.getElementById('score').textContent = score;
        placeFood();
    }
    
    // Keep snake size
    if (snake.length > snakeLength) {
        snake.pop();
    }

    // Draw everything
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach(segment => {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });
    
    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

function placeFood() {
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
}

function resetGame() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
    
    snake = [{ x: 10, y: 10 }];
    snakeLength = 1;
    score = 0;
    document.getElementById('score').textContent = score;
    direction = { x: 0, y: 0 };
}

// Mobile swipe controls
let startX, startY;
document.addEventListener('touchstart', function(e) {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
});

document.addEventListener('touchmove', function(e) {
    if (!startX || !startY) return;

    const touch = e.touches[0];
    const diffX = touch.clientX - startX;
    const diffY = touch.clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction.x === 0) direction = { x: 1, y: 0 }; // Swipe right
        else if (diffX < 0 && direction.x === 0) direction = { x: -1, y: 0 }; // Swipe left
    } else {
        if (diffY > 0 && direction.y === 0) direction = { x: 0, y: 1 }; // Swipe down
        else if (diffY < 0 && direction.y === 0) direction = { x: 0, y: -1 }; // Swipe up
    }
    startX = null;
    startY = null;
});

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

placeFood();
gameLoop();
