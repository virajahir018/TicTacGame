const board = document.getElementById("board");
const statusText = document.getElementById("status");

let cells = Array(9).fill("");
let gameActive = true;

const human = "X";
const ai = "O";

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function createBoard() {
  board.innerHTML = "";

  cells.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (val) cell.classList.add(val.toLowerCase());
    cell.innerText = val;

    cell.addEventListener("click", () => handleClick(i));

    board.appendChild(cell);
  });
}

function handleClick(i) {
  if (!gameActive || cells[i]) return;

  cells[i] = human;
  createBoard();

  if (checkWinner(cells, human)) {
    statusText.innerText = "You Win";
    gameActive = false;
    return;
  }

  if (!cells.includes("")) {
    statusText.innerText = "Draw";
    return;
  }

  statusText.innerText = "Thinking...";

  setTimeout(() => {
    let bestMove = minimax(cells, ai).index;
    cells[bestMove] = ai;

    createBoard();

    if (checkWinner(cells, ai)) {
      statusText.innerText = "Computer Wins";
      gameActive = false;
      return;
    }

    if (!cells.includes("")) {
      statusText.innerText = "Draw";
      return;
    }

    statusText.innerText = "Player X Turn";
  }, 300);
}

function minimax(newBoard, player) {
  let emptySpots = newBoard
    .map((v, i) => (v === "" ? i : null))
    .filter(v => v !== null);

  if (checkWinner(newBoard, human)) return { score: -10 };
  if (checkWinner(newBoard, ai)) return { score: 10 };
  if (emptySpots.length === 0) return { score: 0 };

  let moves = [];

  for (let i of emptySpots) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    if (player === ai) {
      let result = minimax(newBoard, human);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, ai);
      move.score = result.score;
    }

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;

  if (player === ai) {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWinner(boardState, player) {
  for (let pattern of winPatterns) {
    let [a,b,c] = pattern;

    if (
      boardState[a] === player &&
      boardState[b] === player &&
      boardState[c] === player
    ) {
      highlightWinner(pattern);
      return true;
    }
  }
  return false;
}

function resetGame() {
  cells = Array(9).fill("");
  gameActive = true;
  statusText.innerText = "Player X Turn";
  createBoard();
}

function highlightWinner(pattern) {
  let all = document.querySelectorAll(".cell");
  pattern.forEach(i => {
    all[i].classList.add("winner");
  });
}

createBoard();