'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//CREATING USERNAMES
function createUsername(acc) {
  const usernameWrds = acc.owner.toLowerCase().split(' ');
  let username = '';
  usernameWrds.forEach(function (wrd) {
    username += wrd[0];
  });

  acc.username = username;
}

accounts.forEach(function (account) {
  createUsername(account);
});

//UI UPDATE
function updateUI(acc) {
  //display movements
  function displayMov(movements) {
    containerMovements.innerHTML = '';
    movements.forEach(function (mov, i) {
      const type = mov < 0 ? 'withdrawal' : 'deposit';
      const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  }

  //calculate and display balance
  function calcDispBalance(acc) {
    acc.balance = acc.movements.reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
    labelBalance.textContent = acc.balance + ' €';
  }

  //calculate and display summary
  function calcDispSummary(acc) {
    const sumDeposits = acc.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);

    const sumWithdrawals = acc.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);

    const sumInterest = acc.movements
      .filter((mov) => mov > 0)
      .map((deposit) => (deposit * acc.interestRate) / 100)
      .filter((interest) => interest > 1)
      .reduce((acc, interest) => acc + interest, 0);

    labelSumIn.textContent = sumDeposits + '€';
    labelSumOut.textContent = Math.abs(sumWithdrawals) + '€';
    labelSumInterest.textContent = sumInterest + '€';
  }

  displayMov(acc.movements);
  calcDispBalance(acc);
  calcDispSummary(acc);
}

let accLoggedIn;

//LOGIN FUNCTIONALITY
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //prevents page reload
  inputLoginPin.blur(); //removes focus from active input-pin element

  const enteredUsername = inputLoginUsername.value;
  const enteredPin = Number(inputLoginPin.value);

  accLoggedIn = accounts.find(function (currAcc) {
    return currAcc.username === enteredUsername;
  });

  if (enteredPin === accLoggedIn?.pin) {
    //CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    //WELCOME TEXT
    labelWelcome.textContent = `Welcome Back, ${
      accLoggedIn.owner.split(' ')[0]
    }`;

    updateUI(accLoggedIn);

    containerApp.style.opacity = 100;
  }
});

//TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //prevents reloading
  inputTransferAmount.blur(); //removes focus

  const receiverAccUsername = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);

  const receiverAcc = accounts.find(function (currAcc) {
    return currAcc.username === receiverAccUsername;
  });

  if (
    receiverAcc &&
    receiverAcc !== accLoggedIn &&
    transferAmount > 0 &&
    transferAmount <= accLoggedIn.balance
  ) {
    inputTransferTo.value = inputTransferAmount.value = '';

    receiverAcc.movements.push(transferAmount);
    accLoggedIn.movements.push(-1 * transferAmount);

    updateUI(accLoggedIn);
  }
});

//CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === accLoggedIn.username &&
    Number(inputClosePin.value) === accLoggedIn.pin
  ) {
    const index = accounts.findIndex(function (currAcc) {
      return currAcc.username === inputCloseUsername.value;
    });

    accounts.splice(index, 1);

    inputCloseUsername.value = inputClosePin.value = '';

    containerApp.style.opacity = 0;
  }
});
