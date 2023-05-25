import { render, replace, remove } from '../framework/render.js';
import EventEditFormView from '../view/event-edit-form-view.js';
import TripEventView from '../view/trip-event-view.js';
import EmptyListView from '../view/empty-list-view.js';

export default class TripEventPresenter {
  #eventComponent = null;
  #eventEditorComponent = null;
  #container = null;
  #task = null;

  constructor(container) {
    this.#container = container;
  }

  init(task) {
    this.#task = task;
    this.#eventComponent = new TripEventView(task);

    this.#eventComponent.setEditClickListener(this.#replaceTaskToForm);
    render(this.#eventComponent, this.#container.element);
  }

  #replaceFormToTask = () => {
    this.#eventEditorComponent.removeAllListeners();
    this.#eventComponent.setEditClickListener(this.#replaceTaskToForm);
    replace(this.#eventComponent, this.#eventEditorComponent);
    remove(this.#eventEditorComponent);
  };

  #replaceTaskToForm = () => {
    if (!this.#container.isNewFormOrEditorOpen()){
      this.#eventEditorComponent = new EventEditFormView(this.#task);
      // нажатие на кнопку Save
      this.#eventEditorComponent.setFormSubmitListener(this.#replaceFormToTask);
      // нажатие на стрелку, чтобы закрыть форму
      this.#eventEditorComponent.setCloseButtonClickListener(this.#replaceFormToTask);
      // нажатие на кнопку Delete
      this.#eventEditorComponent.setDeleteButtonClickListener(this.#removeTask);
      // нажате на Esc для закрытия формы
      this.#eventEditorComponent.setEscKeydownListener(this.#replaceFormToTask);

      replace(this.#eventEditorComponent, this.#eventComponent);
    }
  };

  #removeTask = () => {
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
