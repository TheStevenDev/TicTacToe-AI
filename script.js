// Rappresentazione del tabellone
let board = ['', '', '', '', '', '', '', '', ''];

// Mappatura degli indici delle celle HTML alle posizioni nel tabellone
const cellIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Mappa delle possibili combinazioni di vittoria
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // righe
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonne
  [0, 4, 8], [2, 4, 6] // diagonali
];

// Elementi DOM
const cells = Array.from(document.getElementsByClassName('cell'));
const status = document.getElementById('status');

// Funzione per pulire il tabellone
function clearBoard() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.innerText = '';
    cell.addEventListener('click', handleHumanTurn);
  });
}

// Funzione per gestire il turno del giocatore umano
function handleHumanTurn(event) {
  const cell = event.target;
  const index = cells.indexOf(cell);

  if (board[index] === '') {
    board[index] = 'X';
    cell.innerText = 'X';

    if (checkWin('X')) {
      status.innerText = 'Hai vinto!';
      cells.forEach(cell => cell.removeEventListener('click', handleHumanTurn));
      return;
    }

    if (checkTie()) {
      status.innerText = 'Pareggio!';
      cells.forEach(cell => cell.removeEventListener('click', handleHumanTurn));
      return;
    }

    handleBotTurn();
  }
}

// Funzione per gestire il turno del bot
function handleBotTurn() {
  const bestMove = minimax(board, 'O').index;
  const cell = cells[bestMove];

  board[bestMove] = 'O';
  cell.innerText = 'O';

  if (checkWin('O')) {
    status.innerText = 'Il bot ha vinto!';
    cells.forEach(cell => cell.removeEventListener('click', handleHumanTurn));
    return;
  }

  if (checkTie()) {
    status.innerText = 'Pareggio!';
    cells.forEach(cell => cell.removeEventListener('click', handleHumanTurn));
    return;
  }
}

// Funzione che valuta lo stato del tabellone
function evaluate(board) {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] === board[b] && board[a] === board[c]) {
      if (board[a] === 'O') {
        return 1;
      } else if (board[a] === 'X') {
        return -1;
      }
    }
  }

  return 0;
}

// Funzione per controllare se il tabellone è completo
function checkTie() {
  return board.every(cell => cell !== '');
}

// Funzione per generare tutte le mosse possibili
function generateMoves(board) {
  const moves = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      moves.push(i);
    }
  }

  return moves;
}

// Funzione ricorsiva per l'algoritmo Minimax
function minimax(board, player) {
  const availableMoves = generateMoves(board);

  // Controllo delle condizioni di terminazione
  if (checkWin('X')) {
    return { score: -1 };
  } else if (checkWin('O')) {
    return { score: 1 };
  } else if (availableMoves.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availableMoves.length; i++) {
    const move = {};
    move.index = availableMoves[i];

    board[availableMoves[i]] = player;

    if (player === 'O') {
      const result = minimax(board, 'X');
      move.score = result.score;
    } else {
      const result = minimax(board, 'O');
      move.score = result.score;
    }

    board[availableMoves[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

// Funzione per controllare se un giocatore ha vinto
function checkWin(player) {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }

  return false;
}

// Inizializzazione del gioco
clearBoard();
