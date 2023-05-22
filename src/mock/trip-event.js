import { getRandomArrayElement, getRandomInt } from '../utils.js';
import { TRIP_EVENT_TYPES } from '../const.js';
import dayjs from 'dayjs';

const generateRandomEventType = () => getRandomArrayElement(TRIP_EVENT_TYPES);

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];
  const randomIndex = getRandomInt(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generatePhotos = () => {
  const picturesNumber = getRandomInt(1, 5);
  const pictures = new Array(picturesNumber);
  for (let i = 0; i < pictures.length; ++i) {
    pictures[i] = {
      src: `http://picsum.photos/248/152?r${getRandomInt(0, 5)}`,
      description: generateDescription(),
    };
  }
  return pictures;
};

const generateRandomDates = (date = null) => {
  if (!date) {
    date = dayjs();
  }

  const minutesOffset = getRandomInt(-12 * 60, 12 * 60);
  const minutesDuration = getRandomInt(10, 60);

  const dateFrom = date.add(minutesOffset, 'minute');
  const dateTo = dateFrom.add(minutesDuration, 'minute');
  return {
    dateFrom: dateFrom,
    dateTo: dateTo,
  };
};

const destinationNames = [
  'Moscow',
  'SPB',
  'Voroneg',
  'Tula',
  'Orel',
];

const destinations = new Array();
destinationNames.forEach((name, index) => {
  destinations[index] = {
    id: index + 1,
    description: generateDescription(),
    name,
    pictures: generatePhotos(),
  };
});

const generateOffers = () => {
  const offers = new Array();
  const offersNumber = getRandomInt(5, 11);
  for (let id = 1; id < offersNumber + 1; ++id) {
    offers[id] = {
      id,
      title: `Offer ${id}`,
      price: getRandomInt(1, 100),
    };
  }
  return offers;
};

const getRandomDestination = () => getRandomArrayElement(destinations);

const generateTripEvents = (eventsNumber) => {
  const events = new Array(eventsNumber);
  const currentDate = dayjs();
  for (let i = 0; i < eventsNumber; ++i) {
    const { dateFrom, dateTo } = generateRandomDates(currentDate);
    events[i] = {
      id: i + 1,
      type: generateRandomEventType(),
      dateFrom,
      dateTo,
      basePrice: getRandomInt(1, 1000),
      offers: generateOffers(),
      destination: getRandomDestination(),
    };
  }
  return events;
};

export { generateTripEvents };
