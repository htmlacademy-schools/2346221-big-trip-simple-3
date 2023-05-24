import { render } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list.js';
import EventEditorView from '../view/event-editor-view.js';
import TripEventView from '../view/trip-event-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { createOnEscKeydownFunction } from '../utils.js';

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
    this.#tripTasks = [...this.#tripEventsModel.tripEvents];

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
    const taskComponent = new TripEventView(task);
    let taskEditorComponent;
    let onEditorEscKeydownListener;

    const removeTask = () => {
      this.#tripEventsList.element.removeChild(taskEditorComponent.element);
      document.removeEventListener('keydown', onEditorEscKeydownListener);
    };

    const replaceFormToTask = () => {
      this.#tripEventsList.element.replaceChild(taskComponent.element, taskEditorComponent.element);
      document.removeEventListener('keydown', onEditorEscKeydownListener);
      taskEditorComponent = null;
    };

    const replaceTaskToForm = () => {
      taskEditorComponent = new EventEditorView(task);
      this.#tripEventsList.element.replaceChild(taskEditorComponent.element, taskComponent.element);

      // нажатие на кнопку Save
      taskEditorComponent.element.querySelector('.event--edit').addEventListener('submit', (evt) => {
        evt.preventDefault();
        replaceFormToTask();
      });
      // нажатие на стрелку, чтобы закрыть форму
      taskEditorComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
        replaceFormToTask();
      });

      // нажатие на кнопку Delete
      taskEditorComponent.element.querySelector('.event__reset-btn').addEventListener('click', () => {
        removeTask();
        taskEditorComponent.removeElement();
        taskComponent.removeElement();
        taskEditorComponent = null;
        const taskIndex = this.#tripTasks.indexOf(task);
        this.#tripTasks.splice(taskIndex, 1);
        if (!this.#tripTasks.length) {
          this.#renderEmptyList();
        }
      });
    };

    // нажатие на стрелку, чтобы открыть форму
    taskComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      if (!this.#tripEventsList.isNewFormOrEditorOpen()) {
        replaceTaskToForm();
        onEditorEscKeydownListener = createOnEscKeydownFunction(document, replaceFormToTask);
      }
    });

    render(taskComponent, this.#tripEventsList.element);
  };
}

export default TripPresenter;
