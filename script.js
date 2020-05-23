const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');


const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//add transaction
const addTransaction = (e) => {
  e.preventDefault();

  if (!text.value.trim() || !amount.value.trim()) {
    alert('Please add text and amount!')
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      amount: +amount.value
    };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
};

// generate random id 

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

//add transaction to DOM list
const addTransactionDOM = (transaction) => {
  //get the sign
  const sign = transaction.amount < 0 ? '-' : '+';
  
  //create a new element
  const item = document.createElement("li");

  //add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
  <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`;
  list.appendChild(item);
};

//update the balance/income/expense
const updateValues = () => {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((add, amount) => add += amount, 0).toFixed(2);

  const expense = (amounts
    .filter(amount => amount < 0)
    .reduce((add, amount) => add += amount, 0) * (-1))
    .toFixed(2);
  
  const income = amounts
    .filter(amount => amount > 0)
    .reduce((add, amount) => add += amount, 0)
    .toFixed(2);
  
  balance.innerText = `£${total}`;
  money_plus.innerText = `£${income}`;
  money_minus.innerText = `£${expense}`;
}

//remove transaction by ID
const removeTransaction = (id) => {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
};
//update local storage transaction
const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};
//init app
const init = () => {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
};
init();

//event listener
form.addEventListener('submit', addTransaction);
