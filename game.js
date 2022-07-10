const player = (name) => {
  
  const _moves = [];
  
  const getName = () => name;
  const getMoves = id => _moves[id];

  const play = pos => {
    _moves[pos] = 1;
  }

  return {play, getName, getMoves};
};

const gameBoard = (() => {
  
  let _board = [];
  let _currentPlayer = 'X';
  let _gameOver = 0;

  const clearBoard = () => {
    _board = [];
    _gameOver = 0;
    displayControl.clearDisplay();
    _currentPlayer = 'X';
  }

  const _checkWin = e => {
    for (let i of e.classList) {
      if (!['cell','X','O'].includes(i)) {
        const cellChain = document.querySelectorAll(`.${i}.${_currentPlayer}`);
        if (cellChain.length === 3) {
          displayControl.win(cellChain,_currentPlayer);
          _gameOver = 1;
          return true;
        }
        if (_board.length === 9 && !_board.includes(undefined)) {
          displayControl.draw(_currentPlayer);
          _gameOver = 1;
          return true;
        }
      }
    }
  }

  const playerPlay = pos => {
    if (!_gameOver) {
      const cell = document.getElementById(`cell${pos}`);
      if (!_board[pos]) {
        _board[pos] = player;
        displayControl.markCell(cell,_currentPlayer);
        if (_checkWin(cell)) return;
        _changePlayer();
      }
    }
  };

  const _changePlayer = () => {
    _currentPlayer = (_currentPlayer === 'X') ? 'O' : 'X';
    displayControl.changePlayerDisplay();
  }

  return {playerPlay, clearBoard};
})();

const displayControl = (() => {

  const markCell = (cell, player) => {
    const image = document.createElement('img');
    image.src = (player == 'X') ? 'images/close-thick.svg' : 'images/circle-outline.svg';
    image.alt = player;
    cell.classList.add(player);
    cell.appendChild(image);
  }

  const _clearAllCells = () => {
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(e => {
      e.classList.remove("X","O","win");
      e.innerHTML = "";
    });
  }

  const clearDisplay = () => {
    _clearAllCells();

    const message = document.getElementById('message');
    message.textContent = '';

    const restartButton = document.getElementById('restart');
    restartButton.style.display = '';

    _togglePlayerTurnDisplay('#player-X > div > *');
    const playerImages = document.querySelectorAll('.player > img');
    playerImages.forEach(e => e.src = "images/player.jpg");
  }

  const win = (cellChain, player) => {
    for (let i of cellChain) {
      i.classList.add('win');
      i.firstChild.src = (player === 'X') ? 'images/close-thick-win.svg' : 'images/circle-outline-win.svg';
    }
    const message = document.getElementById('message');
    message.textContent = (player === 'X') ? 'Player 1 wins!' : 'Player 2 wins!';

    const restartButton = document.getElementById('restart');
    restartButton.style.display = 'block';

    const playerImage = document.querySelector(`#player-${player} > img`);
    playerImage.src = "images/player-win.jpg";
    _togglePlayerTurnDisplay(`#player-${player} > div > *`);
  }
  
  const draw = (player) => {
    const message = document.getElementById('message');
    message.textContent = "It's a draw!";

    const restartButton = document.getElementById('restart');
    restartButton.style.display = 'block';

    _togglePlayerTurnDisplay(`#player-${player} > div > *`);
  }

  const _toggleHidden = (e) => {
    if (e.classList.contains("hidden")) e.classList.remove("hidden");
    else e.classList.add("hidden");
  }

  const _togglePlayerTurnDisplay = selector => {
    const playerTurnDisplays = document.querySelectorAll(selector);
    playerTurnDisplays.forEach(e => _toggleHidden(e));
  }

  const changePlayerDisplay = () => {
    _togglePlayerTurnDisplay(".player-turn > *");
  }

    return {markCell, clearDisplay, win, draw, changePlayerDisplay};
})();

Object.assign(gameBoard, displayControl);

const allCells = document.querySelectorAll('.cell');

allCells.forEach(e => {
  const pos = parseInt(e.getAttribute('id').slice(-1));
  e.addEventListener('click', () => gameBoard.playerPlay(pos));
})

const restartButton = document.getElementById('restart');

restartButton.addEventListener('click', () => gameBoard.clearBoard());