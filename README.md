# 🌱 TouchGrass AI

> **AI that tells you to stop using AI.**

TouchGrass AI is a lightweight outdoor-adventure web app built using only:

- HTML
- CSS
- Vanilla JavaScript
- Ollama
- An open-weight local AI model

The app generates personalized outdoor missions so that the user's screen becomes the shortest part of the experience.

---

## ✨ What it does

The user chooses:

- How much time they have
- What activity they want
- Difficulty

The local AI then generates a mission containing:

- Mission title
- Description
- 3–5 outdoor tasks
- Difficulty
- Estimated distance
- XP reward
- Phone-free final challenge

The user starts the mission, puts their phone away, goes outside, and returns when finished.

There is also an optional photo proof upload and local XP/streak tracking.

---

# 🧠 AI Architecture

```text
                    TOUCHGRASS AI
                          |
                          v
                 User preferences
                          |
                          v
                 Vanilla JavaScript
                          |
                          v
                Ollama localhost API
                          |
                          v
              Open-weight AI model
                 Qwen / Gemma / Llama
                          |
                          v
                Structured JSON
                          |
                          v
                 Mission Renderer
                          |
                          v
                   Outdoor Mission
                          |
                          v
                   📵 Phone Away
```

The open model is not used as decoration. It is the component responsible for creating the actual outdoor experience.

---

# 🔓 Why Open AI?

Open AI matters to this project for four main reasons.

### 1. Privacy

The user's prompt can stay on their own computer.

Their preferences do not have to be sent to a third-party AI API.

### 2. Offline/local inference

Once Ollama and the model are installed, mission generation can work without an internet connection.

### 3. Model freedom

The project can switch between open-weight models.

For example:

```text
Qwen
Gemma
Llama
```

Change this line in `script.js`:

```javascript
const AI_MODEL = "qwen3:4b";
```

### 4. No per-request API cost

Local inference does not require paying for every AI request.

---

# 🛠️ Setup

## Step 1 — Install Ollama

Download Ollama from:

https://ollama.com/

Install it normally.

---

## Step 2 — Download an open-weight model

Open Command Prompt / Terminal:

```bash
ollama pull qwen3:4b
```

Then test it:

```bash
ollama run qwen3:4b
```

If it responds, the local AI is ready.

---

# Step 3 — Run TouchGrass

You need to serve the files from a local web server.

Do NOT simply double-click `index.html` if your browser blocks requests to localhost.

### Option A — VS Code

Install the **Live Server** extension.

Open the project folder.

Right-click:

```text
index.html
```

Select:

```text
Open with Live Server
```

---

### Option B — Python

If Python is installed:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

---

# Step 4 — Generate a mission

Select:

```text
Time
Activity
Difficulty
```

Then click:

```text
Generate My Mission
```

JavaScript sends the prompt to:

```text
http://localhost:11434/api/generate
```

Ollama sends it to the local open-weight model.

The model returns structured JSON.

The JavaScript renders the mission.

---

# 📁 Project structure

```text
touchgrass-ai/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

# 🔌 Changing the AI model

The default model is:

```javascript
const AI_MODEL = "qwen3:4b";
```

If you have another compatible Ollama model installed, change it.

For example:

```javascript
const AI_MODEL = "gemma3:4b";
```

Then pull that model:

```bash
ollama pull gemma3:4b
```

The rest of the application does not need to change.

---

# 🛡️ Safety

The mission prompt explicitly instructs the model:

- Do not suggest dangerous activities.
- Do not require entering private property.
- Do not require interacting with strangers.
- Do not require special equipment.
- Keep phone usage minimal.

The app is designed for simple outdoor activities such as walking, exploring, observing nature, photography, and light fitness.

Users should still use common sense and local safety awareness.

---

# 🏆 Hackathon Demo

A strong demo flow:

### 1. Show the app

> "This is TouchGrass AI."

### 2. Explain the concept

> "It's an AI whose job is to make you stop using AI."

### 3. Show local AI

Show Ollama running locally.

### 4. Generate a mission

Example:

```text
The Hidden Green

30 minutes
Nature
Medium

1. Find three different plants.
2. Walk somewhere you've never explored.
3. Find something older than you.
4. Take one photograph.

Final challenge:
Put your phone away for five minutes.
```

### 5. Start mission

The app switches to:

```text
🌳 OUTSIDE MODE

15:00

PUT YOUR PHONE AWAY
```

### 6. Come back

Complete the mission.

### 7. Show XP/streak

```text
🌱 QUEST COMPLETE

+100 XP

3 Missions
3 Day Streak
75 Minutes Outside
```

---

# 🚀 Future improvements

Potential next versions:

- Local vision model to verify outdoor photos
- Bird-call identification
- Local weather integration
- GPS-based exploration
- Offline maps
- Walking route generation
- Community challenges
- Outdoor leaderboard
- Garden mode
- Run-club mode
- Nature identification
- Fully installable PWA

The important principle should remain:

> **The AI should make the screen shorter, not longer.**

---

## License

MIT — use, modify, and build on it freely.
