const config = {
  arrayTimers: [],
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
    storage.amount.innerText = (storage.amount.innerText / Math.log(storage.amount.innerText)).toFixed(4)

    this.time = this.defaultTime
  }
}

export default config
