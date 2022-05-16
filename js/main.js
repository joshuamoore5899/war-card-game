//Example fetch using pokemonapi.co

//create new deck and save deck_id from API to variable
let deckId = '';
let player1Num = null;
let player2Num = null;
let player1Flips = 0;
let player2Flips = 0;
let player1Score = 0;
let player2Score = 0;

fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  .then(res => res.json())
  .then(data => {
    console.log(data)
    deckId = data.deck_id;
  })
  .catch(err => {
      console.log(`error ${err}`)
  });

document.querySelector('#reset').addEventListener('click', reset);

function reset() {
  deckId = '';
  player1Num = null;
  player2Num = null;
  player1Flips = 0;
  player2Flips = 0;
  player1Score = 0;
  player2Score = 0;

  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      deckId = data.deck_id;
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

    document.querySelector('#player1Score').innerText = player1Score;
    document.querySelector('#player2Score').innerText = player2Score;
    document.querySelector('#player1Image').src = "";
    document.querySelector('#player2Image').src = "";
}



document.querySelector('#player1Button').addEventListener('click', flipCard1);
document.querySelector('#player2Button').addEventListener('click', flipCard2);

async function flipCard1() {

  if (player1Flips > player2Flips) {
    return;
  }

  let flipURL = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`

  console.log(flipURL)
  await fetch(flipURL)
    .then(res => res.json())
    .then(data => {
      console.log(data.cards[0])
      document.querySelector('#player1Image').src = data.cards[0].image;
      player1Num = convertToNum(data.cards[0].value);
      console.log('1 Score: ' + player1Num);
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

    player1Flips++;
    checkWinner();
}

async function flipCard2() {

  if (player2Flips > player1Flips) {
    return;
  }

  let flipURL = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`

    await fetch(flipURL)
    .then(res => res.json())
    .then(data => {
      console.log(data.cards[0])
      document.querySelector('#player2Image').src = data.cards[0].image;
      player2Num = convertToNum(data.cards[0].value);
      console.log('2 Score: ' + player2Num);
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

    player2Flips++;
    checkWinner();
}

function checkWinner() {
  if (player1Flips != player2Flips) {
    return;
  }
  else {
    console.log('player1Num: ' + player1Num);
    console.log('player2Num: ' + player2Num);
    if (player1Num > player2Num) {
      player1Score += 2;
    }
    else if (player1Num < player2Num) {
      player2Score += 2;
    }
    else {
      player2Score += 2;
    }
  }

  document.querySelector('#player1Score').innerText = player1Score;
  document.querySelector('#player2Score').innerText = player2Score;

  if (player1Score + player2Score === 52) {
    gameOver();
  }
}

function gameOver() {
  let winner = '';
  if (player1Score > player2Score) {
    winner = 'Player 1';
  }
  else {
    winner = 'Player 2';
  }
  document.querySelector('#war').innerText = `${winner} wins!!!`;
  document.querySelector('#player1Button').classList.add('hidden');
  document.querySelector('#player2Button').classList.add('hidden');
}



function convertToNum(str) {
  if (str === "ACE") {
    return 14;
  }
  else if (str === "KING") {
    return 13;
  }
  else if (str === "QUEEN") {
    return 12;
  }
  else if (str === "JACK") {
    return 11;
  }
  else {
    return Number(str);
  }
}
