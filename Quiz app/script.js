const welcomeScreen = document.getElementById('welcome-screen');
const startScreen = document.getElementById('start-screen');
const quiz = document.getElementById('quiz');
const result = document.getElementById('result');
const questionEl = document.getElementById('question');
const answersList = document.querySelector('ul');
const nextBtn = document.getElementById('next');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');
const beginBtn = document.getElementById('begin-btn');
const usernameInput = document.getElementById('username');
const personalGreeting = document.getElementById('personal-greeting');
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');
const startBtn = document.getElementById('start-btn');
const scoreboardBody = document.getElementById('scoreboard-body');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const themeSwitch = document.getElementById('theme-switch');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let username = '';

// Load questions
function loadQuestions(category) {
  if (category === 'mixed') {
    return [...htmlQuestions, ...cssQuestions, ...jsQuestions].sort(() => Math.random() - 0.5);
  }
  if (category === 'html') return [...htmlQuestions];
  if (category === 'css') return [...cssQuestions];
  if (category === 'javascript') return [...jsQuestions];
  return [];
}

// Begin
beginBtn.onclick = () => {
  username = usernameInput.value.trim();
  if (!username) return alert('Please enter your name.');
  welcomeScreen.classList.add('hide');
  startScreen.classList.remove('hide');
  personalGreeting.textContent = `Welcome, ${username}! Choose your difficulty to begin.`;
  loadLeaderboard();
};

// Start Quiz
startBtn.onclick = () => {
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;
  questions = loadQuestions(category).filter(q => q.difficulty === difficulty);
  if (!questions.length) return alert('No questions available for this selection.');

  currentQuestionIndex = 0;
  score = 0;
  startScreen.classList.add('hide');
  quiz.classList.remove('hide');
  showQuestion();
};

// Show question
function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionEl.textContent = q.question;
  answersList.innerHTML = '';
  q.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.className = 'answer';
    btn.textContent = answer;
    btn.onclick = () => {
      if (answer === q.correct) score++;
      nextBtn.classList.remove('hide');
      Array.from(document.querySelectorAll('.answer')).forEach(b => b.disabled = true);
    };
    const li = document.createElement('li');
    li.appendChild(btn);
    answersList.appendChild(li);
  });
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  progressFill.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  nextBtn.classList.add('hide');
}

nextBtn.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  quiz.classList.add('hide');
  result.classList.remove('hide');
  scoreEl.textContent = `${score}/${questions.length}`;
  saveScore();
}

restartBtn.onclick = () => {
  result.classList.add('hide');
  startScreen.classList.remove('hide');
  loadLeaderboard();
};

// Save Score
function saveScore() {
  const difficulty = difficultySelect.value;
  const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
  scores.unshift({ name: username, score: `${score}/${questions.length}`, difficulty });
  localStorage.setItem('quizScores', JSON.stringify(scores.slice(0, 5)));
  loadLeaderboard();
}

function loadLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
  scoreboardBody.innerHTML = '';
  scores.forEach(s => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${s.name}</td><td>${s.score}</td><td>${s.difficulty}</td>`;
    scoreboardBody.appendChild(row);
  });
}

// Theme toggle
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitch.checked);
});