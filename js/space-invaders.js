"use strict"

// Global Variables for Game Settings
const globalContainer = document.querySelector(".game-sandbox");
const scoreAndTimeContainer = document.createElement("div");
const scoreElement = document.createElement("h3");
scoreElement.id = "scoreCount";

// Player Global Settings
let score = 0;
const playerSpeed = 4;
const bulletSpeed = 6;

// Enemy Global Settings
const stepSize = 10;
const dropSize = 20;
const enemyBulletSpeed = 6;
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
        this.canShoot = true;
    }

    // The following method is responsible for the player's shooting capabilities
    shootBullet() {
        if(!this.canShoot) return;

        const shootSound = new Audio('../assets/space-invaders/player-shoot.mp3');
        const playerStyle = window.getComputedStyle(this.player);
        const playerLeft = parseInt(playerStyle.left);
        const playerBottom = parseInt(playerStyle.bottom);
    
        // Create bullet and calculate proper placement
        const bullet = document.createElement("div");
        bullet.className = "bullet";
        bullet.style.left = (playerLeft + this.player.clientWidth / 2) + "px";
        bullet.style.bottom = (playerBottom + 20) + "px";
    
        this.container.appendChild(bullet);
        shootSound.play();

        this.canShoot = false;
        setTimeout(() => {
            this.canShoot = true;
        }, 1000);
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

    // The following method is responsible for the enemy's shooting frequency
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

    // The following method is responsible for creating the bullet and calculating proper placement
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

    // Clear Intervals
    stopShooting() {
        clearTimeout(this.shootingInterval);
    }
}


// The following function checks for player collision with enemy bullets.
// Upon getting hit, the game over screen will appear for the user.
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

// The following function checks for enemy collision with player bullets.
// The function also checks if all enemies currently exist in the game, if
// not, then the win screen will appear.
function checkEnemyCollisions() {
    const bullets = document.querySelectorAll(".bullet");
    const enemies = document.querySelectorAll(".enemy");

    bullets.forEach(bullet => {
        const bulletRect = bullet.getBoundingClientRect();
        let bulletRemoved = false;

        enemies.forEach(enemy => {
            if (bulletRemoved) return;
            const enemyRect = enemy.getBoundingClientRect();
            const enemyParent = enemy.parentNode;

            if (bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top) {

                enemyParent.removeChild(enemy);
                updateScore();

                if (enemyParent.children.length === 0) {
                    enemyParent.parentNode.removeChild(enemyParent);
                }

                bullet.parentNode.removeChild(bullet);
                bulletRemoved = true;

                if (!document.querySelector(".enemy")) {
                    winScreen();
                }
            }
        });
    });
}


// The following function is responsible for enemy movement on the screen.
// The function was designed to have the enemies move from right to left.
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


// The following function generates enemies onto the screen upon
// the user pressing the Start Game button.
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

// Function that gets called when player kills all enemies
// Displays "You Win!" followed by a button to play again.
function winScreen(){
    const winScreen = document.createElement("div");
    const winTitle = document.createElement("h2");
    const playAgain = document.createElement("button");

    winTitle.id = "win-title";
    winTitle.innerHTML = "You Win!";
    playAgain.id = "playAgain";
    playAgain.innerHTML = "Play Again";

    clearScreen();

    winScreen.appendChild(winTitle);
    winScreen.appendChild(playAgain);
    globalContainer.appendChild(winScreen);
    
    playAgain.addEventListener("click", function(e){
        winScreen.remove();
        startGame();
    });
}

// Function that gets called when player dies
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

// Function responsible for timer functionalities
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

// Initializes player's score
function initializeScore(){
    score = 0;
    scoreElement.textContent = "Score: " + score;
    scoreAndTimeContainer.appendChild(scoreElement);
}

// This function is called whenever a player shoots and enemy.
function updateScore(){
    score += 10;
    const scoreElement = document.getElementById("scoreCount");
    scoreElement.textContent = "Score: " + score;
}

// This function is called when the player dies or kills all enemies.
function removeStartScreen(){
    const startScreen = document.getElementById("start-screen");
    startScreen.classList.add("disappear");
    startGame();
}

// Mobile controls loaded for screen sizes that are 768px and below.
function loadMobileControls(moveFlags, player){
    const controlContainer = document.createElement("div");
    const rightArrow = document.createElement("button");
    const leftArrow = document.createElement("button");
    const spaceBar = document.createElement("button");

    controlContainer.id = "control-container";
    rightArrow.id = "right-arrow";
    leftArrow.id = "left-arrow";
    spaceBar.id = "space-bar";

    rightArrow.innerHTML = ">>";
    leftArrow.innerHTML = "<<";
    spaceBar.innerHTML = "Space";

    controlContainer.appendChild(leftArrow);
    controlContainer.appendChild(spaceBar);
    controlContainer.appendChild(rightArrow);
    globalContainer.appendChild(controlContainer);

    leftArrow.addEventListener("touchstart", () => moveFlags.moveLeft = true);
    leftArrow.addEventListener("touchend", () => moveFlags.moveLeft = false);
    rightArrow.addEventListener("touchstart", () => moveFlags.moveRight = true);
    rightArrow.addEventListener("touchend", () => moveFlags.moveRight = false);
    spaceBar.addEventListener("touchstart", () => player.shootBullet());
}

function startGame(){
    globalContainer.appendChild(scoreAndTimeContainer);
    const player = new Player(globalContainer);
    const moveFlags = {moveLeft: false, moveRight: false};
    
    loadMobileControls(moveFlags,player);
    startTime();
    initializeScore();
    spawnEnemies(10, 4);
    
    // Event Listeners added to keep track of player actions (Left, Right, and Space)
    document.addEventListener('keydown', (event) => {
        if(event.key === 'ArrowLeft')
            moveFlags.moveLeft = true;
        if(event.key === 'ArrowRight')
            moveFlags.moveRight = true;
        if(event.key === " "){
            player.shootBullet();
        }
    });
    document.addEventListener('keyup', (event) => {
        if(event.key === 'ArrowLeft')
            moveFlags.moveLeft = false;
        if(event.key === 'ArrowRight')
            moveFlags.moveRight = false;
    });

    // Perform actions based on player keybinds
    function movementControl() {
        const player = document.getElementById("player");
        const bullets = document.querySelectorAll(".bullet");
        
        const style = window.getComputedStyle(player);
        const left = parseInt(style.left);
        
        if (moveFlags.moveLeft && left > 0) 
            player.style.left = (left - playerSpeed) + "px";
        
        if (moveFlags.moveRight && (left + player.clientWidth < globalContainer.clientWidth)) 
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