import { render, RenderPosition } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import { sortDays, sortPrices } from '../utils.js';
import { SORT_TYPE } from '../const.js';

class TripPresenter {
  #tripEventsList = new TripEventsListView();
  #eventSorter = new EventListSortingView();
  #tripEventPresenter = new Map();
  #container;
  #tripEventsModel;

  #currentSortType = SORT_TYPE.DAY;

  constructor (container, tripEventsModel) {
    this.#container = container;
    this.#tripEventsModel = tripEventsModel;
  }

  init() {
    this.#renderBoard();
  }

  get events() {
    switch (this.#currentSortType) {
      case SORT_TYPE.DAY:
        return [...this.#tripEventsModel.tripEvents].sort(sortDays);
      case SORT_TYPE.PRICE:
        return [...this.#tripEventsModel.tripEvents].sort(sortPrices);
    }

    return this.#tripEventsModel.tripEvents;
  }

  #renderEventList = () => {
    render(this.#tripEventsList, this.#container);
    this.#renderEvents();
  };

  #renderEmptyList = () => {
    const emptyListComponent = new EmptyListView('Everything');
    render(emptyListComponent, this.#container);
  };

  #renderEvent = (task) => {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList, this.#handleEventChange, this.#handleModeChange);
    tripEventPresenter.init(task);
    this.#tripEventPresenter.set(task.id, tripEventPresenter);
  };

  #renderEvents = () => {
    this.events.forEach((task) => this.#renderEvent(task));
  };

  #clearEventList = () => {
    this.#tripEventPresenter.forEach((presenter) => presenter.destroy());
    this.#tripEventPresenter.clear();
  };

  #handleEventChange = (updatedEvent) => {
    // Здесь будем вызывать обновление модели
    this.#tripEventPresenter.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#tripEventPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    render(this.#eventSorter, this.#container, RenderPosition.AFTERBEGIN);
    this.#eventSorter.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderEventList();
  };

  #renderBoard = () => {
    if (!this.events) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderEventList();
  };
}

export default TripPresenter;
