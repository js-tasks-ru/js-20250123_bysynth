export default class ColumnChart {
  element = null;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.element = this.createElement(this.createTemplate());
    this.toggleSkeleton();
  }

  createElement(html) {
    const elem = document.createElement('div');
    elem.innerHTML = html;

    return elem.firstElementChild;
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  createLinkTemplate() {
    if (this.link) {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }

    return '';
  }

  createColumnChartTemplate() {
    return this.getColumnProps(this.data)
      .map(({value, percent}) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
      .join('');
  }

  createTemplate() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.createLinkTemplate()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.createColumnChartTemplate()}
          </div>
        </div>
      </div>
    `;
  }

  toggleSkeleton() {
    this.data.length === 0
      ? this.element.classList.add('column-chart_loading')
      : this.element.classList.remove('column-chart_loading');
  }

  update(newData) {
    this.data = newData;
    this.toggleSkeleton();
    this.element.querySelector('[data-element="body"]').innerHTML = this.createColumnChartTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
