//Example fetch using pokemonapi.co

//create new deck and save deck_id from API to variable
let deckId = '';
let player1Num = null;
let player2Num = null;
let player1Flips = 0;
let player2Flips = 0;
let player1Score = 0;
let player2Score = 0;
let warCheck = false;
let warCount = 0;
let totalCards = 52;

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
document.querySelector('#war').addEventListener('click', warGame);

function reset() {
  deckId = '';
  player1Num = null;
  player2Num = null;
  player1Flips = 0;
  player2Flips = 0;
  player1Score = 0;
  player2Score = 0;
  warCheck = false;
  warCount = 0;
  totalCards = 52;

  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      deckId = data.deck_id;
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

    document.querySelector('#winner').innerText = ""
    document.querySelector('#player1Score').innerText = player1Score;
    document.querySelector('#player2Score').innerText = player2Score;
    document.querySelector('#player1Image').src = "";
    document.querySelector('#player2Image').src = "";
    document.querySelector('#war').classList.add('hidden');
    document.querySelector('#war').innerText = "";
    document.querySelector('#player1Button').classList.remove('hidden');
    document.querySelector('#player2Button').classList.remove('hidden');
}



document.querySelector('#player1Button').addEventListener('click', flipCard1);
document.querySelector('#player2Button').addEventListener('click', flipCard2);

async function flipCard1() {
  console.log('In flipCard1');
  if (warCheck === false) {
    document.querySelector('#winner').innerText = "";
    document.querySelector('#player1War').innerText = "";
    document.querySelector('#player2War').innerText = "";
  }

  if (warCheck === true) {
    return;
  }

  warCheck = false;

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
    await checkWinner();
}

async function flipCardWar1() {
  console.log('In flipCardWar1');
  warCount = 0;
  let flipURL = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  await fetch(flipURL)
    .then(res => res.json())
    .then(data => {
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
    player1Flips += 2;
    // await flipCard1();
}

async function flipCardWar2() {
  console.log('In flipCardWar2');
  warCount = 0;
  let flipURL = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  await fetch(flipURL)
    .then(res => res.json())
    .then(data => {
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
    player2Flips += 2;
    // await flipCard2();
}

async function flipCard2() {
  console.log('In flipCard2');
  if (warCheck === false) {
    document.querySelector('#winner').innerText = "";
    document.querySelector('#player1War').innerText = "";
    document.querySelector('#player2War').innerText = "";
  }

  if (warCheck === true) {
    return;
  }

  warCheck = false;

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
    await checkWinner();
}

async function checkWinner() {
  console.log('In checkWinner');
  if (player1Flips != player2Flips) {
    return;
  }
  else {
    console.log('player1Num: ' + player1Num);
    console.log('player2Num: ' + player2Num);
    if (player1Num > player2Num) {
      player1Score += 2;
      totalCards -= 2;
    }
    else if (player1Num < player2Num) {
      totalCards -= 2;
      player2Score += 2;
    }
    else {
      if (totalCards > 8) {
        await war();
        warCount = 0;
      }
      else {
        document.querySelector('#winner').innerText = 'Not enough cards left for war. Nobody wins these cards. Keep going...';
        totalCards -= 2;
      }

    }
    console.log('TotalCards = ' + totalCards)
  }

  document.querySelector('#player1Score').innerText = player1Score;
  document.querySelector('#player2Score').innerText = player2Score;

  if (totalCards === 0) {
    await gameOver();
  }
}

async function warGame() {
  console.log('In warGame');
  if (warCount < 1) {
    let flipURL = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

      await fetch(flipURL)
      .then(res => res.json())
      .then(data => {
        document.querySelector('#player1Image').src = data.cards[0].image;
        player1Num = convertToNum(data.cards[0].value);
        document.querySelector('#player2Image').src = data.cards[1].image;
        player2Num = convertToNum(data.cards[1].value);
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
      if (player1Num > player2Num) {
        player1Score += 8;
        totalCards -= 8;
      }
      else if (player1Num < player2Num) {
        player2Score += 8;
        totalCards -= 8;
      }
      else {
        document.querySelector('#winner').innerText = 'It\'s a tie. Nobody wins these cards. Keep going...';
      }
      document.querySelector('#player1Score').innerText = player1Score;
      document.querySelector('#player2Score').innerText = player2Score;
    }
    warCount++;
    document.querySelector('#war').classList.add('hidden');
    warCheck = false;
    document.querySelector('#player1War').innerText = "";
    document.querySelector('#player2War').innerText = "";
}

async function war() {
  console.log('In war');
  warCheck = true;
  document.querySelector('#war').classList.remove('hidden');
  document.querySelector('#war').innerText = 'Time for war!'
  document.querySelector('#player1War').innerText = `1 2`;
  document.querySelector('#player2War').innerText = `1 2`;
  await flipCardWar1();
  await flipCardWar2();
}

function gameOver() {
  console.log('In gameOver');
  let winner = '';
  if (player1Score > player2Score) {
    winner = 'Player 1';
  }
  else if (player1Score < player2Score) {
    winner = 'Player 2';
  }
  else {
    winner = 'Nobody';
  }
  document.querySelector('#winner').innerText = `${winner} wins!!!`;
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
