import fetchJson from './utils/fetch-json.js';
import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
  subElements = {};
  url;

  constructor({
    url = '',
    range = {},
    label = '',
    link = '',
    formatHeading = data => data
  } = {}) {
    super({label, link, formatHeading});
    this.url = url;
    this.from = range.from;
    this.to = range.to;
    this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createUrl(from, to) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.append('from', from.toISOString());
    url.searchParams.append('to', to.toISOString());

    return url;
  }

  async fetchData(from, to) {
    return fetchJson(this.createUrl(from, to));
  }

  async update(from, to) {
    const rawData = await this.fetchData(from, to);
    const data = Object.values(rawData);

    const value = data.reduce((acc, cur) => acc + cur, 0);
    this.subElements.header.innerText = this.formatHeading(value);

    super.update(data);

    return rawData;
  }
}
