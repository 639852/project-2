import State from './state.js'
import config from "./config.js"

export const storage = new State()

storage.add('amount', document.querySelector('.amount'))
storage.add('coinsForStack', document.querySelector('.staking > input'))
storage.add('period', document.querySelector('.staking > select'))
storage.add('button', document.querySelector('.staking > button'))

document.addEventListener('keyup', (key) => {
  if (key.code === 'KeyD') storage.amount.innerText = numFix(storage.amount.innerText, 1)
})

storage.coinsForStack.addEventListener('input', (e) => {
  const staking = document.querySelector('.staking')

  if (+e.target.value > +storage.amount.innerText) {
    e.target.value = ''

    staking.setAttribute('data-error', 'Нельзя вводить значение больше, чем общее кол-во!')
  } else {
    staking.removeAttribute('data-error')
  }
})

storage.button.addEventListener('click', getMoney)
storage.coinsForStack.addEventListener('keydown', (key) => {
  if (key.code === 'Enter') getMoney()
})

function getMoney () {
  const x = storage.coinsForStack.value
  const time = parseInt(storage.period.options[storage.period.selectedIndex].innerText)
  const staking = document.querySelector('.staking')

  storage.coinsForStack.value = ''

  if (+x > 1) {
    storage.amount.innerText = numFix(storage.amount.innerText, x, '-')

    addDataToTable(x, `${time}d`, 0)

    timer(x)
  } else {
    staking.setAttribute('data-error', 'Нельзя вводить значение меньше 1!')
  }
}

function addDataToTable (sum, period, curSum) {
  const table = document.querySelector('table > tbody')
  const tr = `
    <tr>
      <td>${sum}</td>
      <td>${period}</td>
      <td>${period}</td>
      <td>${curSum}</td>
    </tr>
  `
  
  table.insertAdjacentHTML('beforeend', tr)
}

function timer (x) {
  const num = storage.period.value
  const days = document.querySelector('table tr:last-child td:nth-child(3)')
  const fullSum = config.formula(x, num) * parseInt(days.innerText) + +x
  const curSum = days.nextElementSibling
  let timer = parseInt(days.innerText)
  let stop = true

  const id = setInterval(() => {
    if (config.time <= 0) config.burnMoney()
    if (timer <= 0) {
      storage.amount.innerText = numFix(storage.amount.innerText, fullSum)
      
      days.parentElement.remove()
      config.anotherTimersStarted = false

      clearInterval(id)
      return
    }
    
    if (!config.anotherTimersStarted) {
      config.anotherTimersStarted = true
      stop = false
    }
    if (!stop) config.time--

    days.innerText = `${timer}d`
    curSum.innerText = numFix(curSum.innerText, config.formula(x, num))
    
    timer--
  }, config.day)
}

export function numFix (a, b, operator = '+') {
  const frDig = config.fractionDigits

  if (operator === '+') return +(+a + +b).toFixed(frDig)
  if (operator === '-') return +(+a - +b).toFixed(frDig)
  if (operator === '*') return +(+a * +b).toFixed(frDig)
  if (operator === '/') return +(+a / +b).toFixed(frDig)
}
