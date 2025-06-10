class Cursor {
  #index = 0;

  get index() {
    return this.#index;
  }

  /** @param {Number} [amount] */
  increment(amount = 1) {
    this.#index += amount;
  }

  /** @param {Number} [amount] */
  decrement(amount = 1) {
    this.#index -= amount;
  }

  /** @param {Number} value */
  isLessThan(value) {
    return this.#index < value;
  }
}

module.exports = { Cursor };
