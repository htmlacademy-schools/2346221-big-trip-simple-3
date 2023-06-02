import { render, RenderPosition, remove } from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import PointListSortingView from '../view/point-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { filter, sortDays, sortPrices } from '../utils.js';
import { SORT_TYPE, UPDATE_TYPE, USER_ACTION, FILTER_TYPE } from '../const.js';

class TripPresenter {
  #tripPointsList = new TripPointsListView();
  #emptyListComponent = null;
  #pointSorter = null;
  #tripPointPresenter = new Map();
  #container = null;
  #newPointPresenter = null;
  #tripPointsModel = null;
  #filterModel = null;

  #filterType = FILTER_TYPE.EVERYTHING;
  #sortType = SORT_TYPE.DAY;

  constructor (container, tripPointsModel, filterModel) {
    this.#container = container;
    this.#tripPointsModel = tripPointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter(this.#tripPointsList.element, this.#handleViewAction);

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#tripPointsModel.points;
    const filteredTasks = filter[this.#filterType](points);

    switch (this.#sortType) {
      case SORT_TYPE.DAY:
        return filteredTasks.sort(sortDays);
      case SORT_TYPE.PRICE:
        return filteredTasks.sort(sortPrices);
    }

    return filteredTasks;
  }

  createTask = (callback) => {
    this.#sortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
    this.#newPointPresenter.init(callback);
  };

  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterType);
    render(this.#emptyListComponent, this.#container);
  };

  #renderPoint = (task) => {
    const tripPointPresenter = new TripPointPresenter(this.#tripPointsList, this.#handleViewAction, this.#handleModeChange);
    tripPointPresenter.init(task);
    this.#tripPointPresenter.set(task.id, tripPointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((task) => this.#renderPoint(task));
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();

    remove(this.#pointSorter);
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#sortType = SORT_TYPE.DAY;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case USER_ACTION.UPDATE_TASK:
        this.#tripPointsModel.updatePoint(updateType, update);
        break;
      case USER_ACTION.ADD_TASK:
        this.#tripPointsModel.addPoint(updateType, update);
        break;
      case USER_ACTION.DELETE_TASK:
        this.#tripPointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#tripPointPresenter.get(data.id).init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearPointList();
        this.#renderBoard();
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    this.#pointSorter = new PointListSortingView(this.#sortType);
    this.#pointSorter.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#pointSorter, this.#container, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }

    this.#sortType = sortType;
    this.#clearPointList();
    this.#renderBoard();
  };

  #renderBoard = () => {
    const points = this.points;
    const pointCount = points.length;
    if (pointCount === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();

    render(this.#tripPointsList, this.#container);
    this.#renderPoints();
  };
}

export default TripPresenter;
