"use strict"

// Global Variables for Game Settings
const globalContainer = document.querySelector(".game-sandbox");
const playerSpeed = 2;
const bulletSpeed = 1;
const stepSize = 10;
const dropSize = 20;
const enemyMoveInterval = 400;

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

    enemyShootBullet(){
        const enemyStyle = window.getComputedStyle(this.enemy); // Get the style of the current enemy
        const bullet = document.createElement("div");
        bullet.className = "enemy-bullet";

        bullet.style.left = enemyStyle.left;
        bullet.style.top = (parseInt(enemyStyle.top) + this.enemy.clientHeight) + "px";
        globalContainer.appendChild(bullet);
    
        const bulletInterval = setInterval(() => {
            const currentTop = parseInt(bullet.style.top);
            bullet.style.top = (currentTop + bulletSpeed) + "px";
    
            if (currentTop > globalContainer.clientHeight) {
                clearInterval(bulletInterval);
                globalContainer.removeChild(bullet);
            }
        }, 30);
    }
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
            enemyContainer.style.top = (parseInt(enemyContainer.style.top || 0) + dropSize) + "px";
        }
    } else {
        currentLeft -= stepSize;
        if (currentLeft <= 0) {
            currentDirection = 'right';
            currentLeft = 0;
            enemyContainer.style.top = (parseInt(enemyContainer.style.top || 0) + dropSize) + "px";
        }
    }
    enemyContainer.style.left = currentLeft + "px";
}
setInterval(moveEnemies, enemyMoveInterval);


function spawnEnemies(numEnemies, numEnemiesPerRow){
    const enemyContainer = document.createElement("div");
    enemyContainer.id = "enemyContainer";

    for(let i = 0; i < numEnemiesPerRow; i++){
        const enemyRow = document.createElement("div");
        enemyRow.id = "enemyRow";
        for(let j = 0; j < numEnemies; j++){
            const enemyObj = new Enemy(enemyRow);
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
    const container = document.querySelector('.game-sandbox');
    startScreen.classList.add("disappear");
    const player = new Player(container);
    let moveLeft = false;
    let moveRight = false;

    initializeScore();
    spawnEnemies(9, 3);
    
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
    
        requestAnimationFrame(movementControl);
    }
    movementControl();
}

function restartGame(){

}