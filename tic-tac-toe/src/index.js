const playingField = document.getElementById("playing-field");

Array(playingField).forEach((field) => {
  field.addEventListener("click", playRound);
});

let currentPlayer = "X";
const fieldArray = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function playRound(e) {
  if (e.target.classList.contains("X")) {
    return;
  } else if (e.target.classList.contains("O")) {
    return;
  } else {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (currentPlayer === "X") {
      e.target.setAttribute("class", "X");
      fieldArray[row][column] = currentPlayer;
      checkWin();
      currentPlayer = "O";
    } else {
      e.target.setAttribute("class", "O");
      fieldArray[row][column] = currentPlayer;
      checkWin();
      currentPlayer = "X";
    }
  }
}

function checkWin() {
  if (
    (fieldArray[0][0] === currentPlayer &&
      fieldArray[0][1] === currentPlayer &&
      fieldArray[0][2] === currentPlayer) ||
    (fieldArray[1][0] === currentPlayer &&
      fieldArray[1][1] === currentPlayer &&
      fieldArray[1][2] === currentPlayer) ||
    (fieldArray[2][0] === currentPlayer &&
      fieldArray[2][1] === currentPlayer &&
      fieldArray[2][2] === currentPlayer) ||
    (fieldArray[0][0] === currentPlayer &&
      fieldArray[1][0] === currentPlayer &&
      fieldArray[2][0] === currentPlayer) ||
    (fieldArray[0][1] === currentPlayer &&
      fieldArray[1][1] === currentPlayer &&
      fieldArray[2][1] === currentPlayer) ||
    (fieldArray[0][2] === currentPlayer &&
      fieldArray[1][2] === currentPlayer &&
      fieldArray[2][2] === currentPlayer) ||
    (fieldArray[0][0] === currentPlayer &&
      fieldArray[1][1] === currentPlayer &&
      fieldArray[2][2] === currentPlayer) ||
    (fieldArray[0][2] === currentPlayer &&
      fieldArray[1][1] === currentPlayer &&
      fieldArray[2][0] === currentPlayer)
  ) {
    Array(playingField).forEach((field) => {
      field.removeEventListener("click", playRound);
    });

    const notification = document.createElement("div");
    notification.innerText = `${currentPlayer} WINS!`;
    notification.style.fontSize = "3em";
    const reset = document.createElement("button");
    reset.innerText = "RESET";
    reset.addEventListener("click", () => location.reload());
    document.getElementsByTagName("body")[0].appendChild(notification);
    document.getElementsByTagName("body")[0].appendChild(reset);
  }
}
