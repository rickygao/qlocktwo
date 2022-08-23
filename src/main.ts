import './style.css';
import letters, { Letter } from './letters';

function createLetterDivElement(letter: Letter) {
  const div = document.createElement('div');
  const span = document.createElement('span');
  const text = document.createTextNode(letter.name);
  div.appendChild(span);
  span.appendChild(text);
  div.classList.add('letter', ...letter.sections.map((s) => 'l-' + s));
  return div;
}

function collectElementsIntoDiv(elements: HTMLElement[]) {
  const div = document.createElement('div');
  div.append(...elements);
  return div;
}

const clockElement = collectElementsIntoDiv(
  letters.map((row) => {
    const rowElement = collectElementsIntoDiv(row.map(createLetterDivElement));
    rowElement.classList.add('clock-row');
    return rowElement;
  })
);

const appElement = document.getElementById('app');
appElement?.appendChild(clockElement);

const flushClockElement = (hours: number, minutes: number) => {
  const amOrPm = hours < 12 ? 'am' : 'pm';
  const h = hours % 12 || 12;
  const m = minutes;
  clockElement.className = `clock it is h-${h} m-${m} ${amOrPm}`;
};

const flushClockElementWithDate = (date: Date) =>
  flushClockElement(date.getHours(), date.getMinutes());

function init() {
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
}

function initWithHoursAndMinutes(
  hours: number,
  minutes: number,
  running?: boolean
) {
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
}

function initWithCurrentTime() {
  flushClockElementWithDate(new Date());
  setInterval(() => flushClockElementWithDate(new Date()), 1000);
}

init();
