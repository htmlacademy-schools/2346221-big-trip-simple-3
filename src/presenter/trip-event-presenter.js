import { render, replace, remove } from '../framework/render.js';
import EventEditFormView from '../view/event-edit-form-view.js';
import TripEventView from '../view/trip-event-view.js';
import EmptyListView from '../view/empty-list-view.js';

export default class TripEventPresenter {
  #eventComponent = null;
  #eventEditorComponent = null;
  #container = null;
  #event = null;

  constructor(container) {
    this.#container = container;
  }

  init(event) {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditorComponent = this.#eventEditorComponent;

    this.#eventComponent = new TripEventView(event);
    this.#eventEditorComponent = new EventEditFormView(event);

    this.#eventComponent.setEditClickListener(this.#replaceEventToForm);

    // нажатие на кнопку Save
    this.#eventEditorComponent.setFormSubmitListener(this.#replaceFormToEvent);
    // нажатие на стрелку, чтобы закрыть форму
    this.#eventEditorComponent.setCloseButtonClickListener(this.#replaceFormToEvent);
    // нажатие на кнопку Delete
    this.#eventEditorComponent.setDeleteButtonClickListener(this.destroy);

    if (prevEventComponent === null || prevEventEditorComponent === null) {
      render(this.#eventComponent, this.#container.element);
      return 0;
    }

    if (this.#container.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#container.contains(prevEventEditorComponent.element)) {
      replace(this.#eventEditorComponent, prevEventEditorComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditorComponent);
  }

  #replaceFormToEvent = () => {
    this.#eventEditorComponent.removeEscKeydownListener();
    replace(this.#eventComponent, this.#eventEditorComponent);
  };

  #replaceEventToForm = () => {
    if (!this.#container.isNewFormOrEditorOpen()){
      // нажате на Esc для закрытия формы
      this.#eventEditorComponent.setEscKeydownListener(this.#replaceFormToEvent);

      replace(this.#eventEditorComponent, this.#eventComponent);
    }
  };

  destroy = () => {
    this.#eventEditorComponent.removeAllListeners();
    remove(this.#eventEditorComponent);
    this.#eventComponent.removeEditClickListener();
    remove(this.#eventComponent);
    if (this.#container.element.childElementCount === 0) {
      const epmtyList = new EmptyListView('Everything');
      render(epmtyList, this.#container.element);
    }
  };
}
