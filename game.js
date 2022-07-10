/* Player factory */

const player = (name) => {
  const getName = () => name;
  return {getName};
};

/* Gameboard object to control game flow */

const gameBoard = (() => {
  
  let _board = [];
  let _currentPlayer = 'X';
  let _gameOver = 0;
  const _players = {};

  // Define players and changes the display to start of the game
  const startGame = () => {
    const playerXName = document.getElementById('player-X-name-input').value || 'Player 1';
    const playerOName = document.getElementById('player-O-name-input').value || 'Player 2';
    _players.X = player(playerXName);
    _players.O = player(playerOName);
    displayControl.startGame(playerXName,playerOName);
  }

  // Resets all states to start of the game
  const clearBoard = () => {
    _board = [];
    _gameOver = 0;
    displayControl.clearDisplay();
    _currentPlayer = 'X';
  }

  // Check win condition: set of three cells with the same class signifying a winning triplet has been marked by the same player
  const _checkWin = cell => {
    for (let i of cell.classList) {
      if (!['cell','X','O'].includes(i)) {
        const cellChain = document.querySelectorAll(`.${i}.${_currentPlayer}`);
        if (cellChain.length === 3) {
          displayControl.win(cellChain,_currentPlayer,_players[_currentPlayer].getName());
          _gameOver = 1;
          return true;
        }
        // If all cells are filled and nobody won, draw condition is triggered
        if (_board.length === 9 && !_board.includes(undefined)) {
          displayControl.draw(_currentPlayer);
          _gameOver = 1;
          return true;
        }
      }
    }
  }

  // Plays on a cell and changes the player
  const playerPlay = pos => {
    if (!_gameOver) {
      const cell = document.getElementById(`cell${pos}`);
      if (!_board[pos]) {
        _board[pos] = player;
        displayControl.markCell(cell,_currentPlayer);
        if (_checkWin(cell)) return; // If win or draw, _checkWin returns true, and function exits
        _changePlayer();
      }
    }
  };

  const _changePlayer = () => {
    _currentPlayer = (_currentPlayer === 'X') ? 'O' : 'X';
    displayControl.changePlayerDisplay();
  }

  return {playerPlay, clearBoard, startGame};
})();

/* Methods to control the display */

const displayControl = (() => {

  // Adds X or O to a cell
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

    _toggleMultipleDisplays('#player-X > div > *');
    const playerImages = document.querySelectorAll('.player > img');
    playerImages.forEach(e => e.src = "images/player.jpg");
  }

  // Prepares display elements for win condition
  const win = (cellChain, player, name) => {
    for (let i of cellChain) {
      i.classList.add('win');
      i.firstChild.src = (player === 'X') ? 'images/close-thick-win.svg' : 'images/circle-outline-win.svg';
    }
    const message = document.getElementById('message');
    message.textContent = `${name} wins!`;

    const restartButton = document.getElementById('restart');
    restartButton.style.display = 'block';

    const playerImage = document.querySelector(`#player-${player} > img`);
    playerImage.src = "images/player-win.jpg";
    _toggleMultipleDisplays(`#player-${player} > div > *`);
  }
  
  // Prepares display elements for draw condition
  const draw = (player) => {
    const message = document.getElementById('message');
    message.textContent = "It's a draw!";

    const restartButton = document.getElementById('restart');
    restartButton.style.display = 'block';

    _toggleMultipleDisplays(`#player-${player} > div > *`);
  }

  const _toggleHidden = (e) => {
    if (e.classList.contains("hidden")) e.classList.remove("hidden");
    else e.classList.add("hidden");
  }

  const _toggleMultipleDisplays = selector => {
    const playerTurnDisplays = document.querySelectorAll(selector);
    playerTurnDisplays.forEach(e => _toggleHidden(e));
  }

  // Toggle arrow and turn displays when changing players
  const changePlayerDisplay = () => {
    _toggleMultipleDisplays(".player-turn > *");
  }

  // Change display to show start of game
  const startGame = (playerXName,playerOName) => {
    _toggleMultipleDisplays('.pre-game, .game');
    document.getElementById('player-X-name').textContent = playerXName;
    document.getElementById('player-O-name').textContent = playerOName;
  }

    return {markCell, clearDisplay, win, draw, changePlayerDisplay, startGame};
})();

/* Event selectors */

// Clicking on the gameboard
const allCells = document.querySelectorAll('.cell');

allCells.forEach(e => {
  const pos = parseInt(e.getAttribute('id').slice(-1));
  e.addEventListener('click', () => gameBoard.playerPlay(pos));
})

// Restart and start buttons
const restartButton = document.getElementById('restart');
restartButton.addEventListener('click', () => gameBoard.clearBoard());

const startButton = document.getElementById('start-game');
startButton.addEventListener('click', () => gameBoard.startGame());