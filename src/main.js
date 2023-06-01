import TripPresenter from './presenter/trip-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const filtersSection = document.querySelector('.trip-controls__filters');
const eventsSection = document.querySelector('.trip-events');

const tripEventsModel = new TripEventsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(eventsSection, tripEventsModel, filterModel);
tripPresenter.init();
const filterPresenter = new FilterPresenter(filtersSection, filterModel, tripEventsModel);

filterPresenter.init();

