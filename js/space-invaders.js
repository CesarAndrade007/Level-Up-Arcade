"use strict"
const globalContainer = document.querySelector(".game-sandbox");
const playerSpeed = 2;
const bulletSpeed = 1;

class Player {
    constructor(container) {
        this.container = container;
        this.player = new Image();
        this.player.id = "player";
        this.player.src = "../assets/space-invaders/enemy-game.png";
        this.container.appendChild(this.player);
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
}

function shootBullet() {
    // Capture player dimensions
    const player = document.getElementById("player");
    const playerStyle = window.getComputedStyle(player);
    const playerLeft = parseInt(playerStyle.left);
    const playerBottom = parseInt(playerStyle.bottom);

    // Create bullet and calculate proper placement
    const bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.style.left = (playerLeft + player.clientWidth / 2) + "px";
    bullet.style.bottom = (playerBottom + 20) + "px";

    globalContainer.appendChild(bullet);
    
}


function spawnEnemies(numEnemies, numEnemiesPerRow){
    const enemyContainer = document.createElement("div");
    enemyContainer.id = "enemyContainer";

    for(let i = 0; i < numEnemiesPerRow; i++){
        const enemyRow = document.createElement("div");
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
    startScreen.classList.add("disappear");
    
    const container = document.querySelector('.game-sandbox');
    const player = new Player(container);

    initializeScore();
    spawnEnemies(9, 3);

    let moveLeft = false;
    let moveRight = false;
    
    // Event Listeners added to keep track of player actions (Left, Right, and Space)
    document.addEventListener('keydown', (event) => {
        if(event.key === 'ArrowLeft')
            moveLeft = true;
        if(event.key === 'ArrowRight')
            moveRight = true;
        if(event.key === " ")
            shootBullet();
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






