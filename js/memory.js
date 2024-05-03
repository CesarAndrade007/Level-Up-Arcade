
"use strict"
/********************************************************************
    cardState Array -> Provides identifiers for the cards.
    templateState Array -> Provides shuffled identifiers into cardState.
                           Ensures that we have total of three matches
                           per game.

    States include:
    1 - Triangle
    2 - Rectangle
    3 - Circle

    The cardState is updated everytime the user presses the restart
    game button. If the player successfully chooses cards that are of
    the same identifier, then we count it as a match.
*******************************************************************/

const globalContainer = document.querySelector(".game-sandbox");
let cardState = ["", "", "", "", "", ""];
let templateState = [1, 1, 2, 2, 3, 3];

function shuffleElements(templateState){
    for(let i = templateState.length -1; i > 0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [templateState[i], templateState[j]] = [templateState[j], templateState[i]];
    }
}

function loadCardState(){
    shuffleElements(templateState);
    for(let i = 0; i < cardState.length; i++){
        cardState[i] = templateState[i];
    }
}

function createCardImage(card, imageUrl) {
    let cardBack = card.querySelector(".game-card-back");

    if (cardBack) {
        let cardImage = document.createElement("img");
        cardImage.src = `../assets/memory/${imageUrl}`;
        cardImage.className = "game-card-image";
        cardBack.appendChild(cardImage);
    }
}

function createCard(){
    let card = document.createElement("div");
    card.className = "game-card";

    let cardSides = document.createElement("div");
    cardSides.className = "game-card-inner";
    card.appendChild(cardSides);

    let cardFront = document.createElement("div");
    cardFront.className = "game-card-front";
    cardSides.appendChild(cardFront);

    let cardBack = document.createElement("div");
    cardBack.className = "game-card-back";
    cardSides.appendChild(cardBack);

    return card;
}

function loadCardGrid(){
    const cardGrid = document.createElement("div");
    cardGrid.id = "card-grid";

    for(let i = 0; i < cardState.length; i++){
        let card = createCard();
        switch(cardState[i]) {
            case 1:
                createCardImage(card, 'triangle-card.png');
                break;
            case 2:
                createCardImage(card, 'rectangle-card.png');
                break;
            case 3:
                createCardImage(card, 'circle-card.png');
                break;
            default:
                break;
        }
        cardGrid.appendChild(card);
    }
    globalContainer.appendChild(cardGrid);
}


function matchCheck(){

}

function startGame(){
    loadCardState();
    loadCardGrid();
}



function removeStartScreen(){
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('fadeout');
    
    setTimeout(function() {
        startScreen.style.display = 'none';
    }, 2000);

    startGame();
}