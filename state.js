class State {
  add(name, el) {
    Object.defineProperty(this, name, {
      get() {
        return el
      },
      set(value) {
        el = value
      }
    })
  }
}

export default State
