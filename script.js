// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sprite properties
const sprite = {
    x: 10,
    y: 10,
    width: 25,
    height: 25,
    color: 'blue',
    speed: 2
};

// Array to store enemies
const enemies = [];

// Key state
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

let dead = false;

// Event listeners for key presses
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.up = true;
            break;
        case 's':
            keys.down = true;
            break;
        case 'a':
            keys.left = true;
            break;
        case 'd':
            keys.right = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.up = false;
            break;
        case 's':
            keys.down = false;
            break;
        case 'a':
            keys.left = false;
            break;
        case 'd':
            keys.right = false;
            break;
    }
});

// Function to spawn a new enemy
function spawnEnemy() {
    const newEnemy = {
        x: Math.random() * (canvas.width - 25),
        y: Math.random() * (canvas.height - 25),
        width: 25,
        height: 25,
        color: 'red',
        speed: 1.5 + enemies.length * 0.1, // Increase speed for each new enemy
        direction: Math.random() * Math.PI * 2 // Random initial direction in radians
    };
    enemies.push(newEnemy);
    sprite.speed += 0.5; // Increase sprite speed
}

// Game loop
function gameLoop() {
    update();
    draw();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

// Update sprite and enemy positions
function update() {
    // Update sprite position based on key inputs
    if (keys.up && sprite.y > 0) {
        sprite.y -= sprite.speed;
    }
    if (keys.down && sprite.y < canvas.height - sprite.height) {
        sprite.y += sprite.speed;
    }
    if (keys.left && sprite.x > 0) {
        sprite.x -= sprite.speed;
    }
    if (keys.right && sprite.x < canvas.width - sprite.width) {
        sprite.x += sprite.speed;
    }

    // Update enemies positions to move in a random direction and bounce off walls
    enemies.forEach(enemy => {
        // Move enemy
        enemy.x += enemy.speed * Math.cos(enemy.direction);
        enemy.y += enemy.speed * Math.sin(enemy.direction);

        // Check and handle collision with walls
        if (enemy.x < 0) {
            enemy.x = 0;
            enemy.direction = Math.atan2(Math.sin(enemy.direction), Math.cos(enemy.direction + Math.PI)); // Reflect horizontally
        } else if (enemy.x + enemy.width > canvas.width) {
            enemy.x = canvas.width - enemy.width;
            enemy.direction = Math.atan2(Math.sin(enemy.direction), Math.cos(enemy.direction + Math.PI)); // Reflect horizontally
        }
        if (enemy.y < 0) {
            enemy.y = 0;
            enemy.direction = Math.atan2(Math.sin(enemy.direction + Math.PI), Math.cos(enemy.direction)); // Reflect vertically
        } else if (enemy.y + enemy.height > canvas.height) {
            enemy.y = canvas.height - enemy.height;
            enemy.direction = Math.atan2(Math.sin(enemy.direction + Math.PI), Math.cos(enemy.direction)); // Reflect vertically
        }
    });
}

// Draw the sprite and enemies
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the sprite
    ctx.fillStyle = sprite.color;
    ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);

    // Draw the enemies
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Check for collision and handle game over
function checkCollision() {
    enemies.forEach(enemy => {
        if (
            sprite.x < enemy.x + enemy.width &&
            sprite.x + sprite.width > enemy.x &&
            sprite.y < enemy.y + enemy.height &&
            sprite.y + sprite.height > enemy.y
        ) {
            gameOver();
        }
    });
}

// Game over function
function gameOver() {
    dead = true;
    sprite.x = 10;
    sprite.y = 10;
    enemies.length = 0; // Clear enemies array
    sprite.speed = 2; // Reset sprite speed
}

// Start the game loop
gameLoop();

// Spawn a new enemy every 10 seconds
setInterval(spawnEnemy, 10000);
