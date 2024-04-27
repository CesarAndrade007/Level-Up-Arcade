"use strict"
const globalContainer = document.querySelector(".game-sandbox");

function generateMissles(){

}

function missleRate(){

}

function spawnEnemies(){
    let numEnemies = 4;
    let numEnemiesPerRow = 2;
    const enemyContainer = document.createElement("div");
    enemyContainer.id = "enemyContainer";

    for(let i = 0; i < numEnemiesPerRow; i++){
        const enemyRow = document.createElement("div");
        for(let j = 0; j < numEnemies; j++){
            const enemy = document.createElement("img");
            enemy.id = "enemy";
            enemy.src = "../assets/space-invaders/enemy-game.png";
            enemyRow.appendChild(enemy);
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
    initializeScore();
    spawnEnemies();
}

function restartGame(){

}



