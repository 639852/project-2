const config = {
  day: 400,
  k: {
    1: 20,
    2: 35,
    3: 50
  },
  formula(x, num) {
    return x / Math.log10(x) * this.k[num]
  }
}

const amount = document.getElementsByClassName('amount')
const coinsForStack = document.querySelector('.staking > input')
const period = document.querySelector('.staking > select')
const button = document.querySelector('.staking > button')

document.addEventListener('keyup', (key) => {
  if (key.code === 'KeyD') amount[0].innerText++
})

coinsForStack.addEventListener('input', (e) => {
  const staking = document.querySelector('.staking')

  if (+e.target.value > +amount[0].innerText) {
    e.target.value = ''

    staking.setAttribute('data-error', 'Нельзя вводить значение больше, чем общее кол-во!')
  } else {
    staking.removeAttribute('data-error')
  }
})

button.addEventListener('click', getMoney)
coinsForStack.addEventListener('keydown', (key) => {
  if (key.code === 'Enter') getMoney()
})

function getMoney () {
  const x = coinsForStack.value
  const time = parseInt(period.options[period.selectedIndex].innerText)

  amount[0].innerText -= x
  coinsForStack.value = ''

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
  const num = period.value
  const days = document.querySelector('table tr:last-child td:nth-child(3)')
  const perOneDay = config.formula(x, num) / parseInt(days.innerText)
  let timer = parseInt(days.innerText)

  const id = setInterval(() => {
    const curSum = days.nextElementSibling
    
    if (timer <= 0) {
      amount[0].innerText = +(+amount[0].innerText + +config.formula(x, num)).toFixed(4)
      days.parentElement.remove()

      clearInterval(id)
    }

    days.innerText = `${timer}d`
    curSum.innerText = (+curSum.innerText + +perOneDay).toFixed(4)
    
    timer--
  }, config.day)
}
