import { render } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';

class TripPresenter {
  #tripEventsList = new TripEventsListView();
  #eventSorter = new EventListSortingView();
  #container;
  #tripEventsModel;
  #tripTasks;

  init(container, tripEventsModel) {
    this.#container = container;
    this.#tripEventsModel = tripEventsModel;
    // получаем пункты для отрисовки
    this.#tripTasks = this.#tripEventsModel.tripEvents;

    render(this.#eventSorter, this.#container);
    render(this.#tripEventsList, this.#container);
    if (this.#tripTasks.length){
      for (let i = 0; i < this.#tripTasks.length; i++) {
        this.#renderTask(this.#tripTasks[i]);
      }
    } else {
      this.#renderEmptyList();
    }
  }

  #renderEmptyList = () => {
    const emptyListComponent = new EmptyListView('Everything');
    render(emptyListComponent, this.#container);
  };

  #renderTask = (task) => {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList);
    tripEventPresenter.init(task);
  };
}

export default TripPresenter;
