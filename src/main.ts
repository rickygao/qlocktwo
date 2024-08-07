import './style.css';
import letters, { Letter } from './letters';

const appElement = document.getElementById('app');

const createLetterElement = (letter: Letter) => {
  const div = document.createElement('div');
  const span = document.createElement('span');
  const text = document.createTextNode(letter.name);
  div.appendChild(span);
  span.appendChild(text);
  div.classList.add('letter', ...letter.sections.map((s) => 'l-' + s));
  return div;
};

const collectElementsIntoDiv = (elements: HTMLElement[]) => {
  const div = document.createElement('div');
  div.append(...elements);
  return div;
};

const createClockElement = (letters: Letter[][]) => {
  const div = collectElementsIntoDiv(
    letters.map((row) => {
      const rowElement = collectElementsIntoDiv(row.map(createLetterElement));
      rowElement.classList.add('clock-row');
      return rowElement;
    })
  );
  div.classList.add('clock');
  return div;
};

const clockElement = createClockElement(letters);
appElement?.appendChild(clockElement);

type Time = {
  hours: number;
  minutes: number;
};

const dateToTime = (date: Date): Time => ({
  hours: date.getHours(),
  minutes: date.getMinutes()
});

const parseTime = (params: URLSearchParams): Time | undefined => {
  const [hParam, mParam] = [params.get('h'), params.get('m')];
  if (hParam === null || mParam === null) return;

  const [hours, minutes] = [parseInt(hParam, 10), parseInt(mParam, 10)];
  if (hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) return;

  return { hours, minutes };
}

const flush = ({ hours, minutes }: Time) => {
  const [h, m] = [hours % 12 || 12, minutes];
  const amOrPm = hours < 12 ? 'am' : 'pm';
  clockElement.className = `clock it is h-${h} m-${m} ${amOrPm}`;
};

const timeByNow = () => dateToTime(new Date());

const timeByMock = (origin: Time, fast?: boolean) => {
  const secondsPerMinute = fast ? 1 : 60;

  let originTimestamp = Date.now();
  return () => {
    const nowTimestamp = Date.now();
    const elapsedMinutes = Math.floor((nowTimestamp - originTimestamp) / (1000 * secondsPerMinute));
    const totalMinutes = (origin.hours * 60 + origin.minutes + elapsedMinutes) % (24 * 60);

    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  };
};

const init = (getTime: () => Time) => {
  flush(getTime());
  setInterval(() => flush(getTime()), 1000);
};

const params = new URLSearchParams(window.location.search);
const time = parseTime(params);
const fast = params.has('r');
init(time ? timeByMock(time, fast) : timeByNow);
