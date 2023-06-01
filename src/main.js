import TripPresenter from './presenter/trip-presenter.js';
import { render } from './framework/render.js';
import filtersView from './view/filters-view.js';
import TripEventsModel from './model/trip-events-model.js';
import FilterModel from './model/filter-model.js';
import { FILTER_TYPE } from './const.js';

const filtersSection = document.querySelector('.trip-controls__filters');
const eventsSection = document.querySelector('.trip-events');

const tripEventsModel = new TripEventsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(eventsSection, tripEventsModel);
tripPresenter.init();

const eventFilters = new filtersView(FILTER_TYPE.EVERYTHING);

const printSelectedFilter = () => console.log(eventFilters.selectedFilter);
eventFilters.setFilterChangeListener(printSelectedFilter);
render(eventFilters, filtersSection);

