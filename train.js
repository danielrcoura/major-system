const STORAGE_KEY = 'pao-major-system';
const TOTAL_ROUNDS = 10;
const CARDS_PER_ROUND = 3;
const DISTRACTORS = 2;

let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let filledEntries = [];
let round = 0;
let score = 0;
let currentChallenge = null;
let expectedIndex = 0;
let mode = 'numToChar'; // or 'charToNum'

function getFilledEntries() {
  return Object.entries(data)
    .filter(([, v]) => v.persona && v.persona.trim())
    .map(([num, v]) => ({ num, ...v }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomNum(exclude) {
  let n;
  do {
    n = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  } while (exclude.has(n));
  return n;
}

function init() {
  filledEntries = getFilledEntries();
  const countEl = document.getElementById('filledCount');
  countEl.textContent = `Cartões preenchidos: ${filledEntries.length}`;

  // Mode selector
  const updateStartBtn = () => {
    const min = mode === 'flashCards' ? 1 : CARDS_PER_ROUND + DISTRACTORS;
    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = filledEntries.length < min;
  };

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
      const descriptions = {
        numToChar: 'Veja 3 números e clique nos personagens na ordem correta.',
        charToNum: 'Veja 3 personagens e clique nos números na ordem correta.',
        flashCards: 'Veja o número, clique para revelar o personagem. Revise todos os cartões preenchidos.'
      };
      document.getElementById('modeDescription').textContent = descriptions[mode];
      updateStartBtn();
    });
  });

  updateStartBtn();

  document.getElementById('startBtn').addEventListener('click', startTraining);
  document.getElementById('retryBtn').addEventListener('click', () => {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    filledEntries = getFilledEntries();
    startTraining();
  });
}

function startTraining() {
  round = 0;
  score = 0;
  if (mode === 'flashCards') {
    startFlashCards();
    return;
  }
  show(mode === 'numToChar' ? 'challengeScreen' : 'challengeScreen2');
  nextRound();
}

function show(id) {
  ['startScreen', 'challengeScreen', 'challengeScreen2', 'flashScreen', 'resultScreen'].forEach(s => {
    document.getElementById(s).classList.toggle('hidden', s !== id);
  });
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) {
    showResult();
    return;
  }

  round++;
  expectedIndex = 0;

  const shuffled = shuffle(filledEntries);
  const picked = shuffled.slice(0, CARDS_PER_ROUND);

  if (mode === 'numToChar') {
    updateHeader('roundLabel', 'scoreLabel');
    const pickedNums = new Set(picked.map(e => e.num));
    const extras = shuffled.filter(e => !pickedNums.has(e.num)).slice(0, DISTRACTORS);
    const allChoices = shuffle([...picked, ...extras]);
    currentChallenge = { ordered: picked, choices: allChoices, mistakes: 0 };
    renderMode1();
  } else {
    updateHeader('roundLabel2', 'scoreLabel2');
    const pickedNums = new Set(picked.map(e => e.num));
    const extraNums = [];
    for (let i = 0; i < DISTRACTORS; i++) {
      const n = randomNum(new Set([...pickedNums, ...extraNums]));
      extraNums.push(n);
    }
    const allNums = shuffle([...picked.map(e => e.num), ...extraNums]);
    currentChallenge = { ordered: picked, numChoices: allNums, mistakes: 0 };
    renderMode2();
  }
}

function updateHeader(roundId, scoreId) {
  document.getElementById(roundId).textContent = `Desafio ${round} / ${TOTAL_ROUNDS}`;
  document.getElementById(scoreId).textContent = `✓ ${score}`;
}

// ===== MODE 1: Numbers → Characters =====
function renderMode1() {
  const { ordered, choices } = currentChallenge;

  document.getElementById('numbersRow').innerHTML = ordered.map((e, i) =>
    `<div class="number-card" id="numCard${i}"><span class="num">${e.num}</span></div>`
  ).join('');

  const choicesRow = document.getElementById('choicesRow');
  choicesRow.innerHTML = choices.map((e, i) => `
    <div class="choice-card" data-num="${e.num}" id="choice${i}">
      <div class="choice-art">
        ${e.image ? `<img src="${e.image}" alt="${e.persona}" onerror="this.parentElement.innerHTML='<span>🧑</span>'">` : '<span>🧑</span>'}
      </div>
      <div class="choice-name">${e.persona}</div>
    </div>
  `).join('');

  choicesRow.querySelectorAll('.choice-card').forEach(el => {
    el.addEventListener('click', () => handleChoiceMode1(el));
  });

  document.getElementById('feedback').classList.add('hidden');
}

function handleChoiceMode1(el) {
  const clickedNum = el.dataset.num;
  const expectedNum = currentChallenge.ordered[expectedIndex].num;

  if (clickedNum === expectedNum) {
    el.classList.add('correct', 'disabled');
    document.getElementById(`numCard${expectedIndex}`).classList.add('matched');
    expectedIndex++;
    if (expectedIndex >= CARDS_PER_ROUND) finishRound('feedback');
  } else {
    currentChallenge.mistakes++;
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 400);
  }
}

// ===== MODE 2: Characters → Numbers =====
function renderMode2() {
  const { ordered, numChoices } = currentChallenge;

  document.getElementById('charsRow').innerHTML = ordered.map((e, i) => `
    <div class="char-display" id="charCard${i}">
      <div class="choice-art">
        ${e.image ? `<img src="${e.image}" alt="${e.persona}" onerror="this.parentElement.innerHTML='<span>🧑</span>'">` : '<span>🧑</span>'}
      </div>
      <div class="choice-name">${e.persona}</div>
    </div>
  `).join('');

  const numRow = document.getElementById('numChoicesRow');
  numRow.innerHTML = numChoices.map((n, i) =>
    `<div class="number-choice" data-num="${n}" id="numChoice${i}">${n}</div>`
  ).join('');

  numRow.querySelectorAll('.number-choice').forEach(el => {
    el.addEventListener('click', () => handleChoiceMode2(el));
  });

  document.getElementById('feedback2').classList.add('hidden');
}

function handleChoiceMode2(el) {
  const clickedNum = el.dataset.num;
  const expectedNum = currentChallenge.ordered[expectedIndex].num;

  if (clickedNum === expectedNum) {
    el.classList.add('correct', 'disabled');
    document.getElementById(`charCard${expectedIndex}`).classList.add('matched');
    expectedIndex++;
    if (expectedIndex >= CARDS_PER_ROUND) finishRound('feedback2');
  } else {
    currentChallenge.mistakes++;
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 400);
  }
}

// ===== Shared =====
function finishRound(feedbackId) {
  if (currentChallenge.mistakes === 0) score++;
  const scoreId = mode === 'numToChar' ? 'scoreLabel' : 'scoreLabel2';
  document.getElementById(scoreId).textContent = `✓ ${score}`;

  const fb = document.getElementById(feedbackId);
  fb.classList.remove('hidden', 'success', 'fail');
  fb.classList.add(currentChallenge.mistakes === 0 ? 'success' : 'fail');
  fb.textContent = currentChallenge.mistakes === 0 ? 'Perfeito!' : `Concluído com ${currentChallenge.mistakes} erro(s)`;

  setTimeout(nextRound, 1200);
}

function showResult() {
  show('resultScreen');
  const pct = Math.round((score / TOTAL_ROUNDS) * 100);
  let emoji = '🏆';
  if (pct < 50) emoji = '💪';
  else if (pct < 80) emoji = '👍';

  document.getElementById('resultTitle').textContent = `${emoji} Treino Concluído`;
  document.getElementById('resultScore').textContent = `Acertos perfeitos: ${score} / ${TOTAL_ROUNDS} (${pct}%)`;
}

// ===== MODE 3: Flash Cards =====
let flashDeck = [];
let flashIndex = 0;
let flashFlipped = false;

function startFlashCards() {
  flashDeck = shuffle(filledEntries);
  flashIndex = 0;
  flashFlipped = false;
  show('flashScreen');
  renderFlashCard();

  const card = document.getElementById('flashCard');
  card.onclick = handleFlashClick;
}

function renderFlashCard() {
  const card = document.getElementById('flashCard');
  const entry = flashDeck[flashIndex];

  // Disable animation, snap to front, hide back content
  card.style.transition = 'none';
  card.classList.remove('flipped');
  document.getElementById('flashName').textContent = '';
  document.getElementById('flashArt').innerHTML = '';

  // Force reflow so the snap takes effect
  void card.offsetHeight;

  // Re-enable animation
  card.style.transition = '';

  // Now safely update content
  document.getElementById('flashRoundLabel').textContent = `Carta ${flashIndex + 1} / ${flashDeck.length}`;
  document.getElementById('flashProgress').textContent = `${Math.round(((flashIndex) / flashDeck.length) * 100)}%`;
  document.getElementById('flashNumber').textContent = entry.num;
  document.getElementById('flashName').textContent = entry.persona;
  document.getElementById('flashArt').innerHTML = entry.image
    ? `<img src="${entry.image}" alt="${entry.persona}" onerror="this.parentElement.innerHTML='<span>🧑</span>'">`
    : '<span>🧑</span>';
  document.getElementById('flashInstruction').textContent = 'Clique na carta para revelar';

  flashFlipped = false;
}

function handleFlashClick() {
  if (!flashFlipped) {
    document.getElementById('flashCard').classList.add('flipped');
    document.getElementById('flashInstruction').textContent = '';
    flashFlipped = true;
    setTimeout(() => {
      flashIndex++;
      if (flashIndex >= flashDeck.length) {
        show('resultScreen');
        document.getElementById('resultTitle').textContent = '🃏 Flash Cards Concluído';
        document.getElementById('resultScore').textContent = `Você revisou ${flashDeck.length} cartas.`;
        return;
      }
      renderFlashCard();
    }, 1500);
  }
}

init();
