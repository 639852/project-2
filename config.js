import { storage, numFix } from "./script.js"

const config = {
  anotherTimersStarted: false,
  fractionDigits: 4,
  defaultTime: 100,
  time: 100,
  day: 400,
  k: {
    1: 20,
    2: 35,
    3: 50
  },
  formula(x, num) {
    return Math.log10(x) * this.k[num] / 100
  },
  burnMoney() {
    storage.amount.innerText = numFix(storage.amount.innerText, Math.log(storage.amount.innerText), '/')

    this.time = this.defaultTime
  }
}

export default config
