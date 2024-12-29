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
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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
const formateMovementDate=function(date){
  const calcDayPassed=(date1,date2)=>Math.round(Math.abs(date2-date1)/(1000*60*60*24));
  const dayPassed=calcDayPassed(new Date(),date);
  console.log(dayPassed);
  if(dayPassed===0)return 'Today';
  if(dayPassed===1)return 'Yesterday';
  if(dayPassed<=7)return `${dayPassed} days ago`;
  const year=date.getFullYear();
  const month=`${date.getMonth()+1}`.padStart(2,0);
  const day=`${date.getDate()}`.padStart(2,0);
  return `${day}/${month}/${year}`;
}
const displayMovements =function(acc,sort=false){
    containerMovements.innerHTML='';
    const movs=sort? acc.movements.slice().sort((a,b)=>a-b):acc.movements;
    movs.forEach(function (mov,i){
       const date= formateMovementDate(new Date(acc.movementsDates[i]));
        const type=mov>0?'deposit':'withdrawal';
        const html=`
          <div class="movements__row">
              <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
              <div class="movements__date">${date}</div>
              <div class="movements__value">${mov.toFixed(2)}</div>
          </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin',html);
      });
};
// displayMovements(account1.movements);
const calcDisplayBalance=function(acc){
     acc.balance= acc.movements.reduce(function(acc,mov){
      return acc+mov;
    },0);
    labelBalance.textContent=`${acc.balance.toFixed(2)} EUR`;
  
};

// calcDisplayBalance(account1.movements);
const createUsernames=function(accs)
{
  accs.forEach(function(acc){
    acc.userName=acc.owner.toLowerCase().split(' ').map(name=>name[0]).join('');
  });
};
createUsernames(accounts);
const updateUI=function(acc){
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}
const withdrawls=account1.movements.filter(function(mov){
  return mov<0;
});
const calcDisplaySummary=function(account){
  const sumIn=account.movements
  .filter(mov=>mov>0)
  .reduce((acc,deposit)=>acc+deposit,0);
  labelSumIn.textContent=`${sumIn.toFixed(2)}€`;
  const sumOut=account.movements
  .filter(mov=>mov<0)
  .reduce((acc,withdraw)=>acc+withdraw,0);
  labelSumOut.textContent=`${Math.abs(sumOut).toFixed(2)}€`;

  const interest=account.movements
  .filter(mov=>mov>0)
  .map(deposit=>(deposit*account.interestRate)/100)
  .filter(int=>int>=1)
  .reduce((acc,int)=>acc+int,0);
  labelSumInterest.textContent=`${interest.toFixed(2)}€`;
}
// calcDisplaySummary(account1.movements);
let currentAccount;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount=accounts?.find(acc=>acc.userName===inputLoginUsername.value&&acc.pin===+inputLoginPin.value);
  console.log(currentAccount);
  if(currentAccount!==undefined)
  {
    labelWelcome.textContent=`Welcome,${currentAccount.owner.split(' ').at(0)}`;
    const date=new Date();
    const year=date.getFullYear();
    const month=`${date.getMonth()}`.padStart(2,0);
    const day=`${date.getDate()}`.padStart(2,0);
    const displayDate=`${day}/${month}/${year}`;
    labelDate.textContent=displayDate;
    containerApp.style.opacity=100;
    inputLoginUsername.value=inputLoginPin.value='';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Math.floor(inputTransferAmount.value); 
  const receiverAcc= accounts?.find(acc=>acc.userName===inputTransferTo.value);
  if(amount>0 && amount<=currentAccount.balance && receiverAcc
     && receiverAcc.userName!==currentAccount.userName)
     {
      currentAccount.movements.push(-amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movements.push(amount);
      receiverAcc.movementsDates.push(new Date().toISOString());
      inputTransferTo.value=inputTransferAmount.value='';
      inputTransferAmount.blur();
      updateUI(currentAccount);
     }
});
btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(inputCloseUsername.value===currentAccount.userName
     && +inputClosePin.value ===currentAccount.pin)
  {
    const index=accounts.findIndex(acc=>acc.userName===currentAccount.userName);
    accounts.splice(index,1);
    containerApp.style.opacity=0;
  }
});
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Math.floor(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(mov=>mov>=amount*0.1))
  {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputLoanAmount.value='';
});
let sorted=false;
btnSort.addEventListener('click',function(e){
  displayMovements(currentAccount,!sorted);
  sorted=!sorted;
});

//////////////////////////////////////////////////////
