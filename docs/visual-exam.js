// Visual Architecture Exam - Exam Logic
// Implements dual-scoring exam: multiple-choice answer + architecture construction

// ==================== STATE ====================

const veState = {
  // Exam session
  mode: null,            // 'timed' | 'practice'
  started: false,
  currentIndex: 0,       // Current question index (0-based)
  answers: [],           // Array of answer objects per question
  flagged: new Set(),    // Set of flagged question indices
  skipped: new Set(),    // Set of skipped question indices
  startTime: null,
  timerInterval: null,
  timeRemaining: 0,      // seconds remaining (timed mode)
  pausesUsed: 0,
  paused: false,
  pauseStart: null,

  // Per-question canvas state (reset each question)
  placedServices: [],   // { instanceId, serviceId, x, y }
  connections: [],      // { id, fromInstanceId, toInstanceId }
  connectingFrom: null,
  nextInstanceId: 1,
  canvasEl: null,
  svgEl: null,
  zoom: 1.0,
  checked: false,       // Whether current question has been checked
  selectedAnswer: null  // 0-3 for current question
};

const VE_TOTAL_QUESTIONS         = VISUAL_EXAM_QUESTIONS.length;
const VE_PASS_PERCENTAGE         = 0.71;   // mirrors SAA-C03 pass threshold
const VE_MAX_POINTS              = VE_TOTAL_QUESTIONS * 2;
const VE_PASS_POINTS             = Math.round(VE_MAX_POINTS * VE_PASS_PERCENTAGE);
const VE_CANVAS_GRID             = 20;
const VE_ICON_OFFSET             = 36;
const VE_TIMED_SECONDS           = VE_TOTAL_QUESTIONS * 60; // 1 min per question
const VE_MAX_PAUSES              = 2;
const VE_PAUSE_SECS              = 5 * 60;   // 5 minutes per pause
const VE_TIMER_WARNING_MINS      = 60;        // yellow warning threshold (minutes)
const VE_TIMER_CRITICAL_MINS     = 15;        // red critical threshold (minutes)
const VE_CONNECTION_CURVE_OFFSET = 30;        // SVG quadratic curve offset (pixels)

// ==================== INIT ====================

function initVisualExam() {
  veState.canvasEl = document.getElementById('veCanvasInner');
  veState.svgEl    = document.getElementById('veConnectionsSvg');
  if (!veState.canvasEl || !veState.svgEl) return;

  veSetupCanvasDrop();
  veShowStartScreen();
}

// ==================== START SCREEN ====================

function veShowStartScreen() {
  document.getElementById('veStartScreen').style.display  = 'block';
  document.getElementById('veQuestionArea').style.display = 'none';
  document.getElementById('veResultsScreen').style.display = 'none';
  document.getElementById('veExamInfo_total').textContent = VE_TOTAL_QUESTIONS;
  document.getElementById('veExamInfo_points').textContent = VE_MAX_POINTS;
  const passPct = Math.round(VE_PASS_POINTS / VE_MAX_POINTS * 100);
  document.getElementById('veExamInfo_pass').textContent  = VE_PASS_POINTS + ' (' + passPct + '%)';
  const subLabel = document.getElementById('veExamInfo_pass_sub');
  if (subLabel) subLabel.textContent = '(' + passPct + '% = ' + VE_PASS_POINTS + '/' + VE_MAX_POINTS + ')';

  // Show progress card if a saved session exists
  const saved = veLoadSession();
  const progressCard = document.getElementById('veProgressCard');
  if (progressCard) {
    if (saved && saved.mode) {
      const answeredCount = (saved.answers || []).filter(a => a.checked).length;
      const total         = (saved.answers || []).reduce((s, a) => s + (a.totalScore || 0), 0);
      document.getElementById('veProgressCompleted').textContent = answeredCount + '/' + VE_TOTAL_QUESTIONS;
      document.getElementById('veProgressScore').textContent     = total.toFixed(1) + '/' + VE_MAX_POINTS;
      progressCard.style.display = 'block';
    } else {
      progressCard.style.display = 'none';
    }
  }
}

function veStartExam(mode) {
  veState.mode          = mode;
  veState.started       = true;
  veState.currentIndex  = 0;
  veState.answers       = Array.from({ length: VE_TOTAL_QUESTIONS }, () => ({
    selectedAnswer: null,
    architecture: { services: [], connections: [] },
    answerScore: 0,
    archScore: 0,
    totalScore: 0,
    checked: false,
    flagged: false
  }));
  veState.flagged       = new Set();
  veState.skipped       = new Set();
  veState.startTime     = Date.now();
  veState.pausesUsed    = 0;
  veState.paused        = false;

  if (mode === 'timed') {
    veState.timeRemaining = VE_TIMED_SECONDS;
    veStartTimer();
  }

  document.getElementById('veStartScreen').style.display   = 'none';
  document.getElementById('veQuestionArea').style.display  = 'block';
  document.getElementById('veResultsScreen').style.display = 'none';
  document.getElementById('veTimerBar').style.display      = mode === 'timed' ? 'flex' : 'none';
  document.getElementById('vePauseBtnWrap').style.display  = mode === 'timed' ? 'inline-block' : 'none';

  veLoadQuestion(0);
  veUpdateProgress();
}

// ==================== TIMER ====================

function veStartTimer() {
  clearInterval(veState.timerInterval);
  veState.timerInterval = setInterval(() => {
    if (veState.paused) return;
    veState.timeRemaining--;
    veRenderTimer();
    if (veState.timeRemaining <= 0) {
      clearInterval(veState.timerInterval);
      veFinishExam();
    }
  }, 1000);
}

function veRenderTimer() {
  const el = document.getElementById('veTimerDisplay');
  if (!el) return;
  const m  = Math.floor(veState.timeRemaining / 60);
  const s  = veState.timeRemaining % 60;
  el.textContent = String(m).padStart(3, '0') + ':' + String(s).padStart(2, '0');
  el.className = 've-timer-display';
  if (veState.timeRemaining <= VE_TIMER_CRITICAL_MINS * 60) el.classList.add('ve-timer-red');
  else if (veState.timeRemaining <= VE_TIMER_WARNING_MINS * 60) el.classList.add('ve-timer-yellow');
}

function vePauseExam() {
  if (veState.mode !== 'timed') return;
  if (!veState.paused) {
    if (veState.pausesUsed >= VE_MAX_PAUSES) {
      alert('Maximum pauses (' + VE_MAX_PAUSES + ') used.');
      return;
    }
    veState.paused     = true;
    veState.pauseStart = Date.now();
    veState.pausesUsed++;
    document.getElementById('vePauseBtn').textContent = '▶ Resume';
    document.getElementById('vePauseOverlay').style.display = 'flex';
    // Auto-resume after VE_PAUSE_SECS
    setTimeout(() => {
      if (veState.paused) veResumeExam();
    }, VE_PAUSE_SECS * 1000);
  } else {
    veResumeExam();
  }
}

function veResumeExam() {
  veState.paused = false;
  document.getElementById('vePauseBtn').textContent = '⏸ Pause';
  document.getElementById('vePauseOverlay').style.display = 'none';
}

// ==================== QUESTION LOADING ====================

function veLoadQuestion(index) {
  const q = VISUAL_EXAM_QUESTIONS[index];
  if (!q) return;

  veState.currentIndex  = index;
  veState.checked       = false;
  veState.selectedAnswer = veState.answers[index].selectedAnswer;

  // Restore or clear canvas
  veClearCanvas();

  // If previously checked, restore the canvas services from saved state
  const saved = veState.answers[index];
  if (saved.checked && saved.architecture.services.length > 0) {
    const spacingX = 150, spacingY = 130;
    saved.architecture.services.forEach((sid, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      vePlaceServiceOnCanvas(sid, 40 + col * spacingX, 40 + row * spacingY);
    });
  }

  // Populate question UI
  document.getElementById('veQuestionNum').textContent = 'Question ' + (index + 1) + ' of ' + VE_TOTAL_QUESTIONS;
  document.getElementById('veCategory').textContent = formatVECategory(q.cat);
  document.getElementById('veQuestionText').textContent = q.q;

  // Render answer options
  const optContainer = document.getElementById('veOptions');
  optContainer.innerHTML = q.options.map((opt, i) => `
    <label class="ve-option ${veState.selectedAnswer === i ? 've-option-selected' : ''}" data-idx="${i}">
      <input type="radio" name="veAnswer" value="${i}" ${veState.selectedAnswer === i ? 'checked' : ''}
             onchange="veSelectAnswer(${i})" ${saved.checked ? 'disabled' : ''}>
      <span class="ve-option-text">${opt}</span>
    </label>
  `).join('');

  // Canvas instruction
  const selLabel = veState.selectedAnswer !== null
    ? 'option ' + ['A', 'B', 'C', 'D'][veState.selectedAnswer]
    : 'your selected answer';
  document.getElementById('veCanvasInstruction').textContent =
    'Build the architecture for ' + selLabel + ':';

  // Feedback
  const fb = document.getElementById('veFeedback');
  fb.style.display = 'none';
  fb.innerHTML = '';

  // Flag state
  document.getElementById('veFlagBtn').classList.toggle('ve-flagged', veState.flagged.has(index));

  // Check / Next buttons
  document.getElementById('veCheckBtn').disabled  = saved.checked;
  document.getElementById('veCheckBtn').textContent = saved.checked ? '✅ Checked' : '✅ Check Answer & Architecture';

  // Prev button
  const prevBtn = document.getElementById('vePrevBtn');
  prevBtn.style.display = (veState.mode === 'practice' && index > 0) ? 'inline-flex' : 'none';

  // Show results if already checked
  if (saved.checked) veShowFeedback(index, false);

  veUpdateProgress();
  veRenderVEPalette();
}

function formatVECategory(cat) {
  const map = {
    'design-resilient':   '🛡️ Resilient Architectures',
    'design-secure':      '🔐 Secure Architectures',
    'design-performant':  '⚡ High-Performing Architectures',
    'design-cost':        '💰 Cost-Optimized Architectures'
  };
  return map[cat] || cat;
}

// ==================== ANSWER SELECTION ====================

function veSelectAnswer(idx) {
  if (veState.answers[veState.currentIndex].checked) return;
  veState.selectedAnswer = idx;
  veState.answers[veState.currentIndex].selectedAnswer = idx;

  // Update option styles
  document.querySelectorAll('.ve-option').forEach((el, i) => {
    el.classList.toggle('ve-option-selected', i === idx);
  });

  // Update canvas instruction
  document.getElementById('veCanvasInstruction').textContent =
    'Build the architecture for option ' + ['A', 'B', 'C', 'D'][idx] + ':';

  veSaveSession();
}

// ==================== ARCHITECTURE VALIDATION ====================

function veValidateArchitecture(questionIdx) {
  const q    = VISUAL_EXAM_QUESTIONS[questionIdx];
  const sel  = veState.answers[questionIdx].selectedAnswer;
  if (sel === null || !q.architectures || !q.architectures[sel]) {
    return { score: 0, feedback: ['No answer selected or architecture data missing.'], partial: false };
  }

  const expected       = q.architectures[sel];
  const placedIds      = veState.placedServices.map(p => p.serviceId);
  const connPairs      = veState.connections.map(c => {
    const f = veState.placedServices.find(p => p.instanceId === c.fromInstanceId);
    const t = veState.placedServices.find(p => p.instanceId === c.toInstanceId);
    return f && t ? { from: f.serviceId, to: t.serviceId } : null;
  }).filter(Boolean);

  let score    = 0;
  const issues = [];

  // 40% — required services present
  const missing = (expected.requiredServices || []).filter(sid => !placedIds.includes(sid));
  if (missing.length === 0) {
    score += 0.4;
  } else {
    const names = missing.map(sid => (AWS_SERVICES[sid] ? AWS_SERVICES[sid].name : sid));
    issues.push('Missing service' + (names.length > 1 ? 's' : '') + ': <strong>' + names.join(', ') + '</strong>');
  }

  // 40% — required connections present
  const missingConns = (expected.requiredConnections || []).filter(req =>
    !connPairs.some(p =>
      (p.from === req.from && p.to === req.to) ||
      (p.from === req.to   && p.to === req.from)
    )
  );
  if (missingConns.length === 0) {
    score += 0.4;
  } else {
    const connNames = missingConns.map(c => {
      const fn = AWS_SERVICES[c.from] ? AWS_SERVICES[c.from].name : c.from;
      const tn = AWS_SERVICES[c.to]   ? AWS_SERVICES[c.to].name   : c.to;
      return '<em>' + fn + ' → ' + tn + '</em>';
    });
    issues.push('Missing connection' + (connNames.length > 1 ? 's' : '') + ': ' + connNames.join(', '));
  }

  // 20% bonus — has at least one service placed AND at least one connection
  if (placedIds.length > 0 && connPairs.length > 0) score += 0.2;

  score = Math.min(score, 1.0);

  return {
    score:    Math.round(score * 10) / 10,
    feedback: issues,
    partial:  score > 0 && score < 1
  };
}

// ==================== CHECK ANSWER ====================

function veCheckAnswer() {
  const idx = veState.currentIndex;
  const q   = VISUAL_EXAM_QUESTIONS[idx];
  const ans = veState.answers[idx];

  if (ans.selectedAnswer === null) {
    veSetFeedback('warning', '⚠️ Please select an answer (A, B, C, or D) before checking.');
    return;
  }

  // Score answer
  const answerCorrect  = ans.selectedAnswer === q.answer;
  ans.answerScore      = answerCorrect ? 1 : 0;

  // Score architecture
  const archResult     = veValidateArchitecture(idx);
  ans.archScore        = archResult.score;
  ans.totalScore       = ans.answerScore + ans.archScore;
  ans.checked          = true;

  // Save architecture snapshot
  ans.architecture = {
    services:     veState.placedServices.map(p => p.serviceId),
    connections:  veState.connections.map(c => ({ from: c.fromInstanceId, to: c.toInstanceId }))
  };

  // Disable options
  document.querySelectorAll('input[name="veAnswer"]').forEach(r => r.disabled = true);
  document.getElementById('veCheckBtn').disabled   = true;
  document.getElementById('veCheckBtn').textContent = '✅ Checked';

  veState.checked = true;
  veShowFeedback(idx, true);
  veUpdateProgress();
  veSaveSession();
}

function veShowFeedback(idx, animate) {
  const q   = VISUAL_EXAM_QUESTIONS[idx];
  const ans = veState.answers[idx];
  const sel = ans.selectedAnswer;

  const ansCorrect  = ans.answerScore === 1;
  const archScore   = ans.archScore;
  const total       = ans.totalScore;

  const archLabel = archScore >= 1.0  ? '✅ Correct' :
                    archScore >= 0.8  ? '⚠️ Mostly Correct' :
                    archScore >= 0.5  ? '⚠️ Partial' :
                    archScore >  0    ? '⚠️ Minimal' :
                                        '❌ Incorrect';

  const correctArchData = q.architectures && q.architectures[q.answer];
  const archFeedback = q.architectures && sel !== null && q.architectures[sel]
    ? q.architectures[sel].feedback
    : '';

  // Re-validate to get issue list
  const archValidation = veValidateArchitecture(idx);

  // Build side-by-side architecture diagrams
  const userServices    = veState.placedServices.map(p => p.serviceId);
  const correctServices = correctArchData ? (correctArchData.requiredServices || []) : [];
  const missingServices = correctServices.filter(s => !userServices.includes(s));

  const userDiagram    = veRenderArchDiagram(
    { services: userServices, connections: veState.connections.map(c => ({ from: c.fromInstanceId, to: c.toInstanceId })) },
    missingServices,
    false
  );
  const correctDiagram = veRenderArchDiagram(
    correctArchData
      ? { services: correctArchData.requiredServices || [], connections: correctArchData.requiredConnections || [] }
      : { services: [], connections: [] },
    missingServices,
    true
  );

  const html = `
    <div class="ve-feedback-inner">
      <div class="ve-fb-header">📊 Question ${idx + 1} Results — ${total.toFixed(1)}/2 points (${Math.round(total / 2 * 100)}%)</div>

      <div class="ve-fb-row ${ansCorrect ? 've-fb-correct' : 've-fb-wrong'}">
        ${ansCorrect ? '✅' : '❌'} <strong>Answer Selection:</strong>
        ${ansCorrect ? 'CORRECT' : 'INCORRECT'} (${ans.answerScore}/1 point)<br>
        You selected: <strong>${q.options[sel]}</strong><br>
        ${!ansCorrect ? 'Correct answer: <strong>' + q.options[q.answer] + '</strong>' : ''}
      </div>

      <div class="ve-fb-row ${archScore >= 1 ? 've-fb-correct' : archScore >= 0.5 ? 've-fb-partial' : 've-fb-wrong'}">
        ${archScore >= 1 ? '✅' : archScore >= 0.5 ? '⚠️' : '❌'} <strong>Architecture Build:</strong>
        ${archLabel} (${archScore.toFixed(1)}/1 point)<br>
        ${archValidation.feedback.length > 0 ? archValidation.feedback.map(f => '• ' + f).join('<br>') : ''}
        ${archFeedback ? '<br><em>' + archFeedback + '</em>' : ''}
      </div>

      <div class="ve-arch-comparison">
        <div class="ve-arch-panel">
          <div class="ve-arch-panel-title">🖊️ Your Architecture</div>
          ${userDiagram}
          ${missingServices.length > 0 ? '<div class="ve-arch-missing">❌ Missing: ' + missingServices.map(s => veEscapeHtml(AWS_SERVICES[s] ? AWS_SERVICES[s].name : s)).join(', ') + '</div>' : '<div class="ve-arch-ok">✅ All required services placed</div>'}
        </div>
        <div class="ve-arch-panel">
          <div class="ve-arch-panel-title">✅ Correct Architecture</div>
          ${correctDiagram}
          <div class="ve-arch-ok" style="color:var(--muted);font-size:.8rem">Required services shown above</div>
        </div>
      </div>

      <div class="ve-fb-explain">
        <strong>💡 Explanation:</strong><br>${q.explain}
      </div>
    </div>
  `;

  const fb = document.getElementById('veFeedback');
  fb.innerHTML = html;
  fb.style.display = 'block';
  if (animate) fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Escape a string for safe use inside SVG/HTML text content.
 */
function veEscapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Render a mini architecture diagram as an HTML string.
 * @param {object} archData       - { services: string[], connections: {from,to}[] }
 * @param {Array}  missingServices - services to highlight as missing (red)
 * @param {boolean} isCorrect     - if true, show all services as green
 * @returns {string} HTML string containing the diagram
 */
function veRenderArchDiagram(archData, missingServices, isCorrect) {
  if (!archData || !archData.services || archData.services.length === 0) {
    return '<div class="ve-arch-empty">No services placed</div>';
  }
  const missing = new Set(missingServices || []);
  const svcs    = archData.services;
  const conns   = archData.connections || [];

  // Layout: arrange services in a grid (up to 4 per row)
  const cols      = Math.min(4, svcs.length);
  const rows      = Math.ceil(svcs.length / cols);
  const cellW     = 64;
  const cellH     = 72;
  const padding   = 12;
  const svgW      = cols * cellW + padding * 2;
  const svgH      = rows * cellH + padding * 2;

  // Compute service positions
  const positions = {};
  svcs.forEach((sid, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions[sid] = {
      x: padding + col * cellW + cellW / 2,
      y: padding + row * cellH + 24
    };
  });

  // Draw service nodes
  let nodesHtml = '';
  svcs.forEach((sid, i) => {
    const svc = AWS_SERVICES[sid];
    if (!svc) return;
    const pos = positions[sid];
    const isMissing   = !isCorrect && missing.has(sid);
    const isHighlight = isCorrect && missing.has(sid);
    const opacity = isMissing ? '0.35' : '1';
    const labelColor = isMissing ? '#ef4444' : isHighlight ? '#22c55e' : svc.color;
    const borderColor = isMissing ? '#ef4444' : isHighlight ? '#22c55e' : svc.color;
    nodesHtml += `
      <g opacity="${opacity}">
        <circle cx="${pos.x}" cy="${pos.y}" r="20" fill="${borderColor}22" stroke="${borderColor}" stroke-width="1.5"/>
        <text x="${pos.x}" y="${pos.y + 4}" text-anchor="middle" font-size="14">${veEscapeHtml(svc.emoji || '☁️')}</text>
        <text x="${pos.x}" y="${pos.y + 32}" text-anchor="middle" font-size="7" fill="${labelColor}" font-weight="600">${veEscapeHtml(svc.name.length > 10 ? svc.name.substring(0, 10) + '\u2026' : svc.name)}</text>
        ${isMissing ? '<text x="' + pos.x + '" y="' + (pos.y - 24) + '" text-anchor="middle" font-size="9" fill="#ef4444">❌</text>' : ''}
        ${isHighlight ? '<text x="' + pos.x + '" y="' + (pos.y - 24) + '" text-anchor="middle" font-size="9" fill="#22c55e">✅</text>' : ''}
      </g>`;
  });

  // Draw connections using IDs (for user arch) or service names (for correct arch)
  let connLines = '';
  conns.forEach(conn => {
    // For correct architecture, conn.from/to are service IDs
    // For user architecture, they may be instance IDs — map back to serviceId
    let fromSid = conn.from;
    let toSid   = conn.to;
    if (!positions[fromSid]) {
      const inst = veState.placedServices.find(p => p.instanceId === conn.from);
      if (inst) fromSid = inst.serviceId;
    }
    if (!positions[toSid]) {
      const inst = veState.placedServices.find(p => p.instanceId === conn.to);
      if (inst) toSid = inst.serviceId;
    }
    const fromPos = positions[fromSid];
    const toPos   = positions[toSid];
    if (!fromPos || !toPos) return;
    const mx = (fromPos.x + toPos.x) / 2;
    const my = (fromPos.y + toPos.y) / 2 - 15;
    connLines += `<path d="M ${fromPos.x} ${fromPos.y} Q ${mx} ${my} ${toPos.x} ${toPos.y}"
      stroke="#0073BB" stroke-width="1.5" fill="none" marker-end="url(#ve-mini-arrow)" opacity="0.7"/>`;
  });

  return `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" class="ve-arch-svg">
    <defs>
      <marker id="ve-mini-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
        <polygon points="0 0, 6 2.5, 0 5" fill="#0073BB"/>
      </marker>
    </defs>
    ${connLines}
    ${nodesHtml}
  </svg>`;
}

function veSetFeedback(type, msg) {
  const fb = document.getElementById('veFeedback');
  fb.innerHTML = '<div class="ve-fb-' + type + '">' + msg + '</div>';
  fb.style.display = 'block';
}

// ==================== NAVIGATION ====================

function veNextQuestion() {
  if (veState.currentIndex < VE_TOTAL_QUESTIONS - 1) {
    veLoadQuestion(veState.currentIndex + 1);
  } else {
    veFinishExam();
  }
}

function vePrevQuestion() {
  if (veState.mode === 'practice' && veState.currentIndex > 0) {
    veLoadQuestion(veState.currentIndex - 1);
  }
}

function veSkipQuestion() {
  veState.skipped.add(veState.currentIndex);
  veNextQuestion();
}

function veToggleFlag() {
  const idx = veState.currentIndex;
  if (veState.flagged.has(idx)) {
    veState.flagged.delete(idx);
    veState.answers[idx].flagged = false;
  } else {
    veState.flagged.add(idx);
    veState.answers[idx].flagged = true;
  }
  document.getElementById('veFlagBtn').classList.toggle('ve-flagged', veState.flagged.has(idx));
  veUpdateProgress();
}

// ==================== PROGRESS ====================

function veUpdateProgress() {
  const answered = veState.answers.filter(a => a.checked).length;
  const totalPoints = veState.answers.reduce((s, a) => s + a.totalScore, 0);
  const maxSoFar    = answered * 2;
  const accuracy    = maxSoFar > 0 ? Math.round(totalPoints / maxSoFar * 100) : 0;

  document.getElementById('veProgressAnswered').textContent = answered + '/' + VE_TOTAL_QUESTIONS;
  document.getElementById('veProgressScore').textContent    = totalPoints.toFixed(1) + '/' + (answered * 2);
  document.getElementById('veProgressAccuracy').textContent = accuracy + '%';
  document.getElementById('veProgressFlagged').textContent  = veState.flagged.size;
  document.getElementById('veProgressSkipped').textContent  = veState.skipped.size;
}

// ==================== FINISH ====================

function veFinishExam() {
  clearInterval(veState.timerInterval);
  veState.started = false;

  const totalScore     = veState.answers.reduce((s, a) => s + a.totalScore, 0);
  const answerCorrect  = veState.answers.filter(a => a.answerScore === 1).length;
  const archFull       = veState.answers.filter(a => a.archScore >= 1).length;
  const passed         = totalScore >= VE_PASS_POINTS;
  const pct            = Math.round(totalScore / VE_MAX_POINTS * 100);

  // Category breakdown
  const cats = {};
  VISUAL_EXAM_QUESTIONS.forEach((q, i) => {
    if (!cats[q.cat]) cats[q.cat] = { correct: 0, partial: 0, wrong: 0, total: 0 };
    const a = veState.answers[i];
    cats[q.cat].total++;
    if (a.totalScore >= 2)        cats[q.cat].correct++;
    else if (a.totalScore >= 1)   cats[q.cat].partial++;
    else                           cats[q.cat].wrong++;
  });

  // Show results
  document.getElementById('veStartScreen').style.display   = 'none';
  document.getElementById('veQuestionArea').style.display  = 'none';
  document.getElementById('veResultsScreen').style.display = 'block';
  document.getElementById('veTimerBar').style.display      = 'none';

  document.getElementById('veResult_score').textContent  = totalScore.toFixed(1) + ' / ' + VE_MAX_POINTS;
  document.getElementById('veResult_pct').textContent    = pct + '%';
  document.getElementById('veResult_status').textContent = passed ? '✅ PASS' : '❌ FAIL';
  document.getElementById('veResult_status').className   = passed ? 've-result-pass' : 've-result-fail';
  document.getElementById('veResult_ansAcc').textContent = answerCorrect + '/' + VE_TOTAL_QUESTIONS + ' (' + Math.round(answerCorrect / VE_TOTAL_QUESTIONS * 100) + '%)';
  document.getElementById('veResult_archAcc').textContent = archFull + '/' + VE_TOTAL_QUESTIONS + ' (' + Math.round(archFull / VE_TOTAL_QUESTIONS * 100) + '%)';
  const passNote = document.getElementById('veResultPassNote');
  if (passNote) passNote.textContent = VE_PASS_POINTS + ' pts (' + Math.round(VE_PASS_POINTS / VE_MAX_POINTS * 100) + '%)';

  // Category table
  const catNames = {
    'design-resilient':   'Resilient Architectures',
    'design-secure':      'Secure Architectures',
    'design-performant':  'High-Performing Architectures',
    'design-cost':        'Cost-Optimized Architectures'
  };
  const tbody = document.getElementById('veResult_catTable');
  tbody.innerHTML = Object.entries(cats).map(([cat, d]) => `
    <tr>
      <td>${catNames[cat] || cat}</td>
      <td style="color:var(--success);text-align:center">${d.correct}</td>
      <td style="color:var(--warning);text-align:center">${d.partial}</td>
      <td style="color:var(--danger);text-align:center">${d.wrong}</td>
    </tr>
  `).join('');

  // Save to history
  veSaveHistory({ totalScore, pct, passed, answerCorrect, archFull, cats, mode: veState.mode });
}

// ==================== LOCALSTORAGE ====================

function veSaveSession() {
  try {
    const data = {
      mode:          veState.mode,
      currentIndex:  veState.currentIndex,
      answers:       veState.answers,
      flagged:       Array.from(veState.flagged),
      skipped:       Array.from(veState.skipped),
      timeRemaining: veState.timeRemaining,
      startTime:     veState.startTime
    };
    localStorage.setItem('awsprep_visual_exam_session', JSON.stringify(data));
  } catch (e) { /* ignore storage errors */ }
}

function veLoadSession() {
  try {
    const raw = localStorage.getItem('awsprep_visual_exam_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function veClearSession() {
  localStorage.removeItem('awsprep_visual_exam_session');
}

function veSaveHistory(result) {
  try {
    const history = JSON.parse(localStorage.getItem('awsprep_visual_exam_history') || '[]');
    history.unshift({ date: Date.now(), ...result });
    localStorage.setItem('awsprep_visual_exam_history', JSON.stringify(history.slice(0, 10)));
  } catch (e) { /* ignore */ }
}

function veRestoreSession() {
  const saved = veLoadSession();
  if (!saved || !saved.mode) return false;
  veState.mode          = saved.mode;
  veState.started       = true;
  veState.currentIndex  = saved.currentIndex || 0;
  veState.answers       = saved.answers || Array.from({ length: VE_TOTAL_QUESTIONS }, () => ({
    selectedAnswer: null, architecture: { services: [], connections: [] },
    answerScore: 0, archScore: 0, totalScore: 0, checked: false, flagged: false
  }));
  veState.flagged       = new Set(saved.flagged || []);
  veState.skipped       = new Set(saved.skipped || []);
  veState.timeRemaining = saved.timeRemaining || VE_TIMED_SECONDS;
  veState.startTime     = saved.startTime || Date.now();
  return true;
}

function veResumeSession() {
  if (!veRestoreSession()) return;
  document.getElementById('veStartScreen').style.display   = 'none';
  document.getElementById('veQuestionArea').style.display  = 'block';
  document.getElementById('veResultsScreen').style.display = 'none';
  const mode = veState.mode;
  document.getElementById('veTimerBar').style.display     = mode === 'timed' ? 'flex' : 'none';
  document.getElementById('vePauseBtnWrap').style.display = mode === 'timed' ? 'inline-block' : 'none';
  if (mode === 'timed') veStartTimer();
  veLoadQuestion(veState.currentIndex);
  veUpdateProgress();
}

// ==================== HINT ====================

function veShowHint() {
  const idx = veState.currentIndex;
  const q   = VISUAL_EXAM_QUESTIONS[idx];
  const sel = veState.answers[idx].selectedAnswer;
  if (sel === null) {
    veSetFeedback('warning', '💡 Hint: Select an answer first, then build its architecture on the canvas.');
    return;
  }
  const arch = q.architectures && q.architectures[sel];
  if (!arch) { veSetFeedback('warning', '💡 No hint available for this option.'); return; }
  const svcs = (arch.requiredServices || []).map(sid => AWS_SERVICES[sid] ? AWS_SERVICES[sid].name : sid);
  veSetFeedback('hint', '💡 <strong>Hint:</strong> For option ' + ['A','B','C','D'][sel] +
    ', try adding these services: <strong>' + svcs.join(', ') + '</strong>.');
}

// ==================== CANVAS (VE-specific) ====================

function veSetupCanvasDrop() {
  const canvas = veState.canvasEl;
  if (!canvas) return;
  canvas.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
  canvas.addEventListener('drop', e => {
    e.preventDefault();
    const serviceId = e.dataTransfer.getData('serviceId');
    if (!serviceId || !AWS_SERVICES[serviceId]) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left - VE_ICON_OFFSET) / veState.zoom);
    const y = Math.round((e.clientY - rect.top  - VE_ICON_OFFSET) / veState.zoom);
    vePlaceServiceOnCanvas(serviceId, Math.max(0, x), Math.max(0, y));
  });
}

function vePlaceServiceOnCanvas(serviceId, x, y) {
  const svc = AWS_SERVICES[serviceId];
  if (!svc) return;
  const instanceId = 've_inst_' + (veState.nextInstanceId++);
  const sx = Math.round(x / VE_CANVAS_GRID) * VE_CANVAS_GRID;
  const sy = Math.round(y / VE_CANVAS_GRID) * VE_CANVAS_GRID;
  veState.placedServices.push({ instanceId, serviceId, x: sx, y: sy });
  veRenderCanvasService(instanceId, serviceId, sx, sy);
  veRenderConnections();
}

function veAddServiceToCenter(serviceId) {
  const canvas = veState.canvasEl;
  if (!canvas) return;
  const cx = Math.round(canvas.offsetWidth  / 2 / veState.zoom) - VE_ICON_OFFSET;
  const cy = Math.round(canvas.offsetHeight / 2 / veState.zoom) - VE_ICON_OFFSET;
  const spread = veState.placedServices.length * 20;
  vePlaceServiceOnCanvas(serviceId, cx + spread, cy + spread);
}

function veRenderCanvasService(instanceId, serviceId, x, y) {
  const svc = AWS_SERVICES[serviceId];
  if (!svc || !veState.canvasEl) return;
  const el = document.createElement('div');
  el.className = 'arch-canvas-service';
  el.id        = instanceId;
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  el.dataset.instanceId = instanceId;
  el.dataset.serviceId  = serviceId;
  el.innerHTML = `
    <div class="arch-svc-icon" style="color:${svc.color}">
      <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">${svc.svg}</svg>
    </div>
    <div class="arch-svc-label">${svc.name}</div>
    <button class="arch-svc-remove" onclick="veRemoveService('${instanceId}')" title="Remove" aria-label="Remove ${svc.name}">✕</button>
  `;
  el.addEventListener('click', e => {
    if (e.target.classList.contains('arch-svc-remove')) return;
    veHandleServiceClick(instanceId);
  });
  veMakeDraggable(el);
  veState.canvasEl.appendChild(el);
}

function veMakeDraggable(el) {
  let dragging = false, offX = 0, offY = 0;
  el.addEventListener('mousedown', e => {
    if (e.target.classList.contains('arch-svc-remove')) return;
    if (veState.connectingFrom) return;
    dragging = true;
    const rect = el.getBoundingClientRect();
    offX = e.clientX - rect.left;
    offY = e.clientY - rect.top;
    el.style.zIndex = '100';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const cr = veState.canvasEl.getBoundingClientRect();
    let nx = (e.clientX - cr.left - offX) / veState.zoom;
    let ny = (e.clientY - cr.top  - offY) / veState.zoom;
    nx = Math.round(nx / VE_CANVAS_GRID) * VE_CANVAS_GRID;
    ny = Math.round(ny / VE_CANVAS_GRID) * VE_CANVAS_GRID;
    nx = Math.max(0, nx); ny = Math.max(0, ny);
    el.style.left = nx + 'px';
    el.style.top  = ny + 'px';
    const inst = veState.placedServices.find(p => p.instanceId === el.dataset.instanceId);
    if (inst) { inst.x = nx; inst.y = ny; }
    veRenderConnections();
  });
  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; el.style.zIndex = ''; }
  });
}

function veRemoveService(instanceId) {
  veState.connections = veState.connections.filter(
    c => c.fromInstanceId !== instanceId && c.toInstanceId !== instanceId
  );
  veState.placedServices = veState.placedServices.filter(p => p.instanceId !== instanceId);
  const el = document.getElementById(instanceId);
  if (el) el.remove();
  if (veState.connectingFrom === instanceId) {
    veState.connectingFrom = null;
    veUpdateConnectUI();
  }
  veRenderConnections();
}

function veHandleServiceClick(instanceId) {
  if (!veState.connectingFrom) {
    veState.connectingFrom = instanceId;
    veUpdateConnectUI();
    const el = document.getElementById(instanceId);
    if (el) el.classList.add('arch-connecting-source');
  } else if (veState.connectingFrom === instanceId) {
    veState.connectingFrom = null;
    veUpdateConnectUI();
    document.querySelectorAll('#veCanvasInner .arch-canvas-service').forEach(e => e.classList.remove('arch-connecting-source'));
  } else {
    const from = veState.connectingFrom;
    const to   = instanceId;
    veState.connectingFrom = null;
    veUpdateConnectUI();
    document.querySelectorAll('#veCanvasInner .arch-canvas-service').forEach(e => e.classList.remove('arch-connecting-source'));
    const exists = veState.connections.some(c => c.fromInstanceId === from && c.toInstanceId === to);
    if (!exists) {
      veState.connections.push({ id: 've_conn_' + Date.now(), fromInstanceId: from, toInstanceId: to });
      veRenderConnections();
    }
  }
}

function veUpdateConnectUI() {
  const hint = document.getElementById('veConnectHint');
  if (hint) hint.style.display = veState.connectingFrom ? 'block' : 'none';
  if (veState.canvasEl) {
    veState.canvasEl.style.cursor = veState.connectingFrom ? 'crosshair' : '';
  }
}

function veRenderConnections() {
  const svg    = veState.svgEl;
  const canvas = veState.canvasEl;
  if (!svg || !canvas) return;

  svg.setAttribute('width',  canvas.offsetWidth);
  svg.setAttribute('height', canvas.offsetHeight);
  svg.innerHTML = '';

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="ve-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#0073BB"/>
    </marker>`;
  svg.appendChild(defs);

  veState.connections.forEach(conn => {
    const fromEl = document.getElementById(conn.fromInstanceId);
    const toEl   = document.getElementById(conn.toInstanceId);
    if (!fromEl || !toEl) return;
    const fr  = fromEl.getBoundingClientRect();
    const tr  = toEl.getBoundingClientRect();
    const cr  = canvas.getBoundingClientRect();
    const x1  = (fr.left + fr.width  / 2 - cr.left) / veState.zoom;
    const y1  = (fr.top  + fr.height / 2 - cr.top)  / veState.zoom;
    const x2  = (tr.left + tr.width  / 2 - cr.left) / veState.zoom;
    const y2  = (tr.top  + tr.height / 2 - cr.top)  / veState.zoom;
    const cx  = (x1 + x2) / 2;
    const cy  = (y1 + y2) / 2 - VE_CONNECTION_CURVE_OFFSET;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
    line.setAttribute('stroke', '#0073BB');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('fill', 'none');
    line.setAttribute('marker-end', 'url(#ve-arrow)');
    line.setAttribute('data-conn-id', conn.id);
    line.style.cursor = 'pointer';
    line.addEventListener('click', () => veRemoveConnection(conn.id));
    svg.appendChild(line);
  });
}

function veRemoveConnection(connId) {
  veState.connections = veState.connections.filter(c => c.id !== connId);
  veRenderConnections();
}

function veClearCanvas() {
  veState.placedServices = [];
  veState.connections    = [];
  veState.connectingFrom = null;
  if (veState.canvasEl) {
    veState.canvasEl.querySelectorAll('.arch-canvas-service').forEach(el => el.remove());
  }
  veRenderConnections();
  veUpdateConnectUI();
}

function veZoom(delta) {
  veState.zoom = Math.max(0.5, Math.min(2, veState.zoom + delta));
  const inner = document.getElementById('veCanvasInner');
  if (inner) {
    inner.style.transform       = `scale(${veState.zoom})`;
    inner.style.transformOrigin = 'top left';
  }
  const pct = document.getElementById('veZoomPct');
  if (pct) pct.textContent = Math.round(veState.zoom * 100) + '%';
  veRenderConnections();
}

// ==================== PALETTE (VE-specific) ====================

function veRenderVEPalette(filter) {
  const container = document.getElementById('vePalette');
  if (!container) return;
  const filterLower = filter ? filter.toLowerCase() : '';

  let html = '';
  SERVICE_CATEGORIES.forEach(cat => {
    const svcs = cat.services.filter(sid => {
      const svc = AWS_SERVICES[sid];
      if (!svc) return false;
      if (filterLower && !svc.name.toLowerCase().includes(filterLower) && !svc.id.toLowerCase().includes(filterLower)) return false;
      return true;
    });
    if (svcs.length === 0) return;
    html += `<div class="arch-palette-category" id="veCat_${cat.id}">
      <div class="arch-palette-cat-header" onclick="veTogglePaletteCat('${cat.id}')" style="border-left:3px solid ${cat.color}">
        <span style="font-weight:700;color:${cat.color}">${cat.label}</span>
        <span class="arch-cat-toggle">▾</span>
      </div>
      <div class="arch-palette-cat-body" id="veCatBody_${cat.id}">`;
    svcs.forEach(sid => {
      const svc = AWS_SERVICES[sid];
      if (!svc) return;
      html += `<div class="arch-palette-item"
          draggable="true"
          data-service-id="${sid}"
          ondragstart="handlePaletteDragStart(event)"
          ondblclick="veAddServiceToCenter('${sid}')"
          title="${svc.name} — double-click or drag to canvas">
        <div class="arch-palette-icon" style="color:${svc.color}">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">${svc.svg}</svg>
        </div>
        <div class="arch-palette-label">${svc.name}</div>
      </div>`;
    });
    html += '</div></div>';
  });
  container.innerHTML = html || '<div style="padding:1rem;color:var(--muted);text-align:center">No services found</div>';
}

function veTogglePaletteCat(catId) {
  const body   = document.getElementById('veCatBody_' + catId);
  const toggle = document.querySelector('#veCat_' + catId + ' .arch-cat-toggle');
  if (!body) return;
  const collapsed = body.style.display === 'none';
  body.style.display   = collapsed ? '' : 'none';
  if (toggle) toggle.textContent = collapsed ? '▾' : '▸';
}

function veFilterPalette() {
  const val = document.getElementById('veSearchInput') ? document.getElementById('veSearchInput').value : '';
  veRenderVEPalette(val);
}

// ==================== RETURN TO DASHBOARD ====================

function veReturnToDashboard() {
  clearInterval(veState.timerInterval);
  document.querySelector('[data-tab="dashboard"]').click();
}

function veRestartExam() {
  clearInterval(veState.timerInterval);
  veClearSession();
  veState.started = false;
  veShowStartScreen();
}
