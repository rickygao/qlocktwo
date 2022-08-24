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

const flushClockElement = (hours: number, minutes: number) => {
  const amOrPm = hours < 12 ? 'am' : 'pm';
  const h = hours % 12 || 12;
  const m = minutes;
  clockElement.className = `clock it is h-${h} m-${m} ${amOrPm}`;
};

const flushClockElementWithDate = (date: Date) =>
  flushClockElement(date.getHours(), date.getMinutes());

const init = () => {
  const params = new URLSearchParams(window.location.search);
  const [h, m] = [params.get('h'), params.get('m')];
  if (h !== null && m !== null) {
    const [hours, minutes] = [parseInt(h), parseInt(m)];
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      initWithHoursAndMinutes(hours, minutes, params.has('r'));
      return;
    }
  }
  initWithCurrentTime();
};

const initWithHoursAndMinutes = (
  hours: number,
  minutes: number,
  running?: boolean
) => {
  flushClockElement(hours, minutes);
  let runningMinutes = hours * 60 + minutes;
  if (running) {
    setInterval(() => {
      runningMinutes += 1;
      flushClockElement(
        Math.floor(runningMinutes / 60) % 24,
        runningMinutes % 60
      );
    }, 1000);
  }
};

const initWithCurrentTime = () => {
  flushClockElementWithDate(new Date());
  setInterval(() => flushClockElementWithDate(new Date()), 1000);
};

init();
