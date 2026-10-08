/* TOUCHGRASS AI — HTML/CSS/JS + local Ollama */

const OLLAMA_URL = "http://localhost:11434/api/generate";
const AI_MODEL = "qwen3:4b";

let selectedTime = "15 minutes";
let selectedActivity = "surprise me";
let selectedDifficulty = "easy";
let currentMission = null;
let timerInterval = null;
let remainingSeconds = 0;

let missionCount = Number(localStorage.getItem("tg_missions")) || 0;
let streak = Number(localStorage.getItem("tg_streak")) || 0;
let totalMinutes = Number(localStorage.getItem("tg_minutes")) || 0;

const screens = {
  home: document.getElementById("homeScreen"),
  loading: document.getElementById("loadingScreen"),
  mission: document.getElementById("missionScreen"),
  active: document.getElementById("activeScreen"),
  complete: document.getElementById("completeScreen")
};

const generateBtn = document.getElementById("generateBtn");
const generateText = document.getElementById("generateText");
const startMissionBtn = document.getElementById("startMissionBtn");
const returnBtn = document.getElementById("returnBtn");
const backBtn = document.getElementById("backBtn");
const newMissionBtn = document.getElementById("newMissionBtn");
const proofInput = document.getElementById("proofInput");
const proofPreview = document.getElementById("proofPreview");

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".choice").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".choice").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    selectedTime = button.dataset.time;
  });
});

document.querySelectorAll(".activity").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".activity").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    selectedActivity = button.dataset.activity;
  });
});

document.querySelectorAll(".difficulty").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".difficulty").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    selectedDifficulty = button.dataset.difficulty;
  });
});

function buildPrompt() {
  return `You are the AI engine behind "TouchGrass", an outdoor adventure application.

Create a short, fun, safe real-world outdoor mission.

Time available: ${selectedTime}
Preferred activity: ${selectedActivity}
Difficulty: ${selectedDifficulty}

Rules:
1. The user must physically go outside.
2. The mission must fit the requested time.
3. Do not require special equipment.
4. Do not suggest dangerous activities.
5. Do not require entering private property.
6. Do not require interacting with strangers.
7. Keep phone usage minimal.
8. Create 3-5 simple tasks.
9. Include one final challenge asking the user to put their phone away.
10. Make the mission specific and fun.
11. Estimate a reasonable walking distance.
12. XP should be 75 for easy, 100 for medium, 150 for challenging.

Return ONLY valid JSON in exactly this structure:
{
  "title": "Short creative title",
  "description": "One or two sentence description",
  "tasks": ["Task 1", "Task 2", "Task 3", "Task 4"],
  "difficulty": "Easy",
  "distance": "~1.5 km",
  "xp": 100,
  "finalChallenge": "A short phone-free challenge"
}`;
}

generateBtn.addEventListener("click", async () => {
  showScreen("loading");
  generateText.textContent = "Generating...";
  try {
    currentMission = await generateWithOllama();
    displayMission(currentMission);
    showScreen("mission");
  } catch (error) {
    console.warn("Local AI unavailable; using demo mission.", error);
    showDemoMission();
    showScreen("mission");
  } finally {
    generateText.textContent = "Generate My Mission";
  }
});

async function generateWithOllama() {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: AI_MODEL,
      prompt: buildPrompt(),
      stream: false,
      format: "json",
      options: { temperature: 0.8 }
    })
  });

  if (!response.ok) throw new Error("Ollama request failed");

  const data = await response.json();
  if (!data.response) throw new Error("AI returned no response");

  return JSON.parse(data.response);
}

function showDemoMission() {
  currentMission = {
    title: "The Hidden Green",
    description: "Explore somewhere nearby and notice the things you normally walk past.",
    tasks: [
      "Walk somewhere you have never explored before.",
      "Find three different types of plants.",
      "Find something that looks older than you.",
      "Take exactly one interesting photograph."
    ],
    difficulty: "Easy",
    distance: "~1.5 km",
    xp: 75,
    finalChallenge: "Sit somewhere outside for five minutes without touching your phone."
  };
  displayMission(currentMission);
}

function displayMission(mission) {
  document.getElementById("missionNumber").textContent =
    `#${String(missionCount + 1).padStart(2, "0")}`;
  document.getElementById("missionTitle").textContent = mission.title;
  document.getElementById("missionDescription").textContent = mission.description;
  document.getElementById("missionDifficulty").textContent = mission.difficulty;
  document.getElementById("missionTime").textContent = selectedTime;
  document.getElementById("missionDistance").textContent = mission.distance;
  document.getElementById("missionXP").textContent = `+${mission.xp} XP`;
  document.getElementById("finalChallenge").textContent = mission.finalChallenge;

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  mission.tasks.forEach((task, index) => {
    const el = document.createElement("div");
    el.className = "task";

    const number = document.createElement("div");
    number.className = "task-number";
    number.textContent = index + 1;

    const text = document.createElement("div");
    text.textContent = task;

    el.append(number, text);
    taskList.appendChild(el);
  });
}

startMissionBtn.addEventListener("click", startOutdoorMission);

function startOutdoorMission() {
  showScreen("active");
  remainingSeconds = convertTimeToSeconds(selectedTime);
  updateTimer();
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimer();
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function convertTimeToSeconds(time) {
  if (time.includes("15")) return 15 * 60;
  if (time.includes("30")) return 30 * 60;
  if (time.includes("60")) return 60 * 60;
  if (time.includes("2 hours")) return 120 * 60;
  return 15 * 60;
}

function updateTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

returnBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  completeMission();
});

function completeMission() {
  missionCount++;
  streak++;

  const minutes = convertTimeToSeconds(selectedTime) / 60;
  totalMinutes += minutes;

  localStorage.setItem("tg_missions", missionCount);
  localStorage.setItem("tg_streak", streak);
  localStorage.setItem("tg_minutes", totalMinutes);

  document.getElementById("earnedXP").textContent = `+${currentMission.xp} XP`;
  document.getElementById("totalMissions").textContent = missionCount;
  document.getElementById("streak").textContent = `${streak} 🔥`;
  document.getElementById("totalMinutes").textContent = totalMinutes;

  showScreen("complete");
}

proofInput.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    proofPreview.innerHTML = "";
    const img = document.createElement("img");
    img.src = e.target.result;
    img.alt = "Outdoor proof";
    proofPreview.appendChild(img);
  };
  reader.readAsDataURL(file);
});

newMissionBtn.addEventListener("click", () => {
  proofInput.value = "";
  proofPreview.innerHTML = "";
  showScreen("home");
});

backBtn.addEventListener("click", () => showScreen("home"));

console.log("🌱 TouchGrass AI");
console.log("Local AI model:", AI_MODEL);
console.log("Missions:", missionCount);
console.log("Streak:", streak);
