// Glossary & Flashcards Application Logic

// Simple LocalStorage wrapper for persistence
const DB = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  },
  getOne: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setOne: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }
};

// State Management
let currentMode = 'glossary';
let currentCategory = 'all';
let currentLetter = null;
let currentDomain = 'all';
let currentCardIndex = 0;
let currentCards = [];
let sessionStats = DB.get('flashcard_session') || { known: [], unknown: [], reviewed: [] };

// Ensure sessionStats has all required properties
if (!sessionStats.known) sessionStats.known = [];
if (!sessionStats.unknown) sessionStats.unknown = [];
if (!sessionStats.reviewed) sessionStats.reviewed = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeGlossary();
  initializeFlashcards();
  switchMode('glossary');
});

// Mode Switching
function switchMode(mode) {
  currentMode = mode;
  
  // Update buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(mode === 'glossary' ? 'Glossary' : 'Flashcards')) {
      btn.classList.add('active');
    }
  });
  
  // Update sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  if (mode === 'glossary') {
    document.getElementById('glossary-section').classList.add('active');
  } else {
    document.getElementById('flashcards-section').classList.add('active');
    loadFlashcard();
  }
}

// ===== GLOSSARY FUNCTIONALITY =====

function initializeGlossary() {
  // Sort terms alphabetically
  glossaryTerms.sort((a, b) => a.term.localeCompare(b.term));
  
  // Create alphabet navigation
  createAlphabetNav();
  
  // Display all terms initially
  displayGlossary(glossaryTerms);
}

function createAlphabetNav() {
  const alphaNav = document.getElementById('alphaNav');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  // Add "All" button
  const allBtn = document.createElement('button');
  allBtn.className = 'alpha-btn active';
  allBtn.textContent = 'All';
  allBtn.onclick = () => filterByLetter(null);
  alphaNav.appendChild(allBtn);
  
  // Add letter buttons
  alphabet.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'alpha-btn';
    btn.textContent = letter;
    btn.onclick = () => filterByLetter(letter);
    
    // Check if any terms start with this letter
    const hasTerms = glossaryTerms.some(term => 
      term.term.toUpperCase().startsWith(letter)
    );
    if (!hasTerms) {
      btn.style.opacity = '0.3';
      btn.style.cursor = 'not-allowed';
      btn.onclick = null;
    }
    
    alphaNav.appendChild(btn);
  });
}

function displayGlossary(terms) {
  const container = document.getElementById('glossaryList');
  
  if (terms.length === 0) {
    container.innerHTML = '<div class="empty-state">No terms found. Try adjusting your filters.</div>';
    return;
  }
  
  container.innerHTML = terms.map((term, index) => `
    <div class="glossary-item ${term.examRelevant ? 'exam-relevant' : ''}" onclick="toggleGlossaryItem(${index})">
      <div class="glossary-term">
        ${term.term}
        ${term.examRelevant ? '<span class="exam-badge">EXAM</span>' : ''}
      </div>
      <div class="glossary-short">${term.short}</div>
      <div class="glossary-full">
        <p><strong>Definition:</strong> ${term.definition}</p>
        ${term.examples && term.examples.length > 0 ? `
          <div class="example">
            <div class="example-title">💡 Common Use Cases:</div>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
              ${term.examples.map(ex => `<li>${ex}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function toggleGlossaryItem(index) {
  const items = document.querySelectorAll('.glossary-item');
  if (items[index]) {
    items[index].classList.toggle('expanded');
  }
}

function filterGlossary() {
  const searchTerm = document.getElementById('glossarySearch').value.toLowerCase();
  
  let filtered = glossaryTerms.filter(term => {
    const matchesSearch = 
      term.term.toLowerCase().includes(searchTerm) ||
      term.short.toLowerCase().includes(searchTerm) ||
      term.definition.toLowerCase().includes(searchTerm);
    
    const matchesCategory = currentCategory === 'all' || term.category === currentCategory;
    
    const matchesLetter = !currentLetter || 
      term.term.toUpperCase().startsWith(currentLetter);
    
    return matchesSearch && matchesCategory && matchesLetter;
  });
  
  displayGlossary(filtered);
}

function filterByCategory(category) {
  currentCategory = category;
  
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
  
  filterGlossary();
}

function filterByLetter(letter) {
  currentLetter = letter;
  
  // Update button states
  document.querySelectorAll('.alpha-btn').forEach(btn => {
    btn.classList.remove('active');
    if ((letter === null && btn.textContent === 'All') || 
        btn.textContent === letter) {
      btn.classList.add('active');
    }
  });
  
  filterGlossary();
}

// ===== FLASHCARDS FUNCTIONALITY =====

function initializeFlashcards() {
  loadFlashcardSet('all');
}

function selectDomain(domain) {
  currentDomain = domain;
  
  // Update button states
  document.querySelectorAll('.domain-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.domain === domain) {
      btn.classList.add('active');
    }
  });
  
  loadFlashcardSet(domain);
}

function loadFlashcardSet(domain) {
  if (domain === 'all') {
    currentCards = [...flashcards];
  } else {
    currentCards = flashcards.filter(card => card.domain === domain);
  }
  
  currentCardIndex = 0;
  updateStats();
  loadFlashcard();
}

function loadFlashcard() {
  const container = document.getElementById('flashcardDisplay');
  
  if (currentCards.length === 0) {
    container.innerHTML = '<div class="empty-state">No flashcards available for this domain.</div>';
    return;
  }
  
  const card = currentCards[currentCardIndex];
  const cardId = `${card.domain}-${currentCardIndex}`;
  const isKnown = sessionStats.known.includes(cardId);
  const isUnknown = sessionStats.unknown.includes(cardId);
  
  container.innerHTML = `
    <div class="flashcard" id="flashcard" onclick="flipCard()">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="flashcard-label">QUESTION ${currentCardIndex + 1} of ${currentCards.length}</div>
          <div class="flashcard-content">${card.front}</div>
          ${card.hint ? `<div class="flashcard-hint">💡 Hint: ${card.hint}</div>` : ''}
          <div style="margin-top: 2rem; color: var(--muted); font-size: 0.875rem;">Click to reveal answer</div>
        </div>
        <div class="flashcard-back">
          <div class="flashcard-label">ANSWER</div>
          <div class="flashcard-content" style="font-size: 1.1rem; white-space: pre-line;">${card.back}</div>
        </div>
      </div>
    </div>
    <div class="flashcard-footer">
      <button class="knowledge-btn unknown" onclick="markCard('unknown')" ${isUnknown ? 'style="opacity: 0.5;"' : ''}>
        ❌ Need to Review
      </button>
      <button class="action-btn secondary" onclick="previousCard()">← Previous</button>
      <button class="action-btn secondary" onclick="nextCard()">Next →</button>
      <button class="knowledge-btn known" onclick="markCard('known')" ${isKnown ? 'style="opacity: 0.5;"' : ''}>
        ✅ I Know This
      </button>
    </div>
  `;
  
  updateStats();
}

function flipCard() {
  const flashcard = document.getElementById('flashcard');
  if (flashcard) {
    flashcard.classList.toggle('flipped');
  }
}

function nextCard() {
  if (currentCardIndex < currentCards.length - 1) {
    currentCardIndex++;
    loadFlashcard();
  } else {
    // Loop back to start
    currentCardIndex = 0;
    loadFlashcard();
  }
}

function previousCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    loadFlashcard();
  } else {
    // Loop to end
    currentCardIndex = currentCards.length - 1;
    loadFlashcard();
  }
}

function markCard(status) {
  const card = currentCards[currentCardIndex];
  const cardId = `${card.domain}-${currentCardIndex}`;
  
  // Remove from opposite list
  if (status === 'known') {
    sessionStats.unknown = sessionStats.unknown.filter(id => id !== cardId);
    if (!sessionStats.known.includes(cardId)) {
      sessionStats.known.push(cardId);
    }
  } else {
    sessionStats.known = sessionStats.known.filter(id => id !== cardId);
    if (!sessionStats.unknown.includes(cardId)) {
      sessionStats.unknown.push(cardId);
    }
  }
  
  // Add to reviewed
  if (!sessionStats.reviewed.includes(cardId)) {
    sessionStats.reviewed.push(cardId);
  }
  
  // Save to localStorage
  DB.set('flashcard_session', sessionStats);
  
  // Update display
  updateStats();
  
  // Auto-advance to next card after marking
  setTimeout(() => {
    nextCard();
  }, 300);
}

function updateStats() {
  if (!currentCards || currentCards.length === 0) {
    return;
  }
  
  const totalCards = currentCards.length;
  const reviewedCount = sessionStats.reviewed ? sessionStats.reviewed.filter(id => {
    const [domain] = id.split('-');
    return currentDomain === 'all' || domain === currentDomain;
  }).length : 0;
  
  const knownCount = sessionStats.known ? sessionStats.known.filter(id => {
    const [domain] = id.split('-');
    return currentDomain === 'all' || domain === currentDomain;
  }).length : 0;
  
  const unknownCount = sessionStats.unknown ? sessionStats.unknown.filter(id => {
    const [domain] = id.split('-');
    return currentDomain === 'all' || domain === currentDomain;
  }).length : 0;
  
  const progressPercent = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;
  
  const cardCountEl = document.getElementById('cardCount');
  const knownCountEl = document.getElementById('knownCount');
  const unknownCountEl = document.getElementById('unknownCount');
  const sessionProgressEl = document.getElementById('sessionProgress');
  
  if (cardCountEl) cardCountEl.textContent = `${currentCardIndex + 1}/${totalCards}`;
  if (knownCountEl) knownCountEl.textContent = knownCount;
  if (unknownCountEl) unknownCountEl.textContent = unknownCount;
  if (sessionProgressEl) sessionProgressEl.textContent = `${progressPercent}%`;
}

function shuffleCards() {
  // Fisher-Yates shuffle
  for (let i = currentCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
  }
  
  currentCardIndex = 0;
  loadFlashcard();
}

function resetProgress() {
  if (confirm('Reset all flashcard progress for this session? This will clear your known/unknown marks.')) {
    sessionStats = { known: [], unknown: [], reviewed: [] };
    DB.set('flashcard_session', sessionStats);
    updateStats();
    loadFlashcard();
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (currentMode === 'flashcards') {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      const flashcard = document.getElementById('flashcard');
      if (flashcard && !flashcard.classList.contains('flipped')) {
        flipCard();
      } else {
        nextCard();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      previousCard();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      flipCard();
    } else if (e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      markCard('known');
    } else if (e.key === 'u' || e.key === 'U') {
      e.preventDefault();
      markCard('unknown');
    }
  }
});
