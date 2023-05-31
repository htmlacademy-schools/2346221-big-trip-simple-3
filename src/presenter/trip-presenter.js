import { render, RenderPosition } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import { updateItem } from '../utils.js';
import { sortDays, sortPrices } from '../utils.js';
import { SORT_TYPE } from '../const.js';

class TripPresenter {
  #tripEventsList = new TripEventsListView();
  #eventSorter = new EventListSortingView();
  #tripEventPresenter = new Map();
  #container;
  #tripEventsModel;
  #tripEvents;

  #currentSortType = SORT_TYPE.DAY;
  #sourcedTripEvents = [];

  init(container, tripEventsModel) {
    this.#container = container;
    this.#tripEventsModel = tripEventsModel;
    // получаем пункты для отрисовки
    this.#tripEvents = this.#tripEventsModel.tripEvents;

    render(this.#eventSorter, this.#container);
    //this.#renderSort();
    render(this.#tripEventsList, this.#container);
    if (this.#tripEvents.length){
      for (let i = 0; i < this.#tripEvents.length; i++) {
        this.#renderEvent(this.#tripEvents[i]);
      }
    } else {
      this.#renderEmptyList();
    }
  }

  #renderEmptyList = () => {
    const emptyListComponent = new EmptyListView('Everything');
    render(emptyListComponent, this.#container);
  };

  #renderEvent = (task) => {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList, this.#handleEventChange, this.#handleModeChange);
    tripEventPresenter.init(task);
    this.#tripEventPresenter.set(task.id, tripEventPresenter);
  };

  #clearEventList = () => {
    this.#tripEventPresenter.forEach((presenter) => presenter.destroy());
    this.#tripEventPresenter.clear();
  };

  #handleEventChange = (updatedEvent) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedEvent);
    this.#sourcedTripEvents = updateItem(this.#sourcedTripEvents, updatedEvent);
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

    this.#sortEvents(sortType);
    // - Очищаем список
    // - Рендерим список заново
  };

  #sortEvents = (sortType) => {
    switch (sortType) {
      case SORT_TYPE.DAY:
        this.#tripEvents.sort(sortDays);
        break;
      case SORT_TYPE.PRICE:
        this.#tripEvents.sort(sortPrices);
        break;
      default:
        this.#tripEvents = [...this.#sourcedTripEvents];
    }

    this.#currentSortType = sortType;
  };
}

export default TripPresenter;
