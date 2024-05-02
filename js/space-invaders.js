"use strict"

// Global Variables for Game Settings
const globalContainer = document.querySelector(".game-sandbox");
const scoreAndTimeContainer = document.createElement("div");
const scoreElement = document.createElement("h3");
scoreElement.id = "scoreCount";

// Player Global Settings
let score = 0;
const playerSpeed = 4;
const bulletSpeed = 2;

// Enemy Global Settings
const stepSize = 10;
const dropSize = 20;
const enemyBulletSpeed = 8;
const enemyMoveInterval = 1000;
let currentDirection = 'right';
let currentLeft = 100;

class Player {
    constructor(container) {
        this.container = container;
        this.player = new Image();
        this.player.id = "player";
        this.player.src = "../assets/space-invaders/enemy-game.png";
        this.container.appendChild(this.player);
    }

    shootBullet() {
        const shootSound = new Audio('../assets/space-invaders/player-shoot.mp3');
        const playerStyle = window.getComputedStyle(this.player);
        const playerLeft = parseInt(playerStyle.left);
        const playerBottom = parseInt(playerStyle.bottom);
    
        // Create bullet and calculate proper placement
        const bullet = document.createElement("div");
        bullet.className = "bullet";
        bullet.style.left = (playerLeft + this.player.clientWidth / 2) + "px";
        bullet.style.bottom = (playerBottom + 20) + "px";
    
        globalContainer.appendChild(bullet);
        shootSound.play();
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

    startShooting(minDelay, maxDelay) {
        const shootInterval = () => {
            if (document.querySelectorAll('.enemy').length > 0) {
                this.shootBullet();
                setTimeout(shootInterval, Math.random() * (maxDelay - minDelay) + minDelay);
            } else {
                this.stopShooting();
            }
        };
        this.shootingInterval = setTimeout(shootInterval, Math.random() * (maxDelay - minDelay) + minDelay);
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
        }, 40);
    }


    stopShooting() {
        clearTimeout(this.shootingInterval);
    }
}

function checkPlayerCollisions() {
    const bullets = document.querySelectorAll(".enemy-bullet");
    const player = document.getElementById("player");
    const playerRect = player.getBoundingClientRect();

    bullets.forEach(bullet => {
        const bulletRect = bullet.getBoundingClientRect();

        if (bulletRect.left < playerRect.right &&
            bulletRect.right > playerRect.left &&
            bulletRect.top < playerRect.bottom &&
            bulletRect.bottom > playerRect.top) {
            if (player.parentNode) {
                player.parentNode.removeChild(player);
                gameOverScreen();
            }
        }
    });
}

function checkEnemyCollisions() {
    const bullets = document.querySelectorAll(".bullet");
    const enemies = document.querySelectorAll(".enemy");

    bullets.forEach(bullet => {
        const bulletRect = bullet.getBoundingClientRect();
        let bulletRemoved = false;

        enemies.forEach(enemy => {
            if (bulletRemoved) return;
            const enemyRect = enemy.getBoundingClientRect();

            if (bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top) {

                if (enemy.parentNode) {
                    enemy.parentNode.removeChild(enemy);
                    updateScore();
                }
                if (bullet.parentNode) {
                    bullet.parentNode.removeChild(bullet);
                }
                bulletRemoved = true;
            }
        });
    });
}

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

function spawnEnemies(numEnemies, numEnemiesPerRow) {
    const enemyContainer = document.createElement("div");
    enemyContainer.id = "enemyContainer";

    for (let i = 0; i < numEnemiesPerRow; i++) {
        const enemyRow = document.createElement("div");
        for (let j = 0; j < numEnemies; j++) {
            const enemyObj = new Enemy(enemyRow);
            enemyRow.appendChild(enemyObj.enemy);
            enemyObj.startShooting(2000,15000);
        }
        enemyContainer.appendChild(enemyRow);
    }
    globalContainer.appendChild(enemyContainer);

    const globalWidth = globalContainer.clientWidth;
    const enemyWidth = enemyContainer.clientWidth;
    
    currentLeft = (globalWidth - enemyWidth) / 2;
    enemyContainer.style.left = currentLeft + "px";
}

function clearScreen(){
    while(globalContainer.firstChild)
        globalContainer.firstChild.remove();
}

function winScreen(){
    const winScreen = document.createElement("div");
    const winTitle = document.createElement("h2");
    winTitle.id = "win-title";
    winTitle.innerHTML = "You Win!"

    clearScreen();

    winScreen.appendChild(winTitle);
    globalContainer.appendChild(winScreen);
}


function gameOverScreen(){
    const gameOverScreen = document.createElement("div");
    const gameOver = document.createElement("h2");
    gameOver.id = "game-over";
    gameOver.innerHTML = "Game Over!";

    const restartButton = document.createElement("button");
    restartButton.id = "restartGame";
    restartButton.innerHTML = "Restart Game";

    clearScreen();

    gameOverScreen.appendChild(gameOver);
    gameOverScreen.appendChild(restartButton);
    globalContainer.appendChild(gameOverScreen);
    
    restartButton.addEventListener("click", function(e){
        gameOverScreen.remove();
        startGame();
    });

}

function startTime(){
    let time = 0;
    const timeElement = document.createElement("h3");
    timeElement.id = "timeCount";
    timeElement.textContent = "Time: 00:00"
    
    let intervalClear = setInterval(() => {
        if(document.querySelectorAll('.enemy').length === 0){
            clearInterval(intervalClear);
            timeElement.remove();
            return;
        }
        
        time++;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        timeElement.textContent = "Time: " + minutes + ":" + seconds;
        
    }, 1000);
    scoreAndTimeContainer.appendChild(timeElement);
}

function initializeScore(){
    score = 0;
    scoreElement.textContent = "Score: " + score;
    scoreAndTimeContainer.appendChild(scoreElement);
}

function updateScore(){
    score += 10;
    const scoreElement = document.getElementById("scoreCount");
    scoreElement.textContent = "Score: " + score;
}

function removeStartScreen(){
    const startScreen = document.getElementById("start-screen");
    startScreen.classList.add("disappear");
    startGame();
}

function startGame(){
    globalContainer.appendChild(scoreAndTimeContainer);
    const player = new Player(globalContainer);

    let moveLeft = false;
    let moveRight = false;
    let canShoot = true;

    startTime();
    initializeScore();
    spawnEnemies(10, 4);
    
    // Event Listeners added to keep track of player actions (Left, Right, and Space)
    document.addEventListener('keydown', (event) => {
        if(event.key === 'ArrowLeft')
            moveLeft = true;
        if(event.key === 'ArrowRight')
            moveRight = true;
        if(event.key === " " && canShoot){
            player.shootBullet();
            canShoot = false;
            setTimeout(()=>{
                canShoot = true;
            },1000);
        }
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
        checkPlayerCollisions();
        checkEnemyCollisions();
        requestAnimationFrame(movementControl);
    }

    movementControl();
}
setInterval(moveEnemies, enemyMoveInterval);