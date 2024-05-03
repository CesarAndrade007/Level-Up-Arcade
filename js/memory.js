
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
********************************************************************/

const globalContainer = document.querySelector(".game-sandbox");
let cardState = ["", "", "", "", "", ""];
let state = [1,2,3];
let templateState = [1, 1, 2, 2, 3, 3];
let flippedCards = [];

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

function displayMatch(){
    const displayContainer = document.createElement("div");
    const matchDisplay = document.createElement("h1");
    matchDisplay.id = "match-title";
    matchDisplay.innerHTML = "Match :D";

    displayContainer.appendChild(matchDisplay);
    globalContainer.appendChild(displayContainer);

    setTimeout(() => {
        globalContainer.removeChild(displayContainer);
    }, 1000);
}

function displayNoMatch(){
    const displayContainer = document.createElement("div");
    const noMatchDisplay = document.createElement("h1");
    noMatchDisplay.id = "nomatch-title";
    noMatchDisplay.innerHTML = "No Match :("

    displayContainer.appendChild(noMatchDisplay);
    globalContainer.appendChild(displayContainer);

    setTimeout(() => {
        globalContainer.removeChild(displayContainer);
    }, 1000);
}

function createCardImage(card, image) {
    let cardBack = card.querySelector(".game-card-back");
    if (cardBack) {
        let cardImage = document.createElement("img");
        cardImage.src = `../assets/memory/${image}`;
        cardImage.className = "game-card-image";
        cardBack.appendChild(cardImage);
    }
}

function createCard(idx){
    let id = 0;
    let card = document.createElement("div");
    let cardSides = document.createElement("div");
    let cardFront = document.createElement("div");
    let cardBack = document.createElement("div");

    card.className = "game-card";
    cardSides.className = "game-card-inner";
    cardFront.className = "game-card-front";
    cardBack.className = "game-card-back";

    card.appendChild(cardSides);
    cardSides.appendChild(cardFront);
    cardSides.appendChild(cardBack);

    switch(cardState[idx]) {
        case 1:
            createCardImage(card, 'triangle-card.png', state[0]);
            id = state[0];
            break;
        case 2:
            createCardImage(card, 'rectangle-card.png', state[1]);
            id = state[1];
            break;
        case 3:
            createCardImage(card, 'circle-card.png', state[2]);
            id = state[2];
            break;
        default:
            break;
    }

    cardSides.addEventListener("click", function() {
        if (!cardSides.classList.contains("matched-card") && flippedCards.length < 2) {
            cardSides.classList.toggle("flip-over");
            matchCheck(id, cardSides);
        }
    });
    return card;
}

function matchCheck(id, element){
    let allMatched = false;
    flippedCards.push({id, element});
    if (flippedCards.length === 2) {
        if (flippedCards[0].id === flippedCards[1].id) {
            displayMatch();
            flippedCards[0].element.classList.add("matched-card");
            flippedCards[1].element.classList.add("matched-card");
            flippedCards = [];
        } else {
            displayNoMatch();
            setTimeout(function() {
                flippedCards[0].element.classList.remove("flip-over");
                flippedCards[1].element.classList.remove("flip-over");
                flippedCards = [];
            }, 1000);
        }
    }
    allMatched = checkAllMatchedCards();
    if(allMatched)
        playAgain();
}

function checkAllMatchedCards(){
    const cards = document.querySelectorAll(".game-card-inner");
    for(let card of cards){
        if(!card.classList.contains("matched-card"))
            return false;
    }
    return true;
}

function loadCardGrid(){
    const cardGrid = document.createElement("div");
    cardGrid.id = "card-grid";
    for(let i = 0; i < cardState.length; i++){
        let card = createCard(i);
        cardGrid.appendChild(card);
    }
    globalContainer.appendChild(cardGrid);
}

function clearScreen(){
    while(globalContainer.firstChild)
        globalContainer.firstChild.remove();
}


function playAgain(){
    const playAgain = document.createElement("button");
    playAgain.id = "play-again";
    playAgain.innerHTML = "Play Again!";
    globalContainer.appendChild(playAgain);
    playAgain.addEventListener("click", function() {
        clearScreen();
        startGame();
    });
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
        startGame();
    }, 1000);
}