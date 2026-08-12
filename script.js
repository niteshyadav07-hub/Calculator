// ===== DOM Elements =====
const displayExpression = document.getElementById('display-expression');
const displayResult = document.getElementById('display-result');
const display = document.getElementById('display');
const calculator = document.getElementById('calculator');
const scientificPanel = document.getElementById('scientific-panel');
const modeSlider = document.getElementById('mode-slider');
const btnStandard = document.getElementById('btn-standard');
const btnScientific = document.getElementById('btn-scientific');
const historyToggle = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const historyClear = document.getElementById('history-clear');

// ===== State =====
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;
let expression = '';
let history = [];

// ===== Initialization =====
document.querySelectorAll('.calc-btn').forEach(btn => {
  btn.addEventListener('click', handleButtonClick);
  btn.addEventListener('mouseenter', handleMouseEnter);
  btn.addEventListener('mouseleave', handleMouseLeave);
});

btnStandard.addEventListener('click', () => switchMode('standard'));
btnScientific.addEventListener('click', () => switchMode('scientific'));
historyToggle.addEventListener('click', toggleHistory);
historyClear.addEventListener('click', clearHistory);
document.addEventListener('keydown', handleKeyboard);

// ===== Mouse tracking for glow effect =====
function handleMouseEnter(e) {
  const btn = e.currentTarget;
  btn.addEventListener('mousemove', trackMouse);
}

function handleMouseLeave(e) {
  const btn = e.currentTarget;
  btn.removeEventListener('mousemove', trackMouse);
}

function trackMouse(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  e.currentTarget.style.setProperty('--x', x + '%');
  e.currentTarget.style.setProperty('--y', y + '%');
}

// ===== Ripple Effect =====
function createRipple(btn, e) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// ===== Mode Switching =====
function switchMode(mode) {
  if (mode === 'scientific') {
    calculator.classList.add('scientific-mode');
    scientificPanel.classList.add('visible');
    modeSlider.classList.add('right');
    btnScientific.classList.add('active');
    btnStandard.classList.remove('active');
  } else {
    calculator.classList.remove('scientific-mode');
    scientificPanel.classList.remove('visible');
    modeSlider.classList.remove('right');
    btnStandard.classList.add('active');
    btnScientific.classList.remove('active');
  }
}

// ===== History =====
function toggleHistory() {
  historyPanel.classList.toggle('open');
  historyToggle.classList.toggle('active');
}

function addToHistory(expr, result) {
  history.unshift({ expression: expr, result: result });
  if (history.length > 20) history.pop();
  renderHistory();
}

function clearHistory() {
  history = [];
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No history yet</p>';
    return;
  }
  historyList.innerHTML = history.map((item, i) => `
    <div class="history-item" data-index="${i}">
      <div class="history-item-expression">${item.expression}</div>
      <div class="history-item-result">= ${item.result}</div>
    </div>
  `).join('');

  historyList.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.index);
      currentInput = history[idx].result;
      expression = '';
      previousInput = '';
      operation = null;
      updateDisplay();
      toggleHistory();
    });
  });
}

// ===== Button Click Handler =====
function handleButtonClick(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  createRipple(btn, e);
  processAction(action);
}

// ===== Process Action =====
function processAction(action) {
  // Numbers
  if (/^[0-9]$/.test(action)) {
    inputNumber(action);
    return;
  }

  switch (action) {
    case 'decimal':
      inputDecimal();
      break;
    case 'clear':
      clearAll();
      break;
    case 'toggle-sign':
      toggleSign();
      break;
    case 'percent':
      percent();
      break;
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      setOperation(action);
      break;
    case 'equals':
      calculate();
      break;
    // Scientific
    case 'sin':
    case 'cos':
    case 'tan':
    case 'log':
    case 'ln':
    case 'sqrt':
    case 'pow':
    case 'factorial':
      scientificOp(action);
      break;
    case 'pi':
      currentInput = Math.PI.toString();
      shouldResetDisplay = true;
      updateDisplay();
      break;
    case 'e':
      currentInput = Math.E.toString();
      shouldResetDisplay = true;
      updateDisplay();
      break;
    case 'open-paren':
      expression += '(';
      displayExpression.textContent = expression;
      break;
    case 'close-paren':
      expression += ')';
      displayExpression.textContent = expression;
      break;
  }
}

// ===== Input Handling =====
function inputNumber(num) {
  if (shouldResetDisplay) {
    currentInput = num;
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput === '0' ? num : currentInput + num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = '0.';
    shouldResetDisplay = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operation = null;
  expression = '';
  shouldResetDisplay = false;
  clearActiveOp();
  updateDisplay();
}

function toggleSign() {
  if (currentInput !== '0') {
    currentInput = currentInput.startsWith('-')
      ? currentInput.slice(1)
      : '-' + currentInput;
    updateDisplay();
  }
}

function percent() {
  const val = parseFloat(currentInput);
  currentInput = (val / 100).toString();
  updateDisplay();
}

// ===== Operations =====
const opSymbols = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷'
};

function setOperation(op) {
  if (operation && !shouldResetDisplay) {
    calculate(true);
  }
  previousInput = currentInput;
  operation = op;
  expression = formatNumber(previousInput) + ' ' + opSymbols[op];
  shouldResetDisplay = true;
  highlightOp(op);
  updateDisplay();
}

function calculate(chaining = false) {
  if (!operation || !previousInput) return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  switch (operation) {
    case 'add': result = prev + curr; break;
    case 'subtract': result = prev - curr; break;
    case 'multiply': result = prev * curr; break;
    case 'divide':
      if (curr === 0) {
        showError('Cannot divide by zero');
        return;
      }
      result = prev / curr;
      break;
  }

  const fullExpression = formatNumber(previousInput) + ' ' + opSymbols[operation] + ' ' + formatNumber(currentInput);
  const resultStr = formatResult(result);

  if (!chaining) {
    expression = fullExpression + ' =';
    addToHistory(fullExpression, resultStr);
  }

  currentInput = resultStr;
  previousInput = '';
  operation = null;
  shouldResetDisplay = true;
  clearActiveOp();
  updateDisplay();

  // Pop animation
  displayResult.classList.add('pop');
  setTimeout(() => displayResult.classList.remove('pop'), 250);
}

// ===== Scientific Operations =====
function scientificOp(action) {
  const val = parseFloat(currentInput);
  let result;
  let exprText = '';

  switch (action) {
    case 'sin':
      result = Math.sin(val * Math.PI / 180);
      exprText = `sin(${formatNumber(currentInput)})`;
      break;
    case 'cos':
      result = Math.cos(val * Math.PI / 180);
      exprText = `cos(${formatNumber(currentInput)})`;
      break;
    case 'tan':
      result = Math.tan(val * Math.PI / 180);
      exprText = `tan(${formatNumber(currentInput)})`;
      break;
    case 'log':
      if (val <= 0) { showError('Invalid input'); return; }
      result = Math.log10(val);
      exprText = `log(${formatNumber(currentInput)})`;
      break;
    case 'ln':
      if (val <= 0) { showError('Invalid input'); return; }
      result = Math.log(val);
      exprText = `ln(${formatNumber(currentInput)})`;
      break;
    case 'sqrt':
      if (val < 0) { showError('Invalid input'); return; }
      result = Math.sqrt(val);
      exprText = `√(${formatNumber(currentInput)})`;
      break;
    case 'pow':
      result = val * val;
      exprText = `(${formatNumber(currentInput)})²`;
      break;
    case 'factorial':
      if (val < 0 || !Number.isInteger(val) || val > 170) {
        showError('Invalid input');
        return;
      }
      result = factorial(val);
      exprText = `${formatNumber(currentInput)}!`;
      break;
  }

  const resultStr = formatResult(result);
  expression = exprText + ' =';
  addToHistory(exprText, resultStr);
  currentInput = resultStr;
  shouldResetDisplay = true;
  updateDisplay();

  displayResult.classList.add('pop');
  setTimeout(() => displayResult.classList.remove('pop'), 250);
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// ===== Display =====
function updateDisplay() {
  displayExpression.textContent = expression;
  displayResult.textContent = formatDisplay(currentInput);

  // Shrink text for long numbers
  if (currentInput.length > 12) {
    displayResult.classList.add('shrink');
  } else {
    displayResult.classList.remove('shrink');
  }
}

function formatDisplay(value) {
  if (value.endsWith('.')) return value;
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (value.includes('.') && !shouldResetDisplay) return value;
  return formatNumber(value);
}

function formatNumber(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (Number.isInteger(num) && Math.abs(num) < 1e15) {
    return num.toLocaleString('en-US');
  }
  return num.toLocaleString('en-US', { maximumFractionDigits: 10 });
}

function formatResult(num) {
  if (!isFinite(num)) return 'Error';
  // Remove floating point artifacts
  const rounded = parseFloat(num.toPrecision(12));
  return rounded.toString();
}

function showError(msg) {
  display.classList.add('error');
  const prevResult = displayResult.textContent;
  displayResult.textContent = msg;
  setTimeout(() => {
    display.classList.remove('error');
    displayResult.textContent = prevResult;
  }, 1200);
}

// ===== Operator Highlight =====
function highlightOp(op) {
  clearActiveOp();
  const opMap = { add: 'btn-add', subtract: 'btn-subtract', multiply: 'btn-multiply', divide: 'btn-divide' };
  const btn = document.getElementById(opMap[op]);
  if (btn) btn.classList.add('active');
}

function clearActiveOp() {
  document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
}

// ===== Keyboard Support =====
function handleKeyboard(e) {
  const key = e.key;

  if (/^[0-9]$/.test(key)) {
    processAction(key);
    animateBtn('btn-' + key);
  } else if (key === '.') {
    processAction('decimal');
    animateBtn('btn-decimal');
  } else if (key === '+') {
    processAction('add');
    animateBtn('btn-add');
  } else if (key === '-') {
    processAction('subtract');
    animateBtn('btn-subtract');
  } else if (key === '*') {
    processAction('multiply');
    animateBtn('btn-multiply');
  } else if (key === '/') {
    e.preventDefault();
    processAction('divide');
    animateBtn('btn-divide');
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    processAction('equals');
    animateBtn('btn-equals');
  } else if (key === 'Escape' || key === 'Delete') {
    processAction('clear');
    animateBtn('btn-clear');
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === '%') {
    processAction('percent');
    animateBtn('btn-percent');
  }
}

function backspace() {
  if (shouldResetDisplay || currentInput.length <= 1 || currentInput === '0') {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function animateBtn(id) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.style.transform = 'scale(0.94)';
  setTimeout(() => { btn.style.transform = ''; }, 120);
}

// ===== Initial Display =====
updateDisplay();
