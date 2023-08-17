'use strict';

const keys = document.querySelector('.calculator-keys');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnBigCloseModal = document.querySelector('.btn-big--close-modal');
const btnOpenModal = document.querySelector('.btn--show-modal');
const btnLog = document.querySelector('.log');
const historyLogModal = document.getElementById('history-log-modal');

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  historyLog: '',
};

const inputDigit = function (digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  }

  if (waitingForSecondOperand === false) {
    calculator.displayValue =
      displayValue === '0' ? digit : displayValue + digit;
  }
};

const inputDecimal = function (dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = '0.';
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (!calculator.displayValue.includes(dot)) calculator.displayValue += dot;
};

const handleOperator = function (nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand === null && !isNaN(inputValue))
    calculator.firstOperand = inputValue;

  if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = result;

    addToHistory(`${result}`);
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
};

const calculate = function (firstOperand, secondOperand, operator) {
  if (operator === '+') return firstOperand + secondOperand;
  if (operator === '-') return firstOperand - secondOperand;
  if (operator === '*') return firstOperand * secondOperand;
  if (operator === '/') return firstOperand / secondOperand;

  return secondOperand;
};

const addToHistory = function (value) {
  if (value !== 'CE' && value !== 'history' && value !== 'backspace') {
    // Exclude needed buttons as per condition logic
    calculator.historyLog += value;
  }
};

const clearEntry = function () {
  calculator.historyLog = '';
  updateDisplay();
};

const resetCalculator = function () {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  calculator.historyLog = '';
};

const inputBackspace = function () {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand) {
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (displayValue.length > 1) {
    calculator.displayValue = displayValue.slice(0, -1);
  } else {
    calculator.displayValue = '0';
  }
};

const updateDisplay = function () {
  const display = document.querySelector('.calculator-screen-main');
  const displayHistory = document.querySelector('.calculator-screen-history');
  display.value = calculator.displayValue;
  displayHistory.value = calculator.historyLog;
};
updateDisplay();

keys.addEventListener('click', event => {
  const { target } = event;
  const { value } = target;

  // if (!target.matches('buttons')) return;

  if (value !== 'CE') {
    // Exclude only the "CE" button
    addToHistory(value);
  }

  switch (value) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
      handleOperator(value);
      break;
    case '.':
      inputDecimal(value);
      break;
    case 'all-clear':
      resetCalculator();
      break;
    case 'backspace':
      inputBackspace();
      break;
    case 'clear-entry':
      clearEntry();
      break;
    default:
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
      break;
  }
  updateDisplay();
});

///////////////////////////////////////
// History Log - Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnOpenModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
btnBigCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnLog.addEventListener('click', () => {
  // Update modal content
  historyLogModal.textContent = calculator.historyLog;
});
