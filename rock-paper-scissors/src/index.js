const playerBar = document.getElementById("player-bar");
const aiBar = document.getElementById("ai-bar");
const playerScore = document.getElementById("player-score");
const aiScore = document.getElementById("ai-score");
const playerRock = document.getElementById("rock");
const playerPaper = document.getElementById("paper");
const playerScissors = document.getElementById("scissors");
const notification = document.getElementById("notification");
const resetButton = document.getElementById("reset-button");

playerRock.addEventListener("click", playRound);
playerPaper.addEventListener("click", playRound);
playerScissors.addEventListener("click", playRound);
resetButton.addEventListener("click", () => window.location.reload());

let currentPlayerScore = 0;
let currentAiScore = 0;
let prevPlayerScore = 0;
let prevAiScore = 0;

function playRound(e) {
  e.preventDefault();
  console.log(e.currentTarget);
  console.log(e.currentTarget.dataset[e.currentTarget.id]);

  const RPS = { rock: 0, paper: 1, scissors: 2 };
  let playerChoice = RPS[e.currentTarget.id];
  let aiChoice = Math.floor(Math.random() * 3);

  switch (true) {
    case playerChoice === aiChoice:
      notification.innerText = `It's a TIE!`;
      break;
    case playerChoice === 0 && aiChoice === 2:
    case playerChoice === 1 && aiChoice === 0:
    case playerChoice === 2 && aiChoice === 1:
      currentPlayerScore++;
      notification.innerText = `You won!`;
      break;
    default:
      currentAiScore++;
      notification.innerText = `You lost.`;
      break;
  }

  updateBar();
  checkResults();

  playerScore.innerText = currentPlayerScore;
  aiScore.innerText = currentAiScore;
}

function updateBar() {
  if (currentPlayerScore > prevPlayerScore) {
    switch (currentPlayerScore) {
      case 1:
        playerBar.style.backgroundPosition = "20%";
        break;
      case 2:
        playerBar.style.backgroundPosition = "40%";
        break;
      case 3:
        playerBar.style.backgroundPosition = "60%";
        break;
      case 4:
        playerBar.style.backgroundPosition = "80%";
        break;
      case 5:
        playerBar.style.backgroundPosition = "100%";
        break;
    }
  }

  if (currentAiScore > prevAiScore) {
    switch (currentAiScore) {
      case 1:
        aiBar.style.backgroundPosition = "-20%";
        break;
      case 2:
        aiBar.style.backgroundPosition = "-40%";
        break;
      case 3:
        aiBar.style.backgroundPosition = "-60%";
        break;
      case 4:
        aiBar.style.backgroundPosition = "-80%";
        break;
      case 5:
        aiBar.style.backgroundPosition = "-100%";
        break;
    }
  }
}

function checkResults() {
  switch (true) {
    case currentPlayerScore === 5:
      notification.innerText = `Congratulations!`;
      document.getElementById("buttons").style.display = "none";
      document.getElementById("reset").style.display = "flex";
      break;
    case currentAiScore === 5:
      notification.innerText = `Congratulations... not!`;
      document.getElementById("buttons").style.display = "none";
      document.getElementById("reset").style.display = "flex";
      break;
  }
}
