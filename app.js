// Major System mapping: digit -> consonant sounds
const MAJOR = {
  0: ['s', 'z'],
  1: ['t', 'd', 'th'],
  2: ['n'],
  3: ['m'],
  4: ['r'],
  5: ['l'],
  6: ['j', 'ch', 'sh'],
  7: ['g', 'c', 'k', 'q', 'ck'],
  8: ['v', 'f', 'ph'],
  9: ['p', 'b']
};



// Get consonants for a two-digit number
function getConsonants(num) {
  const d1 = Math.floor(num / 10);
  const d2 = num % 10;
  return {
    first: MAJOR[d1],
    second: MAJOR[d2],
    label: `${d1}=${MAJOR[d1].join('/')} + ${d2}=${MAJOR[d2].join('/')}`
  };
}

// Extract consonants from a name (ignoring vowels and non-major consonants)
function extractMajorConsonants(name) {
  const lower = name.toLowerCase().replace(/[^a-z]/g, '');
  const consonants = [];
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    const next = lower[i + 1] || '';
    const next2 = lower[i + 2] || '';
    // Multi-char sounds
    if (ch === 't' && next === 'h') { consonants.push('th'); i++; continue; }
    if (ch === 'c' && next === 'h') { consonants.push('ch'); i++; continue; }
    if (ch === 's' && next === 'h') { consonants.push('sh'); i++; continue; }
    if (ch === 'c' && next === 'k') { consonants.push('ck'); i++; continue; }
    if (ch === 'p' && next === 'h') { consonants.push('ph'); i++; continue; }
    // Single consonants in major system
    if ('sztdn m r l j g c k q v f p b'.split(' ').includes(ch)) {
      consonants.push(ch);
    }
  }
  return consonants;
}

// Check if a character matches a number pair
function matchesNumber(character, num) {
  const { first, second } = getConsonants(num);
  const cons = extractMajorConsonants(character.name);
  if (cons.length < 2) return false;
  const firstMatch = first.some(s => {
    if (s.length > 1) return cons[0] === s;
    return cons[0] === s || cons[0].startsWith(s);
  });
  const secondMatch = second.some(s => {
    if (s.length > 1) return cons[1] === s;
    return cons[1] === s || cons[1].startsWith(s);
  });
  return firstMatch && secondMatch;
}

// Get suggestions for a number
function getSuggestions(num) {
  return CHARACTERS.filter(c => matchesNumber(c, num));
}

// State
const STORAGE_KEY = 'pao-major-system';
let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let currentNum = null;

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function updateGlobalProgress() {
  const filled = Object.values(data).filter(v => v.persona && v.persona.trim()).length;
  const el = document.getElementById('globalProgress');
  const pct = Math.round((filled / 100) * 100);
  el.innerHTML = `
    <span>${filled} / 100 cartas</span>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <span>${pct}%</span>
  `;
}

// Render grid
function renderGrid(filter = '') {
  updateGlobalProgress();
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  for (let group = 0; group < 10; group++) {
    const start = group * 10;
    const end = start + 9;
    const sectionCards = [];

    for (let i = start; i <= end; i++) {
      const num = String(i).padStart(2, '0');
      const entry = data[num] || {};
      const { label } = getConsonants(i);

      if (filter) {
        const f = filter.toLowerCase();
        const matchNum = num.includes(f);
        const matchName = (entry.persona || '').toLowerCase().includes(f);
        const matchCons = label.toLowerCase().includes(f);
        if (!matchNum && !matchName && !matchCons) continue;
      }

      const card = document.createElement('div');
      card.className = 'card' + (entry.persona ? ' filled' : '');
      card.innerHTML = `
        <div class="card-corner card-corner-top">${num}</div>
        <div class="card-art">
          ${entry.image ? `<img src="${entry.image}" alt="${entry.persona || ''}" onerror="this.style.display='none'">` : `<span class="card-art-empty">🃏</span>`}
        </div>
        <div class="card-info">
          <div class="card-name">${entry.persona || '???'}</div>
        </div>

      `;
      card.addEventListener('click', () => openModal(i));
      sectionCards.push(card);
    }

    // Only render section if it has visible cards
    if (sectionCards.length === 0) continue;

    const startStr = String(start).padStart(2, '0');
    const endStr = String(end).padStart(2, '0');
    const filledCount = sectionCards.filter(c => c.classList.contains('filled')).length;

    const section = document.createElement('div');
    section.className = 'section';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
      <span class="section-title">${startStr} — ${endStr}</span>
      <span class="section-progress">${filledCount}/10</span>
    `;
    section.appendChild(header);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'section-cards';
    sectionCards.forEach(c => cardsContainer.appendChild(c));
    section.appendChild(cardsContainer);

    grid.appendChild(section);
  }
}


// Modal
function openModal(num) {
  currentNum = num;
  const numStr = String(num).padStart(2, '0');
  const entry = data[numStr] || {};
  const { label } = getConsonants(num);

  document.getElementById('modalTitle').textContent = `#${numStr} — Editar PAO`;
  document.getElementById('modalConsonants').textContent = `Consoantes: ${label}`;
  document.getElementById('paoPersona').value = entry.persona || '';
  document.getElementById('paoAction').value = entry.action || '';
  document.getElementById('paoObject').value = entry.object || '';
  document.getElementById('paoImage').value = entry.image || '';
  updateImagePreview(entry.image || '');

  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('paoPersona').focus();
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  currentNum = null;
}

function saveEntry() {
  if (currentNum === null) return;
  const numStr = String(currentNum).padStart(2, '0');
  data[numStr] = {
    persona: document.getElementById('paoPersona').value.trim(),
    action: document.getElementById('paoAction').value.trim(),
    object: document.getElementById('paoObject').value.trim(),
    image: document.getElementById('paoImage').value.trim()
  };
  saveData();
  renderGrid(document.getElementById('search').value);
  closeModal();
}

// Export / Import
function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pao-major-system.json';
  a.click();
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      data = JSON.parse(e.target.result);
      saveData();
      renderGrid();
    } catch { alert('Arquivo JSON inválido.'); }
  };
  reader.readAsText(file);
}

// Image preview
function updateImagePreview(url) {
  const preview = document.getElementById('imagePreview');
  if (url) {
    preview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<span class=\\'image-placeholder\\'>❌</span>'">`;
  } else {
    preview.innerHTML = '<span class="image-placeholder">📷</span>';
  }
}

// Events
document.getElementById('search').addEventListener('input', (e) => renderGrid(e.target.value));
document.getElementById('paoImage').addEventListener('input', (e) => updateImagePreview(e.target.value));
document.getElementById('pasteImageBtn').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById('paoImage').value = text;
    updateImagePreview(text);
  } catch { /* clipboard not available */ }
});
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal(); });
document.getElementById('saveBtn').addEventListener('click', saveEntry);
document.getElementById('exportBtn').addEventListener('click', exportData);
document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change', (e) => { if (e.target.files[0]) importData(e.target.files[0]); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter' && currentNum !== null) saveEntry();
});

// Init
renderGrid();
