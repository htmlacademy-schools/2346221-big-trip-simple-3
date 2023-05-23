import {createElement} from '../render.js';

class BaseView {
  #element = null;
  get template() {
    throw new Error('There is no template');
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

export default BaseView;
