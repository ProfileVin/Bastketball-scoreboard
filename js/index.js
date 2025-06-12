/* setup */

const buttons = {
  home: Array.from({ length: 3 }, (_, i) =>
    document.getElementById(`home${i + 1}`)
  ),
  guest: Array.from({ length: 3 }, (_, i) =>
    document.getElementById(`guest${i + 1}`)
  ),
};

// Ball elements
const balls = {
  home: document.getElementById("home-ball"),
  guest: document.getElementById("guest-ball"),
};

// Score elements
const scores = {
  home: document.getElementById("home-score"),
  guest: document.getElementById("guest-score"),
};

const fouls = {
  home: document.getElementById("foul-home-el"),
  guest: document.getElementById("foul-guest-el"),
};

const clocks = {
  game: document.getElementById("time-clock"),
  shot: document.getElementById("shot-clock"),
};

// Period box element
const periodBoxEl = document.getElementById("period-box");

const foulButtons = [
  document.getElementById("foul-home"),
  document.getElementById("foul-guest"),
];

// Points array to hold the values for each button
const points = [1, 2, 3];

// Initialize total scores
let totalScores = { home: 0, guest: 0 };

// Initialize foul counts
let foulCounts = { home: 0, guest: 0 };

let isHomeBall = true;
let currentGamePeriod = 1; // Initialize current period
let isGameStarted = false; // Flag to check if the game has started

let shotClockInterval, gameTimeInterval;

const shotClockDuration = 24;
const gameIntervalPerPeriod = 720;

/* setup */

// Function to update score

const isGameOver = () => currentGamePeriod === 4 || !isGameStarted;

const updateScore = (isHome, points) => {
  console.log(isGameOver());
  if (isGameOver()) return;

  const team = isHome ? "home" : "guest";
  // Check if the points are valid (1, 2, or 3)
  totalScores[team] += points;
  scores[team].textContent = formatNumber(totalScores[team]);

  currentBallHandler(isHome);
  toggleScoreBoxBorder();
};

const updateFoul = (isHome) => {
  if (isGameOver()) return;

  const team = isHome ? "home" : "guest";

  foulCounts[team]++;
  fouls[team].textContent = formatNumber(foulCounts[team]);
  currentBallHandler(isHome);
};

const toggleScoreBoxBorder = () => {
  const isHomeLeading = totalScores.home > totalScores.guest;
  scores.home.classList.toggle("active", isHomeLeading);
  scores.guest.classList.toggle("active", !isHomeLeading);
};

// Function to start the shot clock
function startShotClock() {
  // Shot clock duration in seconds
  let timeRemaining = shotClockDuration;
  clearInterval(shotClockInterval);
  updateShotClockDisplay(timeRemaining);

  shotClockInterval = setInterval(() => {
    if (currentGamePeriod == 4 || isCurrentGamePeriodEnded) {
      clearInterval(shotClockInterval);
      resetShotClock();
      return;
    }

    timeRemaining--;
    updateShotClockDisplay(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(shotClockInterval);
      currentBallHandler(isHomeBall);
    }
  }, 1000);
}

function gameStartHandler() {
  if (!isGameStarted) return; // Prevent multiple intervals from being set

  let gameTimeRemaining = gameIntervalPerPeriod;
  gameTimeInterval = setInterval(() => {
    if (gameTimeRemaining <= 0) {
      clearInterval(gameTimeInterval);
      isGameStarted = false;
      gamePeriodEnded();
      updateGameClockDisplay(0); // Display 0 when time is up
      return;
    }

    gameTimeRemaining--;
    updateGameClockDisplay(gameTimeRemaining);
  }, 1000);
}

let isCurrentGamePeriodEnded = false;
function gamePeriodEnded() {
  currentGamePeriod++;
  isCurrentGamePeriodEnded = true;
  periodBoxEl.textContent = `${String(currentGamePeriod).padStart(2, "0")}`;
}

function updateGameClockDisplay(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Format the time as MM:SS
  const formattedTime = [
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
  // Format the time as MM:SS
  clocks.game.textContent = formattedTime;
}

function updateShotClockDisplay(timeRemaining) {
  const seconds = timeRemaining % 60;
  clocks.shot.textContent = `${String(seconds).padStart(2, "0")}`;
}

function currentBallHandler(isHome) {



  isCurrentGamePeriodEnded = false; // Reset the flag for the current game period
  if (currentGamePeriod != 4) {
    isHomeBall = !isHome; // Update the current ball possession
    startShotClock();

    if (!isGameStarted) {
      isGameStarted = true; // Set the game as started
      gameStartHandler(); // Start the game clock
    }

    const homeClass = isHome ? "img-bnw" : "img-colored";
    const guestClass = isHome ? "img-colored" : "img-bnw";

    balls.home.classList.add(homeClass);
    balls.guest.classList.add(guestClass);

    balls.home.classList.remove(guestClass);
    balls.guest.classList.remove(homeClass);
  }
}

balls.home.addEventListener("click", () => {
  currentBallHandler(false); // Home team has the ball
});

balls.guest.addEventListener("click", () => {
  currentBallHandler(true); // Guest team has the ball
});

function formatNumber(num) {
  return num.toString().padStart(2, "0");
}

// Adding event listeners for home buttons
buttons.home.forEach((button, index) => {
  button.addEventListener("click", () => updateScore(true, points[index]));
});

// Adding event listeners for guest buttons
buttons.guest.forEach((button, index) => {
  button.addEventListener("click", () => updateScore(false, points[index]));
});

foulButtons.forEach((button, index) => {
  let isHome = index === 0; // true for home, false for guest
  button.addEventListener("click", () => updateFoul(isHome));
});

newGame();

function newGame() {
  // Reset scores and fouls
  totalScores.home = 0;
  totalScores.guest = 0;
  foulCounts.home = 0;
  foulCounts.guest = 0;

  // Update score elements

  scores.home.textContent = formatNumber(totalScores.home);
  scores.guest.textContent = formatNumber(totalScores.guest);
  fouls.home.textContent = formatNumber(foulCounts.home);
  fouls.guest.textContent = formatNumber(foulCounts.guest);
  scores.home.classList.toggle("active", false);
  scores.guest.classList.toggle("active", false);

  // Reset period
  currentGamePeriod = 1;
  periodBoxEl.textContent = `${String(currentGamePeriod).padStart(2, "0")}`;

  // Reset game clock and shot clock
  updateGameClockDisplay(720); // 12 minutes in seconds
  updateShotClockDisplay(24);

  // Reset ball possession
  isHomeBall = true; // Home team starts with the ball

  resetBalls();

  // Clear intervals
  clearInterval(gameTimeInterval);
  clearInterval(shotClockInterval);

  isGameStarted = false; // Reset game started flag
}

const resetShotClock = () => {
  clocks.shot.textContent = "00";
  resetBalls();
};

function resetBalls() {
  balls.home.classList.add("img-bnw");
  balls.guest.classList.add("img-bnw");
}
