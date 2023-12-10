document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.memory-card');
  const gameInstructions = document.getElementById('game-instructions');
  const tryAgainBtn = document.getElementById('tryAgainButton');
  const resultMessage = document.getElementById('resultMessage');
  const scoreDisplay = document.getElementById('score');

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let tries = 0;
  let matchedPairs = 0;
  let score = 0;

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
    } else {
      hasFlippedCard = false;
      secondCard = this;
      checkForMatch();
      tries++;
      updateTriesCounter();

      if (matchedPairs === 4) {
        displayResultMessage('You win!');
        endGame();
      } else if (tries === 3) {
        displayResultMessage('You lose! Try again.');
        endGame();
      }
    }
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    if (isMatch) {
      disableCards();
      matchedPairs++;
      updateScore();
    } else {
      lockBoard = true;
      setTimeout(() => {
        unflipCards();
        lockBoard = false;
      }, 1000);
    }
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
  }

  function unflipCards() {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function updateTriesCounter() {
    gameInstructions.innerText = `Match the cards to win. You have ${3 - tries} tries remaining.`;
  }

  function updateScore() {
    score++;
    scoreDisplay.innerText = `Score: ${score}`;
  }

  function displayResultMessage(message) {
    resultMessage.innerText = message;
    resultMessage.style.display = 'block';
    tryAgainBtn.style.display = 'block';
  }

  function endGame() {
    cards.forEach(card => card.removeEventListener('click', flipCard));
  }

  function resetGame() {
    cards.forEach(card => {
      card.classList.remove('flip');
      card.addEventListener('click', flipCard);
    });
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    tries = 0;
    matchedPairs = 0;
    score = 0;
    scoreDisplay.innerText = 'Score: 0';
    updateTriesCounter();
    resultMessage.style.display = 'none';
    tryAgainBtn.style.display = 'none';
    shuffleCards();
  }

  function shuffleCards() {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 8);
      card.style.order = randomPos;
    });
  }

  tryAgainBtn.addEventListener('click', resetGame);
  cards.forEach(card => card.addEventListener('click', flipCard));
  shuffleCards();
});
