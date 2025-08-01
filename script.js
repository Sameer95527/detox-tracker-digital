let startTime, timerInterval, coinsEarned = 0;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const coinsDisplay = document.getElementById("coins");
const lastSessionDisplay = document.getElementById("lastSession");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const quoteBox = document.getElementById("quoteBox");
const leaderboardBody = document.getElementById("leaderboardBody");
const toggleLeaderboardBtn = document.getElementById("toggleLeaderboardBtn");

const quotes = [
  "Stay focused. You can do this!",
  "Every minute counts. Keep going!",
  "Your mind is your best asset.",
  "Less scrolling, more living.",
  "Discipline is your superpower."
];

function updateTimer() {
  const now = Date.now();
  const elapsed = now - startTime;
  const hours = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
  timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBox.textContent = quote;
}

function formatDuration(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

startBtn.addEventListener("click", () => {
  if (isRunning) return;
  isRunning = true;
  coinsEarned = 0;
  coinsDisplay.textContent = "0";
  timerDisplay.textContent = "00:00:00";
  startTime = Date.now();
  showRandomQuote();
  startBtn.disabled = true;
  stopBtn.disabled = false;

  timerInterval = setInterval(() => {
    updateTimer();
    coinsEarned = Math.floor((Date.now() - startTime) / 60000);
    coinsDisplay.textContent = coinsEarned.toString();
  }, 1000);
});

stopBtn.addEventListener("click", () => {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerInterval);
  stopBtn.disabled = true;
  startBtn.disabled = false;

  const duration = Date.now() - startTime;
  const formatted = formatDuration(duration);
  lastSessionDisplay.textContent = formatted;

  const username = prompt("Enter your name to save your session:");
  if (!username) return;

  fetch("http://localhost:5000/add-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, coins: coinsEarned, duration: formatted }),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Session saved!");
      fetchLeaderboard();
    })
    .catch(err => {
      console.error("Error saving session:", err);
      alert("Failed to save session.");
    });
});

function fetchLeaderboard() {
  fetch("http://localhost:5000/sessions")
    .then(res => res.json())
    .then(data => {
      leaderboardBody.innerHTML = "";
      data.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.username}</td>
          <td>${entry.coins}</td>
          <td>${entry.duration}</td>
        `;
        leaderboardBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Error fetching leaderboard:", err);
    });
}

toggleLeaderboardBtn.addEventListener("click", () => {
  const board = document.querySelector(".leaderboard");
  if (board.style.display === "none") {
    board.style.display = "block";
    toggleLeaderboardBtn.textContent = "Hide Leaderboard";
  } else {
    board.style.display = "none";
    toggleLeaderboardBtn.textContent = "Show Leaderboard";
  }
});

document.getElementById("submitBtn").addEventListener("click", () => {
  alert("Please use the End Detox button to save your challenge.");
});

fetchLeaderboard();
