const cardContainer = docment.createElement("div");

function removeStartScreen(){
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('fadeout');
    
    setTimeout(function() {
        startScreen.style.display = 'none';
    }, 1000);

    startGame();
}

function loadCards(){
    
}

function matchCheck(){

}

function startGame(){
    
}