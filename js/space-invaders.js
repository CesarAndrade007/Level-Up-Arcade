"use strict"

// Global Variables for Game Settings
const globalContainer = document.querySelector(".game-sandbox");

// Player Global Settings
const playerSpeed = 2;
const bulletSpeed = 4;

// Enemy Global Settings
const stepSize = 10;
const dropSize = 20;
const enemyBulletSpeed = 10;
const enemyMoveInterval = 500;

class Player {
    constructor(container) {
        this.container = container;
        this.player = new Image();
        this.player.id = "player";
        this.player.src = "../assets/space-invaders/enemy-game.png";
        this.container.appendChild(this.player);
    }

    shootBullet() {
        // Capture player dimensions
        const player = document.getElementById("player");
        const playerStyle = window.getComputedStyle(player);
        const playerLeft = parseInt(playerStyle.left);
        const playerBottom = parseInt(playerStyle.bottom);
    
        // Create bullet and calculate proper placement
        const bullet = document.createElement("div");
        bullet.className = "bullet";
        bullet.style.left = (playerLeft + this.player.clientWidth / 2) + "px";
        bullet.style.bottom = (playerBottom + 20) + "px";
    
        globalContainer.appendChild(bullet);
    }
}

class Enemy {
    constructor(container){
        this.container = container;
        this.enemy = new Image();
        this.enemy.className = "enemy";
        this.enemy.src = "../assets/space-invaders/alien.png";
        this.container.appendChild(this.enemy);
    }

    shootBullet() {
        const bullet = document.createElement("div");
        bullet.className = "enemy-bullet";

        // Calculate bullet placement
        bullet.style.left = (this.enemy.offsetLeft + this.enemy.offsetWidth / 2) + "px";
        bullet.style.top = (this.enemy.offsetTop + this.enemy.offsetHeight) + "px";
        globalContainer.appendChild(bullet);

        // Controls bullet downward movement
        const bulletInterval = setInterval(() => {
            const currentTop = parseInt(bullet.style.top);
            bullet.style.top = (currentTop + enemyBulletSpeed) + "px";
            if (currentTop > globalContainer.clientHeight) {
                clearInterval(bulletInterval);
                bullet.remove();
            }
        }, 20);
    }

    //
    startShooting() {
        const minDelay = 2000;
        const maxDelay = 5000;

        const shootInterval = () => {
            this.shootBullet();
            setTimeout(shootInterval, Math.random() * (maxDelay - minDelay) + minDelay);
        };
        setTimeout(shootInterval, Math.random() * (maxDelay - minDelay) + minDelay);
    }
}


function checkCollisions() {
    const bullets = document.querySelectorAll(".bullet");
    const container = document.getElementById('enemyContainer');
    const enemies = document.querySelectorAll(".enemy");

    bullets.forEach(bullet => {
        const bulletRect = bullet.getBoundingClientRect();

        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();

            // Check if the bullet intersects with the enemy
            if (bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top) {
                // Collision detected, remove the enemy and the bullet
            }
        });
    });
}

let currentDirection = 'right';
let currentLeft = 0;

function moveEnemies() {
    const enemyContainer = document.getElementById("enemyContainer");
    const globalWidth = globalContainer.clientWidth;
    const enemyWidth = enemyContainer.clientWidth;

    if (currentDirection === 'right') {
        currentLeft += stepSize;
        if (currentLeft + enemyWidth >= globalWidth) {
            currentDirection = 'left';
            currentLeft = globalWidth - enemyWidth;
        }
    } else {
        currentLeft -= stepSize;
        if (currentLeft <= 0) {
            currentDirection = 'right';
            currentLeft = 0;
        }
    }
    enemyContainer.style.left = currentLeft + "px";
}
setInterval(moveEnemies, enemyMoveInterval);


function spawnEnemies(numEnemies, numEnemiesPerRow) {
    const enemyContainer = document.createElement("div");
    enemyContainer.id = "enemyContainer";

    for (let i = 0; i < numEnemiesPerRow; i++) {
        const enemyRow = document.createElement("div");
        for (let j = 0; j < numEnemies; j++) {
            const enemyObj = new Enemy(enemyRow);
            enemyRow.appendChild(enemyObj.enemy);
            enemyObj.startShooting();
        }
        enemyContainer.appendChild(enemyRow);
    }
    globalContainer.appendChild(enemyContainer);
}

function initializeScore(){
    let score = 0;
    const scoreElement = document.createElement("h3");
    scoreElement.id = "scoreCount";
    scoreElement.textContent = "Score: " + score;
    globalContainer.appendChild(scoreElement);
}

function startGame(){
    const startScreen = document.getElementById("game-block");
    startScreen.classList.add("disappear");
    const player = new Player(globalContainer);
    let moveLeft = false;
    let moveRight = false;

    initializeScore();
    spawnEnemies(10, 3);
    
    // Event Listeners added to keep track of player actions (Left, Right, and Space)
    document.addEventListener('keydown', (event) => {
        if(event.key === 'ArrowLeft')
            moveLeft = true;
        if(event.key === 'ArrowRight')
            moveRight = true;
        if(event.key === " ")
            player.shootBullet();
    });
    document.addEventListener('keyup', (event) => {
        if(event.key === 'ArrowLeft')
            moveLeft = false;
        if(event.key === 'ArrowRight')
            moveRight = false;
    });
    
    // Perform actions based on player keybinds
    function movementControl() {
        const player = document.getElementById("player");
        const bullets = document.querySelectorAll(".bullet");
        
        const style = window.getComputedStyle(player);
        const left = parseInt(style.left);
        
        if (moveLeft && left > 0) 
            player.style.left = (left - playerSpeed) + "px";
        
        if (moveRight && (left + player.clientWidth < globalContainer.clientWidth)) 
            player.style.left = (left + playerSpeed) + "px";
        
        bullets.forEach((bullet) => {
            const bottom = parseInt(bullet.style.bottom);
            bullet.style.bottom = (bottom + bulletSpeed) + "px";
    
            if (bottom > globalContainer.clientHeight) {
                bullet.remove();
            }
        });

        checkCollisions();
        requestAnimationFrame(movementControl);
    }
    movementControl();
}

function restartGame(){
    initializeScore();
    spawnEnemies(9, 3);
}