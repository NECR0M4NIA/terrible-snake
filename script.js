const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 20;
const tileCount = 20;
canvas.width = tileSize * tileCount;
canvas.height = tileSize * tileCount;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let apple = getRandomApplePosition();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let temps = 200;

document.getElementById("high-score").textContent = highScore;

document.addEventListener("keydown", changeDirection);

function addTime() {
    temps -= 50;
}

function removeTime() {
    temps += 50;
}

function gameLoop() {
    if (isGameOver()) {
        document.getElementById("gameOver").classList.remove("hidden");
        return;
    }

    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawApple();
        gameLoop();
    }, temps);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    snake.unshift(newHead);

    if (newHead.x === apple.x && newHead.y === apple.y) {
        score++;
        document.getElementById("score").textContent = score;
        apple = getRandomApplePosition();
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("high-score").textContent = highScore;
        }
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach((part, index) => {
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    });
}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);
}

function changeDirection(event) {
    const keyPressed = event.key.toLowerCase();
    const directions = {
        z: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        q: { x: -1, y: 0 },
        d: { x: 1, y: 0 }
    };

    if (directions[keyPressed]) {
        const newDirection = directions[keyPressed];
        if (!(newDirection.x === -direction.x && newDirection.y === -direction.y)) {
            direction = newDirection;
        }
    }
}

function getRandomApplePosition() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(part => part.x === position.x && part.y === position.y));
    return position;
}

function isGameOver() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    );
}

function restartGame() {
    score = 0;
    document.getElementById("score").textContent = score;
    direction = { x: 0, y: 0 };
    snake = [{ x: 10, y: 10 }];
    apple = getRandomApplePosition();
    document.getElementById("gameOver").classList.add("hidden");
    gameLoop();
}

gameLoop();
