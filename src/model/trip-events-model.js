import { generateTripEvents } from '../mock/trip-event.js';
import Observable from '../framework/observable.js';

export default class TripEventsModel extends Observable {
  #tripEvents = generateTripEvents(5);

  get tripEvents () {
    return this.#tripEvents;
  }
}
