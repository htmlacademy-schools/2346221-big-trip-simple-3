import { render, replace, remove } from '../framework/render.js';
import PointEditFormView from '../view/point-edit-form-view.js';
import TripPointView from '../view/trip-point-view.js';
import { USER_ACTION, UPDATE_TYPE } from '../const.js';
import { isDatesEqual } from '../utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPointPresenter {
  #pointComponent = null;
  #pointEditorComponent = null;

  #container = null;
  #changeData = null;
  #changeMode = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditorComponent = this.#pointEditorComponent;

    this.#pointComponent = new TripPointView(point);
    this.#pointEditorComponent = new PointEditFormView(point);

    this.#pointComponent.setEditClickListener(this.#replacePointToForm);

    // нажатие на кнопку Save
    this.#pointEditorComponent.setFormSubmitListener(this.#handleFormSubmit);
    // нажатие на стрелку, чтобы закрыть форму
    this.#pointEditorComponent.setCloseButtonClickListener(this.#replaceFormToPoint);
    // нажатие на кнопку Delete
    this.#pointEditorComponent.setDeleteButtonClickListener(this.#handleDeleteClick);

    if (prevPointComponent === null || prevPointEditorComponent === null) {
      render(this.#pointComponent, this.#container.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditorComponent, prevPointEditorComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditorComponent);
  }

  #replaceFormToPoint = () => {
    this.#pointEditorComponent.reset(this.#point);
    replace(this.#pointComponent, this.#pointEditorComponent);
    this.#pointEditorComponent.removeEscKeydownListener();
    this.#mode = Mode.DEFAULT;
  };

  #replacePointToForm = () => {
    // нажате на Esc для закрытия формы
    this.#pointEditorComponent.setEscKeydownListener(this.#replaceFormToPoint);
    this.#changeMode();
    this.#mode = Mode.EDITING;

    replace(this.#pointEditorComponent, this.#pointComponent);
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateTo, update.dateTo) ||
      this.#point.basePrice !== update.basePrice;

    this.#changeData(
      USER_ACTION.UPDATE_TASK,
      isMinorUpdate ? UPDATE_TYPE.MINOR : UPDATE_TYPE.PATCH,
      update,
    );

    this.#replaceFormToPoint();
  };

  destroy = () => {
    remove(this.#pointEditorComponent);
    remove(this.#pointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditorComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleDeleteClick = (point) => {
    this.#pointEditorComponent.removeEscKeydownListener();
    this.#changeData(
      USER_ACTION.DELETE_TASK,
      UPDATE_TYPE.MINOR,
      point,
    );
  };
}