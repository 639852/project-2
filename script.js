import State from './state.js'
import config from "./config.js"

const storage = new State()

storage.add('amount', document.querySelector('.amount'))
storage.add('coinsForStack', document.querySelector('.staking > input'))
storage.add('period', document.querySelector('.staking > select'))
storage.add('button', document.querySelector('.staking > button'))

document.addEventListener('keyup', (key) => {
  if (key.code === 'KeyD') storage.amount.innerText++
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

  storage.amount.innerText = +(storage.amount.innerText - x).toFixed(4)
  storage.coinsForStack.value = ''

  addDataToTable(x, `${time}d`, 0)

  timer(x)
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
  const arr = config.arrayTimers
  let timer = parseInt(days.innerText)

  arr.push(parseInt(days.innerText))

  if (arr.length > 1) {
    const [b, a] = arr
    const curDays = document.querySelector(`table tr:nth-child(${arr.length - 1}) td:nth-child(3)`)

    arr[0] = parseInt(curDays.innerText)
    config.time += Math.abs(a - b)
  }

  const id = setInterval(() => {
    if (timer <= 0) {
      storage.amount.innerText = +(+storage.amount.innerText + +fullSum).toFixed(4)
      
      days.parentElement.remove();
      (arr[0] > arr[1]) ? arr.pop() : arr.shift()

      clearInterval(id)
      return
    }

    days.innerText = `${timer}d`
    curSum.innerText = (+curSum.innerText + +config.formula(x, num)).toFixed(4)

    if (config.time <= 0) config.burnMoney()
    
    timer--
    config.time--
  }, config.day)
}
