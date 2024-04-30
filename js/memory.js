function startGame(){
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('fadeout');
    
    setTimeout(function() {
        startScreen.style.display = 'none';
    }, 1000);
}