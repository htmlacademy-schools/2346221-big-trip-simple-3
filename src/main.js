import TripPresenter from './presenter/trip-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';

const filtersSection = document.querySelector('.trip-controls__filters');
const pointssSection = document.querySelector('.trip-events');
const buttonSection = document.querySelector('.trip-main');

const tripPointssModel = new TripPointsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(pointssSection, tripPointssModel, filterModel);
tripPresenter.init();
const filterPresenter = new FilterPresenter(filtersSection, filterModel, tripPointssModel);

filterPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createTask(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, buttonSection);
newPointButtonComponent.setClickListener(handleNewPointButtonClick);

