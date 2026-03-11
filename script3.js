const cardGrid = document.querySelector('.card-grid');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');
const victoryOverlay = document.getElementById('victory');
const timeoutOverlay = document.getElementById('timeout');
const finalTimeDisplay = document.getElementById('finalTime');

let cardsArray = ['🍎', '🍌', '🍓', '🍇', '🍉', '🍒', '🍑', '🥝'];
let flippedCards = [];
let matchedCards = [];
let timer;
let countdownTimer;
let totalTime;
let secondsElapsed = 0;
let isGameStarted = false;

function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back" data-value="${value}" style="--card-color: ${randomColor()}">${value}</div>
        </div>
    `;
    card.addEventListener('click', () => flipCard(card, value));
    return card;
}

function initializeGame() {
    clearInterval(timer);
    clearInterval(countdownTimer);
    cardGrid.innerHTML = '';
    flippedCards = [];
    matchedCards = [];
    isGameStarted = false;
    secondsElapsed = 0;
    timerDisplay.textContent = "Time Left: 00:00";
    victoryOverlay.classList.add('hidden');
    timeoutOverlay.classList.add('hidden');

    setTimeLimit();
    let pairs = difficultySelect.value === 'easy' ? 4 : difficultySelect.value === 'medium' ? 6 : 8;

    let selectedCards = shuffle(cardsArray).slice(0, pairs);
    cards = [...selectedCards, ...selectedCards];
    shuffle(cards).forEach(value => {
        const card = createCard(value);
        cardGrid.appendChild(card);
    });
}

function setTimeLimit() {
    totalTime = difficultySelect.value === 'easy' ? 60 : difficultySelect.value === 'medium' ? 90 : 120;
    countdownTimer = setInterval(() => {
        totalTime--;
        updateTimerDisplay();
        if (totalTime <= 0) {
            endGame(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `Time Left: ${String(Math.floor(totalTime / 60)).padStart(2, '0')}:${String(totalTime % 60).padStart(2, '0')}`;
}

function randomColor() {
    const colors = ['#FF6384', '#FFCD56', '#36A2EB', '#9966FF', '#4BC0C0', '#FF9F40', '#FF6384', '#36A2EB'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function flipCard(card, value) {
    if (!isGameStarted) {
        isGameStarted = true;
    }

    if (flippedCards.length < 2 && !card.classList.contains('flip') && !matchedCards.includes(card)) {
        card.classList.add('flip');
        flippedCards.push({ card, value });

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.value === card2.value) {
        matchedCards.push(card1.card, card2.card);
        flippedCards = [];

        if (matchedCards.length === cards.length) {
            endGame(true);
        }
    } else {
        setTimeout(() => {
            card1.card.classList.remove('flip');
            card2.card.classList.remove('flip');
            flippedCards = [];
        }, 800);
    }
}

function endGame(won) {
    clearInterval(countdownTimer);
    if (won) {
        finalTimeDisplay.textContent = timerDisplay.textContent.split(': ')[1];
        victoryOverlay.classList.remove('hidden');
    } else {
        timeoutOverlay.classList.remove('hidden');
    }
}

restartButton.addEventListener('click', initializeGame);
difficultySelect.addEventListener('change', initializeGame);

// Initialize game on load
initializeGame();
